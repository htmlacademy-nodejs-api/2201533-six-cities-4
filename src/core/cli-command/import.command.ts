import TSVFileReader from '../file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './cli-command.interface.js';
import chalk from 'chalk';
import {Offer} from '../../types/offer.type.js';
import {FileHandle, open} from 'node:fs/promises';
import {createProgressImport, ImportProgressType} from '../helpers/import-comand.helper.js';
import {fstatSync} from 'node:fs';
import {stdout as output} from 'node:process';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private progress: ImportProgressType | undefined;
  private loaded = 10;
  private onLine = (offer: Offer, rowNumber: number) => {
    this.progress?.row(offer.title, rowNumber);
  };

  private onComplete(count: number) {
    console.log(`${count} rows imported.`);
  }

  private onRead = (chunkSize: number) => {
    // this.loaded += chunkSize;
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
    this.progress = createProgressImport(fstatSync(fileHandle.fd).size);
    const fileReader = new TSVFileReader(fileHandle);
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);
    fileReader.on('read', this.onRead);
    output.write('\u001B[?25l');
    console.log(chalk.greenBright(`Импорт строк предложений из ${filename}`));
    try {
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
