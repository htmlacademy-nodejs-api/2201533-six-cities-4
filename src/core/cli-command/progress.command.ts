import {CliCommandInterface} from './cli-command.interface.js';
import { stdout as output } from 'node:process';
import {ProgressBar} from '../helpers/progress-bar.js';
import {formatInt} from '../helpers/format-int.js';

export default class ProgressCommand implements CliCommandInterface {
  public readonly name = '--progress';
  public async execute(): Promise<void> {
    let i = 0;
    const max = 128;
    const progressBar = new ProgressBar(max);
    console.log(progressBar.getProgress(0));
    const interval = setInterval(() => {
      output.moveCursor(0, -1);
      console.log(` ${progressBar.getProgress(++ i)} ${formatInt(i)} из ${formatInt(max)}`);
      if (i === 128) {
        clearInterval(interval);
      }
    }, 200);
  }
}
