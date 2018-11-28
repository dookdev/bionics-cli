#!/usr/bin/env node

const inquirer = require('inquirer'),
    chalk = require('chalk'),
    figlet = require('figlet'),
    shell = require('shelljs'),
    _path = require('path'),
    log = console.log,
    packageJson = require('./package.json'),
    rootPath = _path.dirname(require.main.filename);

const init = () => {
    log(
        chalk.rgb(64, 224, 208)(
            figlet.textSync('bionics cli', {
                font: 'Ghost',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    );
    log(chalk.green.bold('bionics cli version: ' + packageJson.version));
    log(chalk.green.bold('Author: ' + packageJson.author));
}

const askQuestions = () => {
    const questions = [
        {
            name: 'PROJECTNAME',
            type: 'input',
            message: '[?] What is the project name?'
        },
        {
            name: 'PROJECTTYPE',
            type: 'list',
            message: '[?] What do you want project type?',
            choices: ['Angular-web-template', 'Nodejs-server-template'],
            filter: function (val) {
                return val;
            }
        }
    ];
    return inquirer.prompt(questions);
};

const createProject = (projectName, projectType) => {
    const path = `${process.cwd()}/${projectName}`;
    shell.mkdir('-p', path);
    if (projectType === 'Angular-web-template') {
        shell.cp('-Rf', `${rootPath}/master/angular-web-template`, `${process.cwd()}/${projectName}`);
        shell.cd(`${process.cwd()}/${projectName}/angular-web-template`);
        shell.sed('-i', 'projectname', projectName, 'package.json');
        shell.cd(`${process.cwd()}/${projectName}`);
    } else if (projectType === 'Nodejs-server-template') {

    }
    return path;
};

const success = path => {
    log(chalk.green(`Done! created at ${path}`));
};

const run = async () => {
    // show script introduction
    init();
    // ask questions
    const answers = await askQuestions();
    const { PROJECTNAME, PROJECTTYPE } = answers;
    // create the file
    const path = createProject(PROJECTNAME, PROJECTTYPE);
    // show success message
    success(path);
};

run();