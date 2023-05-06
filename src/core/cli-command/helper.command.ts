import { CliCommandInterface } from './cli-command.interface.js';
import chalk from 'chalk';
export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
        ${chalk.blue.bold('Программа для подготовки данных для REST API сервера.')}
        ${chalk.cyan('Пример:')}
            main.js --<command> [--arguments]
        ${chalk.cyan('Команды:')}
            --version:                   ${chalk.cyan.italic('# выводит номер версии')}
            --help:                      ${chalk.cyan.italic('# печатает этот текст')}
            --import <path>:             ${chalk.cyan.italic('# импортирует данные из TSV')}
            --generate <n> <path> <url>  ${chalk.cyan.italic('# генерирует произвольное количество тестовых данных')}
        `);
  }
}
