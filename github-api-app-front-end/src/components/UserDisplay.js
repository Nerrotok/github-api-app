import React from "react";

class UserDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRepo: "",
      informationLoaded: false,
      userInformation: [],
    };

    this.nullValueCheck = this.nullValueCheck.bind(this);
    this.updateRepoStates = this.updateRepoStates.bind(this);
  }

  nullValueCheck(userInformation) {
    if (userInformation.name === null) {
      userInformation.name = "No name given.";
    }

    if (userInformation.avatar_url === null) {
      userInformation.avatar_url =
        "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg";
    }
    if (userInformation.bio === null) {
      userInformation.bio = "No bio given.";
    }

    return userInformation;
  }

  // set repo states in parent component
  async updateRepoStates(repoName) {
    await this.props.setRepoSelectedStatus(false);
    await this.props.setSelectedRepo(repoName);
    await this.props.setRepoSelectedStatus(true);
  }

  componentDidMount() {
    fetch("http://localhost:8080/api/user")
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.message === "API rate limit reached") {
            alert(result.message);
          } else {
            this.setState({
              informationLoaded: true,
              userInformation: this.nullValueCheck(result),
            });
          }
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
    const { error, informationLoaded, userInformation } = this.state;

    if (error) {
      return (
        <div className="UserDisplay--container">Error {error.message}</div>
      );
    } else if (!informationLoaded) {
      return (
        <div className="UserDiplay--container">Loading user information...</div>
      );
    } else {
      return (
        <div className="UserDisplay--container">
          <div className="UserDisplay--container-row">
            <div className="UserDisplay--container-column">
              <div className="UserDisplay--heading">User Information:</div>
              <img
                className="UserDisplay--image"
                alt="user profile picture"
                src={userInformation.avatar_url}
              />
              <a
                className="UserDisplay--alien-link"
                href={userInformation.accountLink}
              >
                Account Link
              </a>
              <div className="UserDisplay--username">
                <span className="UserDisplay--span">Account name:</span>{" "}
                {userInformation.userName}
              </div>
              <div className="UserDisplay--name">
                <span className="UserDisplay--span">Name:</span>{" "}
                {userInformation.name}
              </div>
              <div className="UserDisplay--account_creation_date">
                <span className="UserDisplay--span">Date created:</span>{" "}
                {userInformation.creation_date}
              </div>
              <div className="UserDisplay--repoCount">
                <span className="UserDisplay--span">Public repos:</span>{" "}
                {userInformation.repoCount}
              </div>
              <div className="UserDisplay--bio">
                <span className="UserDisplay--span">Bio:</span>{" "}
                {userInformation.bio}
              </div>
            </div>
            <div className="UserDisplay--container-column">
              <div className="UserDisplay--heading">
                Click on Repo to View Repo:
              </div>
              <ul className="UserDisplay--list">
                {userInformation.repoNames.map((name, index) => (
                  <li
                    className="UserDisplay--list-item"
                    onClick={() => this.updateRepoStates(name)}
                    key={index}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default UserDisplay;
