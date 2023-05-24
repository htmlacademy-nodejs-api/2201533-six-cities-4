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
import {ConfigInterface} from '../config/config.interface.js';
import {RestSchema} from '../config/rest.schema.js';
import ConfigService from '../config/config.service.js';
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

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private progress: ImportProgressType | undefined;
  private loaded = 0;
  private userCount = 0;
  private offerCount = 0;
  private readonly salt: string = '';
  private readonly logger: LoggerInterface;
  private config: ConfigInterface<RestSchema>;
  private userService: UserServiceInterface;
  private offerService: OfferServiceInterface;
  private cityService: CityServiceInterface;

  constructor() {
    this.progress = createProgressImport();
    this.logger = new ImportLoggerService(this.progress.message);
    this.config = new ConfigService(this.logger);
    this.salt = this.config.get('SALT');
    this.userService = new UserService(this.logger, UserModel);
    this.offerService = new OfferService(this.logger, OfferModel);
    this.cityService = new CityService(this.logger, CityModel);
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

  private async onLine(line: string, rowNumber: number, resolve: () => void) {
    if (rowNumber > this.userCount) {
      await this.saveOffer(createOffer(line));
      resolve();
    } else {
      await this.saveUser(createUser(line));
      resolve();
    }
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported.`);
  }

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

    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);
    fileReader.on('read', this.onRead);
    output.write('\u001B[?25l');
    console.log(chalk.greenBright(`Импорт строк предложений из ${filename}`));
    try {
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
    }
  }
}
