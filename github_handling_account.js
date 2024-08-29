const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const gitHubApiAddress = "https://api.github.com/";

// function to set user link
function getAccountLink(githubApi, accountName) {
  const accountApiLink = githubApi + "users/" + accountName;
  return accountApiLink;
}

// USER-FUNCTIONS
// function to retrieve user account api data
async function getAccountData(accountApiLink) {
  try {
    const res = await fetch(accountApiLink);
    const result = await res.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

// function to retrieve user repo data
async function getAccountRepoData(accountApiLink) {
  const reposLink = accountApiLink + "/repos";
  try {
    const res = await fetch(reposLink);
    const result = await res.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

// function to retrieve repos with links
function getReposArray(accountApiRepoData) {
  let reposArray = [];

  for (let i = 0; i < accountApiRepoData.length && i < 5; i++) {
    reposArray.push(accountApiRepoData[i].name);
  }
  return reposArray;
}

// function to store userInformation to object
function storeAccountInformationObject(accountApiData, accountRepoArray) {
  let creation_date = accountApiData.created_at.slice(0, 10);

  const accountInfoObject = {
    creation_date,
    avatar_url: accountApiData.avatar_url,
    name: accountApiData.name,
    userName: accountApiData.login,
    bio: accountApiData.bio,
    repoCount: accountApiData.public_repos,
    repoNames: accountRepoArray,
    accountLink: accountApiData.html_url,
  };

  return accountInfoObject;
}

module.exports = {
  getAccountData,
  getAccountLink,
  getAccountRepoData,
  storeAccountInformationObject,
  getReposArray,
};
