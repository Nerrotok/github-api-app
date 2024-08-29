import React from "react";

class RepoDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      informationLoaded: false,
      repoInfo: [],
    };
  }

  // POST selected repo
  componentDidMount() {
    this.fetchDataToDisplay();
  }

  componentDidUpdate(prevProps) {
    // Account for props changes
    if (
      prevProps.userName !== this.props.userName ||
      prevProps.selectedRepo !== this.props.selectedRepo
    ) {
      this.fetchDataToDisplay();
    }
  }

  async fetchDataToDisplay() {
    const { userName, selectedRepo } = this.props;

    await fetch("http://localhost:8080/api/repo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountUserName: userName,
        repoName: selectedRepo,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          // successful post
        },
        (error) => {
          alert("Error occured: " + error.message);
        }
      );

    // GET information from selected repo
    await fetch("http://localhost:8080/api/repo")
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            informationLoaded: true,
            repoInfo: result,
          });
        },
        (error) => {
          this.setState({
            informationLoaded: false,
            error,
          });
        }
      );
  }

  render() {
    const { error, repoInfo, informationLoaded } = this.state;
    const { selectedRepo } = this.props;

    if (error) {
      return (
        <div className="RepoDisplay--container">Error: {error.message}</div>
      );
    } else if (!informationLoaded) {
      return <div className="RepoDisplay--container">Loading repo info...</div>;
    } else {
      return (
        <div className="RepoDisplay--container">
          <div className="RepoDisplay--container-row">
            <div className="RepoDisplay--container-column">
              <div className="RepoDisplay--heading">Repo Information:</div>
              <a className="RepoDisplay--alien-link" href={repoInfo.repoLink}>
                Link to repo
              </a>
              <div className="RepoDisplay--name">
                <span className="RepoDisplay--span">Repo Name:</span>{" "}
                {selectedRepo}
              </div>
              <div className="RepoDisplay--creation_date">
                <span className="RepoDisplay--span">Date Created:</span>{" "}
                {repoInfo.creationDate}
              </div>
              <div className="RepoDisplay--last_commit_date">
                <span className="RepoDisplay--span">Date of last commit:</span>{" "}
                {repoInfo.lastCommitDate}
              </div>
              <div className="RepoDisplay--description">
                <span className="RepoDisplay--span">Description:</span>{" "}
                {repoInfo.description}
              </div>
              <div className="RepoDisplay--language">
                <span className="RepoDisplay--span">Language Used:</span>{" "}
                {repoInfo.language}
              </div>
            </div>
            {/* Conditionally render commits if they exist */}
            {repoInfo.recentCommits && repoInfo.recentCommits.length > 0 && (
              <div className="RepoDisplay--container-column">
                <div className="RepoDisplay--heading">Latest Commits:</div>
                <ul className="RepoDisplay--list">
                  {repoInfo.recentCommits.map((message, index) => (
                    <li className="RepoDisplay--list-item" key={index}>
                      {message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    }
  }
}

export default RepoDisplay;
