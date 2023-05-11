import {CliCommandInterface} from './cli-command.interface.js';
import {formatInt} from '../helpers/format-int.js';

export default class FormatCommand implements CliCommandInterface {
  public readonly name = '--format';
  public async execute(val: string): Promise<void> {
    console.log(`${formatInt(parseInt(val, 10))}`);
  }
}
