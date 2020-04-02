const fs = require('fs');
const util = require('util');
const axios = require('axios');
const inquirer = require('inquirer');

// const writeFileAsync = util.promisify(fs.writeFile);
// const appendFileAsync = util.promisify(fs.appendFile);
// const readFileAsync = util.promisify(fs.readFile);
function promptUser() {
  inquirer
    .prompt({
      message: 'Enter your GitHub username:',
      name: 'username',
    })
    .then(function({ username }) {
      const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;

      axios.get(queryUrl).then(function(res) {
        const repoNames = res.data.map(function(repo) {
          return repo.name;
        });

        const repoNamesStr = repoNames.join('\n');

        fs.writeFile('readme.md', repoNamesStr, function(err) {
          if (err) {
            throw err;
          }

          console.log(`Saved ${repoNames.length} to the readme.md file`);
        });
      });
    });
}

promptUser();

// function generateHTML(){
//   const render = `
//   # ${}
//   `;
//   return render;
// }
// async function init() {
//   console.log('hi');
//   try {
//     const answers = await promptUser();

//     const html = generateHTML(answers);

//     await writeFileAsync('index.html', html);

//     console.log('Successfully wrote to index.html');
//   } catch (err) {
//     console.log(err);
//   }
// }

// init();
