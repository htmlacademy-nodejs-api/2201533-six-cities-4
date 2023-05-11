import {CliCommandInterface} from './cli-command.interface.js';
import { stdout as output } from 'node:process';
import {progressBar} from '../helpers/progress-bar.js';

export default class ProgressCommand implements CliCommandInterface {
  public readonly name = '--progress';
  public async execute(): Promise<void> {
    let i = 0;
    const max = 128;
    const interval = setInterval(() => {
      console.log(progressBar(++ i, max));
      if (i === 128) {
        clearInterval(interval);
      }
    }, 200);
    console.log('Строка1');
    output.moveCursor(0, -1);
    console.log('Строка2');
  }
}
