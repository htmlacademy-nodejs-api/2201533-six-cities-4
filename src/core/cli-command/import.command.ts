import TSVFileReader from '../file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './cli-command.interface.js';
import chalk from 'chalk';
import {Offer} from '../../types/offer.type.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  private onLine(offer: Offer) {
    console.log(offer.title);
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported.`);
  }

  public async execute(filename: string): Promise<void> {
    if (!filename){
      console.log(`
  ${chalk.redBright('после')} --import ${chalk.redBright('укажите путь к файлу')}
  ${chalk.cyanBright('пример:')} npm run ts ./src/main.cli.ts -- --import ./mocks/mock-data.tsv`);
      return;
    }
    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);
    try {
      await fileReader.read();

    } catch (err) {

      if (!(err instanceof Error)) {
        throw err;
      }

      console.log(`Не удалось импортировать данные из файла по причине: «${err.message}»`);
    }
  }
}
