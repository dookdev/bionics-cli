#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const shell = require('shelljs');
const log = console.log;

const init = () => {
    log(
        chalk.green(
            figlet.textSync('bionics cli', {
                font: 'Ghost',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    );
    log(chalk.blue.bold('version 1.0.0'));
}

const askQuestions = () => {
    const questions = [
        {
            name: 'FILENAME',
            type: 'input',
            message: 'What is the name of the file without extension?'
        },
        {
            type: 'list',
            name: 'EXTENSION',
            message: 'What is the file extension?',
            choices: ['.rb', '.js', '.php', '.css'],
            filter: function (val) {
                return val.split('.')[1];
            }
        }
    ];
    return inquirer.prompt(questions);
};

const createFile = (filename, extension) => {
    const filePath = `${process.cwd()}/${filename}.${extension}`
    shell.touch(filePath);
    return filePath;
};

const success = filepath => {
    log(chalk.green(`Done! File created at ${filepath}`));
};

const run = async () => {
    // show script introduction
    init();
    // ask questions
    const answers = await askQuestions();
    const { FILENAME, EXTENSION } = answers;
    // create the file
    const filePath = createFile(FILENAME, EXTENSION);
    // show success message
    success(filePath);
};

run();