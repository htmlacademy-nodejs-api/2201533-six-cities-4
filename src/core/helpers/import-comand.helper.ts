import {ProgressBar} from './progress-bar.js';
import {stdout as output} from 'node:process';
import {formatInt} from './format-int.js';

export type ImportProgressType = {
  row: (rowCount: number) => void;
  loaded: (loaded: number) => void;
}

const WIDTH = 30;
const REVERT_ROWS_COUNT = -2;
export function createProgressImport (size: number, rowsCount: number): ImportProgressType {
  const progressLoad = new ProgressBar(size, WIDTH);
  const progressRows = new ProgressBar(rowsCount, WIDTH);
  let rowNumber = 0;
  let barBytes = '';
  let barRows = '';
  let byteCount = 0;
  const outputProgress = () => {
    if (rowNumber > 0) {
      output.moveCursor(0, REVERT_ROWS_COUNT);
    }
    output.write(`${barRows} Загружено: ${formatInt(rowNumber)} строк из ${rowsCount}.`);
    output.clearLine(1);
    output.write('\n');
    console.log(`${barBytes} Загружено: ${byteCount} байт из ${size}`);
  };
  const setRow = (rowCount: number) => {
    rowNumber = rowCount;
    barRows = progressRows.getProgress(rowCount);
    outputProgress();
  };
  const setLoaded = (loaded: number) => {
    byteCount = loaded;
    barBytes = progressLoad.getProgress(loaded);
    outputProgress();
  };
  return ({row: setRow, loaded: setLoaded});
}
