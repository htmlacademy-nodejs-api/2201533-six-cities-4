import {ProgressBar} from './progress-bar.js';
import {stdout as output} from 'node:process';
import chalk from 'chalk';
import {formatInt} from './format-int.js';

export type ImportProgressType = {
  row: (rowTitle: string, rowCount: number) => void;
  loaded: (loaded: number) => void;
}

const WIDTH = 30;
const REVERT_ROWS_COUNT = -2;
export function createProgressImport (size: number): ImportProgressType {
  const progress = new ProgressBar(size, WIDTH);
  let title = '';
  let rowNumber = 0;
  let bar = '';
  let byteCount = 0;
  const outputProgress = () => {
    if (rowNumber > 0) {
      output.moveCursor(0, REVERT_ROWS_COUNT);
    }
    output.write(chalk.blue(`Строка № ${formatInt(rowNumber)}. Предложение: ${title}.`));
    output.clearLine(1);
    output.write('\n');
    console.log(`${bar} Загружено: ${byteCount} байт из ${size}`);
  };
  const setRow = (rowTitle: string, rowCount: number) => {
    title = rowTitle;
    rowNumber = rowCount;
    outputProgress();
  };
  const setLoaded = (loaded: number) => {
    byteCount = loaded;
    bar = progress.getProgress(loaded);
    outputProgress();
  };
  return ({row: setRow, loaded: setLoaded});
}
