const fs = require('fs');
const util = require('util');
const axios = require('axios');
const inquirer = require('inquirer');

const writeFileAsync = util.promisify(fs.writeFile);
const appendFileAsync = util.promisify(fs.appendFile);
const readFileAsync = util.promisify(fs.readFile);

function promptUser() {
  return inquirer.prompt({
    message: 'Enter your GitHub username:',
    name: 'username',
  });
}

function getUser(username) {
  return axios
    .get(`https://api.github.com/users/${username}/repos?per_page=100`)
    .catch(err => {
      console.log(`User not found`);
      process.exit(1);
    });
}

function generateHTML(userinfo) {
  userinfo.map(
    repo => `
    #${repo.name}`
  );
}

async function init() {
  console.log('hi');
  try {
    const answers = await promptUser();

    const info = await getUser(answers.username);

    const userinfo = await info;

    const markdown = generateHTML(userinfo);

    await writeFileAsync('readme.md', markdown);

    console.log('Successfully wrote to readme.md');
  } catch (err) {
    console.log(err);
  }
}

init();
