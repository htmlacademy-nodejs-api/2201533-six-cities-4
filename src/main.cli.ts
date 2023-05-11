#!/usr/bin/env node
import CLIApplication from './app/cli.js';
import HelpCommand from './core/cli-command/helper.command.js';
import VersionCommand from './core/cli-command/version.command.js';
import ImportCommand from './core/cli-command/import.command.js';
import StealDataCommand from './core/cli-command/steal-data.command.js';
import GenerateCommand from './core/cli-command/generate.command.js';
import FormatCommand from './core/cli-command/format.command.js';
import ProgressCommand from './core/cli-command/progress.command.js';

const myManager = new CLIApplication();
myManager.registerCommands([
  new HelpCommand, new VersionCommand,
  new ImportCommand, new StealDataCommand,
  new GenerateCommand, new FormatCommand,
  new ProgressCommand
]);
myManager.processCommand(process.argv);
