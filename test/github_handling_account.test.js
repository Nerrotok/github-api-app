let chai;
let expect;
const request = require("request");
const githubAccountHandler = require("../github_handling_account");

before(async function () {
  chai = await import("chai");
  expect = chai.expect;
});

describe("Data manipulation and api call functions to create a json containing appropriate data", function () {
  it("Gets the first five items of an array, if there are less, all of the items", function () {
    expect(
      githubAccountHandler.getReposArray([
        { name: "repo1" },
        { name: "repo2" },
        { name: "repo3" },
        { name: "repo4" },
      ])
    ).to.deep.equal(["repo1", "repo2", "repo3", "repo4"]);
  });

  it("Gets the first five items of an array if there are more", function () {
    expect(
      githubAccountHandler.getReposArray([
        { name: "repo1" },
        { name: "repo2" },
        { name: "repo3" },
        { name: "repo4" },
        { name: "repo5" },
        { name: "repo6" },
        { name: "repo7" },
      ])
    ).to.deep.equal(["repo1", "repo2", "repo3", "repo4", "repo5"]);
  });

  it("Creates a link to the github api", function () {
    it("Receives a name and creates a link to the github repo for that user name.", function () {
      expect(
        githubAccountHandler
          .getAccountLink("nerrotok")
          .to.equal("https://api.github.com/users/nerrotok")
      );
    });
  });
});
