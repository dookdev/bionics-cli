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
        await fileProcessWeb(projectName);
        await excGit();
        await excNPM();
        return path;
    } else if (projectType === 'Nodejs-server-template') {
        return;
    }
};

const fileProcessWeb = (projectName) => {
    return new Promise((resove, reject) => {
        shell.cp('-Rf', `${rootPath}/master/angular-web-template/*`, `${process.cwd()}/${projectName}`);
        shell.cp('-Rf', `${rootPath}/master/angular-web-template/.editorconfig`, `${process.cwd()}/${projectName}`);
        shell.cp('-Rf', `${rootPath}/master/angular-web-template/.gitignore`, `${process.cwd()}/${projectName}`);
        shell.cd(`${process.cwd()}/${projectName}`);
        shell.sed('-i', 'angular-web', projectName, 'package.json');
        resove();
    });
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
                if (shell.exec('git commit -m "auto-commit"').code !== 0) {
                    log(chalk.red('Error: Git commit failed'));
                    shell.exit(1);
                    reject();
                } else {
                    log(chalk.green('Success: git init and auto-commit'));
                    resove();
                }
            }
        }
    });
};

const excNPM = () => {
    log(chalk.blue('Waiting...: npm install package'));
    return new Promise((resove, reject) => {
        if (shell.exec('npm i').code !== 0) {
            log(chalk.red('Error: npm i failed'));
            shell.exit(1);
            reject();
        } else {
            log(chalk.green('npm install success'));
            if (shell.exec('code .').code !== 0) {
                log(chalk.red('Error: code . failed to open Visual Studio Code'));
                shell.exit(1);
                reject();
            } else {
                log(chalk.green('Success'));
                resove();
            }
        }
    });
};

const success = path => {
    log(chalk.green(`Done! created project at ${path}`));
};

const run = async () => {
    init();
    const answers = await askQuestions();
    const { PROJECTNAME, PROJECTTYPE } = answers;
    const path = await createProject(PROJECTNAME, PROJECTTYPE);
    success(path);
};

run();