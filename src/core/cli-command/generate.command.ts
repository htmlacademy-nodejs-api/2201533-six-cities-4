import got from 'got';
import { readFile, mkdir, open } from 'node:fs/promises';
import { CliCommandInterface } from './cli-command.interface.js';
import OfferGenerator from '../../modules/offer-generator/offer-generator.js';
import {BIG_SIZE, DEFAULT_CONFIG_PATH, DefaultConfig, Parameters} from '../cli-consts/consts.js';
import {GenerateConfig} from '../../types/generate-config.type.js';
import path from 'node:path';
import {existsSync, close, fstatSync} from 'node:fs';
import {MockData, MockUsersData} from '../../types/mock-data.type.js';
import TSVFileWriter from '../file-writer/tsv-file-writer.js';

const getUserParams = (params: string[][]) => {
  const config: GenerateConfig = {} as GenerateConfig;
  params.forEach((param) => {
    const key = Parameters[param[0].substring(1) as keyof typeof Parameters] as keyof GenerateConfig;
    if (key.startsWith('is')) {
      config[key] = true;
    } else if (param[1]) {
      config[key] = param[1];
    }
  });
  return config;
};

const parseParameters = async (parameters: string[]): Promise<GenerateConfig> => {
  const params = Array.from(parameters,(param, index) =>
    ([param, parameters[index + 1]])).filter((param) =>
    param[0].startsWith('-')).map((param) => {
    if (!param[1] || param[1].startsWith('-')) {
      param[1] = '';
    }
    return param;
  });
  let pathConfig = params.splice(params.findIndex((param) =>
    param[0] === '-config'), 1)[0][1];
  pathConfig = pathConfig ? pathConfig : DEFAULT_CONFIG_PATH;
  const config: GenerateConfig = {} as GenerateConfig;
  Object.assign(config, DefaultConfig);
  if (pathConfig){
    try {
      Object.assign(config, JSON.parse(await readFile(pathConfig, { encoding: 'utf8' })));
    } catch (err){
      console.error(`Can't read config file from path: ${pathConfig}: ${err}`);
    }
  }
  Object.assign(config, getUserParams(params));
  return config;
};

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockData;
  private usersData!: MockUsersData;

  public async execute(...parameters:string[]): Promise<void> {
    const params = await parseParameters(parameters);
    const {jsonURL, usersEnd, offersEnd, count, isCreatePath, isCreateBig} = params;
    const mockPath: string = params.mockPath as string;
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
    const minSize = isCreateBig ? BIG_SIZE : 0;
    try {
      let i = 0;
      let size = 0;
      const tsvFileWriter = new TSVFileWriter(fileHandle);
      do {
        await tsvFileWriter.write(offerGeneratorString.generate());
        i ++;
        size = fstatSync(fileHandle.fd).size;
        process.stdout.write(`${i}: ${size}\r`);
      } while (count > i || minSize > size);
    } catch(err) {
      if (fileHandle) {
        close(fileHandle.fd);
      }
      console.log(`Can't write data to file: ${mockPath}.: ${err}`);
      return;
    }
    console.log(`File ${mockPath} was created!`);
  }
}
