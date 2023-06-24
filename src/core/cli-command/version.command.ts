import {readFileSync} from 'node:fs';
import {CliCommandInterface} from './cli-command.interface.js';
import path from 'node:path';
import chalk from 'chalk';

export default class VersionCommand implements CliCommandInterface {
  public readonly name = '--version';
  private info = {name: '', version: '', description: ''};
  private readVersion(): void {
    const contentPageJSON = readFileSync(path.resolve('./package.json'), 'utf-8');
    this.info = JSON.parse(contentPageJSON);
  }

  public async execute(): Promise<void> {
    this.readVersion();
    console.log(`${this.info.name} v${chalk.green(this.info.version)}  ${chalk.grey(`#${this.info.description}`)}`);
  }
}
