import {CliCommandInterface} from './cli-command.interface.js';
import {FormatInt} from '../helpers/format-int.js';

export default class FormatCommand implements CliCommandInterface {
  public readonly name = '--format';
  public async execute(val: string): Promise<void> {
    console.log(`${FormatInt(parseInt(val, 10))}`);
  }
}
