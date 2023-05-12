import {ProgressBar} from "./progress-bar";
import {BIG_SIZE} from "../cli-consts/consts";
import {stdout as output} from "process";
import chalk from "chalk";
import {formatInt} from "./format-int";

export function createProgressImport (size: number) {
  const width = 30;
  const progress = new ProgressBar(size, width);
  const revertRowsCount = -2;
  return (row: number, size: number) => {
    if (row > 0) {
      output.moveCursor(0, revertRowsCount);
    }
    console.log(` ${LEFT_BRACKET}${chalk.cyan(
      progressCount.getProgress(row))}${RIGHT_BRACKET}${chalk.blue(
      `Строка ${formatInt(row)} из ${formatInt(count as number)}`)}`);
    if (isCreateBig){
      console.log(` ${LEFT_BRACKET}${chalk.cyan(
        progressSize?.getProgress(size))}${RIGHT_BRACKET}${chalk.blue(
        `Записано ${formatInt(size)} байт из ${formatInt(BIG_SIZE)}`)}`);
    }
  };
}
