const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const app = express();
const port = process.env.PORT || 8080;
const accountInfoFilePath = path.join(__dirname, "account-info.json");
const repoInfoFilePath = path.join(__dirname, "repo-info.json");
const gitHubApiAddress = "https://api.github.com/";
const gitHubAccountHandler = require("./github_handling_account");
const gitHubRepoHandler = require("./github_handling_repos");
const cors = require("cors");

// middleware
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

// Set up corsOptions
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

// function for writing json
function writeJson(object, filePath, type) {
  const objectJson = JSON.stringify(object);

  fs.writeFile(filePath, objectJson, "utf8", (error) => {
    if (error) {
      console.log("Error writing file");
    } else {
      console.log(`${type} information written.`);
    }
  });
}

// function for reading json
function readJson(filePath) {
  try {
    const object = fs.readFileSync(filePath);
    return JSON.parse(object);
  } catch (error) {
    // Message non-existing file creates file if it does not exist
    console.log("Directory not found, writing new one.");
    fs.writeFileSync(filePath, JSON.stringify([]));
    return [];
  }
}

// Post and get for userInformation
// Post for account information
app.post("/api/user", async (req, res) => {
  const { accountUserName } = req.body;

  try {
    // Create api link with req.body from front-end
    const accountApiLink = gitHubAccountHandler.getAccountLink(
      gitHubApiAddress,
      accountUserName
    );

    // Get api data
    let accountApiData = await gitHubAccountHandler.getAccountData(
      accountApiLink
    );

    // Handle non-existent users
    if (accountApiData.status) {
      res.status(404).json({ message: "No user with that name." });
    } else if (accountApiData.message) {
      res.status(400).json({ message: "API rate limit reached" });
    } else {
      // get account repo data
      let accountApiRepoData = await gitHubAccountHandler.getAccountRepoData(
        accountApiLink
      );

      let accountRepoArray =
        gitHubAccountHandler.getReposArray(accountApiRepoData);

      let accountInfoObject =
        gitHubAccountHandler.storeAccountInformationObject(
          accountApiData,
          accountRepoArray
        );

      writeJson(accountInfoObject, accountInfoFilePath, "User");
      res.status(200).json({ message: "User information captured" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// get user information
app.get("/api/user", async (req, res) => {
  let accountInfo = readJson(accountInfoFilePath);
  res.json(accountInfo);
});

// POST and GET for selected repo

// POST
app.post("/api/repo", async (req, res) => {
  const { accountUserName, repoName } = req.body;
  try {
    // Create link to selected repo api
    const repoApiLink = gitHubRepoHandler.createRepoApiLink(
      repoName,
      accountUserName
    );

    // Get repo api data
    const repoApiData = await gitHubRepoHandler.getRepoInfo(repoApiLink);

    // handle incorrect repo name
    if (repoApiData.status) {
      res.send("No repo with that user and name");
    } else if (repoApiData.message) {
      res.status(400).json({ message: "API rate limit reached" });
    } else {
      // Get repo commits api data
      const repoCommitData = await gitHubRepoHandler.getRepoCommitInfo(
        repoApiLink
      );

      // Get last five commit messages
      const commitMessages =
        gitHubRepoHandler.getLastFiveCommitMessages(repoCommitData);

      // get latest commit date
      const latestCommitDate =
        gitHubRepoHandler.getLatestCommitDate(repoCommitData);

      // create repo info object
      const repoInfoObject = gitHubRepoHandler.createRepoInfoObject(
        repoApiData,
        commitMessages,
        latestCommitDate
      );

      // write info to filepath
      writeJson(repoInfoObject, repoInfoFilePath, "Repo");
      return res.status(200).json({ message: "Repo information captured" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// get repo information
app.get("/api/repo", async (req, res) => {
  let repoInfo = readJson(repoInfoFilePath);
  res.json(repoInfo);
});

// Display app
app.listen(port, () => console.log(`Listening engaged port ${port}`));
