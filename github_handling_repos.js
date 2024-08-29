const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const port = process.env.PORT || 8080;
const gitHubApiAddress = "https://api.github.com/";

// function to create repo api link
function createRepoApiLink(repoName, accountName) {
  const repoApiLink =
    gitHubApiAddress + "repos/" + accountName + "/" + repoName;
  return repoApiLink;
}

// REPO-FUNCTIONS
// function to get repoinfo from api
async function getRepoInfo(repoApiLink) {
  try {
    const res = await fetch(repoApiLink);
    const result = await res.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

// function to get commitInfo from api
async function getRepoCommitInfo(repoApiLink) {
  const repoCommitsApiLink = repoApiLink + "/commits";
  try {
    const res = await fetch(repoCommitsApiLink);
    const result = await res.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

// function to get last five commits
function getLastFiveCommitMessages(repoCommitInfo) {
  let commitMessagesArray = [];

  if (repoCommitInfo.length === 0) return null;

  for (let i = 0; i < repoCommitInfo.length && i < 5; i++) {
    commitMessagesArray.push(repoCommitInfo[i].commit.message);
  }
  return commitMessagesArray;
}

// function to get the date of the last commit
function getLatestCommitDate(repoCommitInfo) {
  if (repoCommitInfo.length === 0) return null;

  return repoCommitInfo[0].commit.author.date.slice(0, 10);
}

// function to create object from repoInfo
function createRepoInfoObject(repoInfo, commitMessagesArray, lastCommitDate) {
  const repoInfoObject = {
    lastCommitDate,
    creationDate: repoInfo.created_at.slice(0, 10),
    description: repoInfo.description,
    language: repoInfo.language,
    repoLink: repoInfo.html_url,
    recentCommits: commitMessagesArray,
  };

  return repoInfoObject;
}

module.exports = {
  createRepoApiLink,
  getRepoInfo,
  getLastFiveCommitMessages,
  getLatestCommitDate,
  createRepoInfoObject,
  getRepoCommitInfo,
};
