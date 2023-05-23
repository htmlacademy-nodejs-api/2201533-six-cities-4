import TSVFileReader from '../file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './cli-command.interface.js';
import chalk from 'chalk';
import {FileHandle, open} from 'node:fs/promises';
import {createProgressImport, ImportProgressType} from '../helpers/import-comand.helper.js';
import {fstatSync} from 'node:fs';
import {stdout as output} from 'node:process';
import {createOffer} from '../helpers/offer.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private progress: ImportProgressType | undefined;
  private loaded = 0;
  private userCount = 0;
  private offerCount = 0;

  private async saveUser(user: User) {

  }

  private async saveOffer(offer: Offer) {
    const categories = [];
    const user = await this.userService.findOrCreate({
      ...offer.user,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    for (const {name} of offer.categories) {
      const existCategory = await this.categoryService.findByCategoryNameOrCreate(name, {name});
      categories.push(existCategory.id);
    }

    await this.offerService.create({
      ...offer,
      categories,
      userId: user.id,
    });
  }

  private async onLine(line: string, rowNumber: number, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
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
      this.progress = createProgressImport(fstatSync(fileHandle.fd).size, this.userCount + this.offerCount);
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
