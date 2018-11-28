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

const createProject = async (projectName, projectType) => {
    const path = `${process.cwd()}/${projectName}`;
    shell.mkdir('-p', path);
    if (projectType === 'Angular-web-template') {
        shell.cp('-Rf', `${rootPath}/master/angular-web-template/*`, `${process.cwd()}/${projectName}`);
        shell.cd(`${process.cwd()}/${projectName}`);
        shell.sed('-i', 'projectname', projectName, 'package.json');
        await excGit();
        return path;
    } else if (projectType === 'Nodejs-server-template') {
        return;
    }
};

const excGit = () => {
    return new Promise((resove, reject) => {
        if (shell.exec('git init').code !== 0) {
            log(chalk.red('Error: Git init failed'));
            shell.exit(1);
            reject();
        } else {
            if (shell.exec('git add -A').code !== 0) {
                log(chalk.red('Error: Git add failed'));
                shell.exit(1);
                reject();
            } else {
                if (shell.exec('git commit -m "Auto-commit"').code !== 0) {
                    log(chalk.red('Error: Git commit failed'));
                    shell.exit(1);
                    reject();
                } else {
                    log(chalk.green('success git init and Auto-commit'));
                    resove();
                }
            }
        }
    });
};

const excNPM = () => {
    shell.exec('npm install');
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
    const path = await createProject(PROJECTNAME, PROJECTTYPE);
    // show success message
    success(path);
};

run();