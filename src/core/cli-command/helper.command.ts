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
            --generate [-options]        ${chalk.cyan.italic('# генерирует произвольное количество тестовых данных')}
                options:
                    -config <path>:          ${chalk.cyan.italic(`# путь к файлу конфигурации,
                                              если путь не указан будет применён параметр по умолчанию:`)}
                                              ./src/core/cli-consts/generate.config.json
                    -url <url>:              ${chalk.cyan.italic('# url json сервера, по умолчанию:')} http://localhost:3123
                    -offer <endpoint>:       ${chalk.cyan.italic('# endpoint mocr data для offers, по умолчанию:')} offerApi
                    -user <endpoint>:        ${chalk.cyan.italic('# endpoint mocr data для users, по умолчанию:')} userApi
                    -count <n>:              ${chalk.cyan.italic('# количество генерируемых фальшивых предложений, по умолчанию:')} 10
                    -mock <path>:            ${chalk.cyan.italic('# путь к генерируемому tsv файлу, по умолчанию:')} ./temp/mock-data.tsv
                    -createpath:             ${chalk.cyan.italic(`# будет создана директория для tsv файла при её отсутствии,
                                              по умолчанию:`)} false
                    -big:                    ${chalk.cyan.italic(`# будет создан 2Гб+ файл, при этом ограничение count сработает только
                                              после достижения цели по размеру файла, по умолчанию:`)} false

                        ${chalk.green.italic('Приоритетно применяются опции из коммандной строки, в случае отсутствия опций и наличия')} -config,
                    ${chalk.green.italic('будут считаны соответствующие параметры из файла конфигурации. Затем используются параметры по умолчанию.')}

                    ${chalk.cyan('Пример файла конфигурации:')}
                    {
                        ${chalk.magentaBright('"jsonURL"')}${chalk.yellow.bold(':')}${chalk.green(' "http://localhost:3123"')}${chalk.yellow.bold(',')}
                        ${chalk.magentaBright('"offersEnd"')}${chalk.yellow.bold(':')}${chalk.green(' "offerApi"')}${chalk.yellow.bold(',')}
                        ${chalk.magentaBright('"usersEnd"')}${chalk.yellow.bold(':')}${chalk.green(' "userApi"')}${chalk.yellow.bold(',')}
                        ${chalk.magentaBright('"count"')}${chalk.yellow.bold(':')}${chalk.blue(' 5')}${chalk.yellow.bold(',')}
                        ${chalk.magentaBright('"mockPath"')}${chalk.yellow.bold(':')}${chalk.green(' "./temporary/mock-data.tsv"')}${chalk.yellow.bold(',')}
                        ${chalk.magentaBright('"isCreatePath"')}${chalk.yellow.bold(':')}${chalk.yellow(' true')}${chalk.yellow.bold(',')}
                        ${chalk.magentaBright('"isCreateBig"')}${chalk.yellow.bold(':')}${chalk.yellow(' true')}
                    }
        `);
  }
}
