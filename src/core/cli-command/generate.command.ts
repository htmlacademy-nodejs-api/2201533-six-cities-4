import got from 'got';
import { mkdir, open } from 'node:fs/promises';
import { CliCommandInterface } from './cli-command.interface.js';
import OfferGenerator from '../../modules/offer-generator/offer-generator.js';
import {BIG_SIZE} from '../cli-consts/consts.js';
import path from 'node:path';
import {existsSync, close, fstatSync} from 'node:fs';
import {MockData, MockUsersData} from '../../types/mock-data.type.js';
import TSVFileWriter from '../file-writer/tsv-file-writer.js';
import { stdout as output } from 'node:process';
import {createProgress, parseParameters} from '../helpers/generate-command.helpers.js';
import chalk from 'chalk';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockData;
  private usersData!: MockUsersData;

  public async execute(...parameters:string[]): Promise<void> {
    const params = await parseParameters(parameters);
    const {jsonURL, usersEnd, offersEnd, count, isCreatePath, isCreateBig} = params;
    const mockPath: string = params.mockPath as string;
    const minSize = isCreateBig ? BIG_SIZE : 0;
    const progress = createProgress(isCreateBig as boolean, count as number);
    try {
      this.initialData = await got.get(`${jsonURL}/${offersEnd}`).json();
    } catch {
      console.log(`Can't fetch data from ${jsonURL}/${offersEnd}.`);
      return;
    }
    try {
      this.usersData = await got.get(`${jsonURL}/${usersEnd}`).json();
    } catch {
      console.log(`Can't fetch data from ${jsonURL}/${usersEnd}.`);
      return;
    }
    this.initialData.emails = this.usersData.emails;
    const offerGeneratorString = new OfferGenerator(this.initialData);
    if (!existsSync(path.dirname(mockPath)) && isCreatePath) {
      try {
        await mkdir(path.dirname(mockPath));
      } catch {
        console.log(`Can't to create directory: ${path.dirname(mockPath)}.`);
      }
    }
    const fileHandle = await open(mockPath, 'w');
    try {
      let row = 0;
      let size = 0;
      const tsvFileWriter = new TSVFileWriter(fileHandle);
      console.log(chalk.greenBright('Создание строк фейковых данных и запись в файл ".tsv"'));
      output.write('\u001B[?25l');
      do {
        await tsvFileWriter.write(offerGeneratorString.generate());
        size = fstatSync(fileHandle.fd).size;
        progress(row, size);
        row ++;
      } while (count > row || minSize > size);
      output.write('\u001B[?25h');
    } catch(err) {
      if (fileHandle) {
        close(fileHandle.fd);
      }
      output.write('\u001B[?25h');
      console.log(`Can't write data to file: ${mockPath}.: ${err}`);
      return;
    }
    console.log(`File ${mockPath} was created!`);
  }
}
