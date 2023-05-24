import TSVFileReader from '../file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './cli-command.interface.js';
import chalk from 'chalk';
import {FileHandle, open} from 'node:fs/promises';
import {createProgressImport, ImportProgressType} from '../helpers/import-comand.helper.js';
import {fstatSync} from 'node:fs';
import {stdout as output} from 'node:process';
import {createOffer} from '../helpers/offer.js';
import CreateUserDto from '../../modules/user/dto/create-user.dto.js';
import {UserServiceInterface} from '../../modules/user/user-service.interface.js';
import {LoggerInterface} from '../logger/logger.interface.js';
import {config, DotenvParseOutput} from 'dotenv';
import UserService from '../../modules/user/user.service.js';
import {UserModel} from '../../modules/user/user.entity.js';
import {createUser} from '../helpers/user.js';
import {Offer} from '../../types/offer.type.js';
import {OfferServiceInterface} from '../../modules/offer/offer-service.interface.js';
import OfferService from '../../modules/offer/offer.service.js';
import {OfferModel} from '../../modules/offer/offer.entity.js';
import {CityServiceInterface} from '../../modules/city/city-service.interface.js';
import CityService from '../../modules/city/city.service.js';
import {CityModel} from '../../modules/city/city.entity.js';
import ImportLoggerService from '../logger/import-logger.service.js';
import {DatabaseClientInterface} from '../database-client/database-client.interface.js';
import MongoClientService from '../database-client/mongo-client.service.js';
import {getMongoURI} from '../helpers/mongo-conection-string.js';
import {cities} from '../../types/cities.enum.js';
import ConsoleLoggerService from '../logger/console.service.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private progress: ImportProgressType | undefined;
  private loaded = 0;
  private userCount = 0;
  private offerCount = 0;
  private readonly salt: string = '';
  private readonly logger: LoggerInterface;
  private readonly config!: DotenvParseOutput;
  private userService: UserServiceInterface;
  private offerService: OfferServiceInterface;
  private cityService: CityServiceInterface;
  private databaseService!: DatabaseClientInterface;

  constructor() {
    this.progress = createProgressImport();
    this.logger = new ImportLoggerService(this.progress.message);
    this.config = config().parsed as DotenvParseOutput;
    this.salt = this.config['SALT'];
    this.userService = new UserService(this.logger, UserModel);
    this.offerService = new OfferService(this.logger, OfferModel);
    this.cityService = new CityService(this.logger, CityModel);
    this.databaseService = new MongoClientService(
      new ConsoleLoggerService(),
      parseInt(this.config['DB_CONNECT_RETRY_COUNT'], 10),
      parseInt(this.config['B_CONNECT_RETRY_TIMEOUT'], 10)
    );
  }

  private async fillCities() {
    const cityValues = Object.values(cities);
    if (await this.cityService.getCount() === cityValues.length) {
      return;
    }
    for (const city of cityValues) {
      await this.cityService.create(city);
    }
  }

  private async saveUser(user: CreateUserDto) {
    await this.userService.findOrCreate(user, this.salt);
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findByEmail(offer.host);
    const city = await this.cityService.findByName(offer.city.name);

    if (!user || !city) {
      return;
    }
    await this.offerService.create({
      ...offer,
      host: user.id,
      city: city.id,
    });
  }

  private onLine = async (line: string, rowNumber: number, resolve: () => void) => {
    if (rowNumber > this.userCount) {
      await this.saveOffer(createOffer(line));
      resolve();
    } else {
      const user = createUser(line);
      await this.saveUser(user);
      resolve();
    }
    this.progress?.row(rowNumber);
  };

  private onComplete = (count: number) => {
    this.databaseService.disconnect();
    console.log(`${count} rows imported.`);
  };

  private onRead = (chunkSize: number) => {
    this.progress?.loaded(this.loaded += chunkSize);
  };

  public async execute(filename: string): Promise<void> {
    if (!filename){
      console.log(`
  ${chalk.redBright('после')} --import ${chalk.redBright('укажите путь к файлу')}
  ${chalk.cyanBright('пример:')} npm run ts ./src/main.cli.ts -- --import ./mocks/mock-data.tsv`);
      return;
    }
    let fileHandle: FileHandle;
    try {
      fileHandle = await open(filename.trim());
    } catch {
      console.log(`Can't open file: ${filename}`);
      return;
    }
    const fileReader = new TSVFileReader(fileHandle);
    const uri = getMongoURI(
      this.config['DB_USER'],
      this.config['DB_PASSWORD'],
      this.config['DB_HOST'],
      this.config['DB_PORT'],
      this.config['DB_NAME'],
    );
    await this.databaseService.connect(uri);
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);
    fileReader.on('read', this.onRead);
    output.write('\u001B[?25l');
    console.log(chalk.greenBright(`Импорт строк предложений из ${filename}`));
    try {
      await this.fillCities();
      [this.userCount, this.offerCount] = await fileReader.getRowsCount();
      this.progress?.param(fstatSync(fileHandle.fd).size, this.userCount + this.offerCount);
      await fileReader.read();
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }
      console.log(`Не удалось импортировать данные из файла по причине: «${err.message}»`);
    } finally {
      output.write('\u001B[?25h');
      await fileHandle.close();
      await this.databaseService.disconnect();
    }
  }
}
