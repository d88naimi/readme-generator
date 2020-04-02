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
function axiosCall(username) {
  const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;

  axios
    .get(queryUrl)
    .then(function(res) {
      res.data.map(function(repo) {
        return appendFileAsync('readme.md', `${repo.name}\n`);
      });
    })
    .then(function() {
      return readFileAsync('readme.md', 'utf8');
    })
    .then(function(data) {
      console.log('Saved dad jokes:');
      console.log(data);
    })
    .catch(function(err) {
      console.log(err);
    });
}

async function init() {
  console.log('hi');
  try {
    const answers = await promptUser();

    const info = await axiosCall(answers);

    // const html = generateHTML(answers);

    // await writeFileAsync('index.html', html);

    console.log('Successfully wrote to readme.md');
  } catch (err) {
    console.log(err);
  }
}

init();
