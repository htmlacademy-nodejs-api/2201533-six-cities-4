import {GenerateConfig} from '../../types/generate-config.type';
import {BIG_SIZE, DEFAULT_CONFIG_PATH, DefaultConfig, Parameters} from '../cli-consts/consts.js';
import {readFile} from 'node:fs/promises';
import {ProgressBar} from './progress-bar.js';
import {stdout as output} from 'node:process';
import {formatInt} from './format-int.js';
import chalk from 'chalk';

export const getUserParams = (params: string[][]) => {
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

export const parseParameters = async (parameters: string[]): Promise<GenerateConfig> => {
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

export function createProgressGenerate (isCreateBig: boolean, count: number) {
  const width = isCreateBig ? 30 : 10;
  const progressCount = new ProgressBar(count as number, width);
  const revertRowsCount = isCreateBig ? -2 : -1;
  const progressSize = isCreateBig ? new ProgressBar(BIG_SIZE, width) : null;
  return (row: number, size: number) => {
    if (row > 1) {
      output.moveCursor(0, revertRowsCount);
    }
    console.log(` ${progressCount.getProgress(row)}${chalk.blue(
      `Строка ${formatInt(row)} из ${formatInt(count as number)}`)}`);
    if (isCreateBig){
      console.log(` ${progressSize?.getProgress(size)}${chalk.blue(
        `Записано ${formatInt(size)} байт из ${formatInt(BIG_SIZE)}`)}`);
    }
  };
}
