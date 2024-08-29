import React from "react";

class UserSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInputValue: "",
    };

    // Bind event handlers
    this.formSubmissionHandler = this.formSubmissionHandler.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
  }

  // handle input change
  inputChangeHandler(e) {
    this.setState({ searchInputValue: e.target.value });
  }

  // handle form submission
  formSubmissionHandler(e) {
    e.preventDefault();

    // get state and parent functions
    const { searchInputValue } = this.state;
    const { setUserName, setUserSelectedStatus, setRepoSelectedStatus } =
      this.props;

    // reset userSelectedStatus and selectedRepoStatus
    setUserSelectedStatus(false);
    setRepoSelectedStatus(false);

    // Update parent component
    setUserName(searchInputValue);

    // submit POST request
    fetch("http://localhost:8080/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountUserName: searchInputValue,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.message === "Internal Server Error") {
            alert(`Error: ${result.message}`);
          } else {
            setUserSelectedStatus(true);
          }
        },
        (error) => {
          alert("Error occured: " + error.message);
        }
      );
  }

  render() {
    return (
      <div className="UserSearch--container">
        <h3 className="UserSearch--subheading">Search User:</h3>
        <form
          onSubmit={this.formSubmissionHandler}
          className="UserSearch--form"
        >
          <label className="UserSearch--label">User name:</label>
          <input
            onChange={this.inputChangeHandler}
            className="UserSearch--input"
            type="text"
            value={this.state.searchInputValue}
            required
          />
          <button className="UserSearch--button" type="submit">
            Search
          </button>
        </form>
      </div>
    );
  }
}

export default UserSearch;
