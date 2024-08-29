import "./App.css";
import React, { useState } from "react";
import UserSearch from "./components/UserSearch";
import UserDisplay from "./components/UserDisplay";
import RepoDisplay from "./components/RepoDisplay";
// Currently selected user and current repos
// state should be
// stored here, both repos and the profile use it

function App() {
  // Searched userName
  const [userName, setUserName] = useState("");

  // Selected repo being displayed
  const [selectedRepo, setSelectedRepo] = useState("");

  // State for whether a user has been selected
  const [userSelectedStatus, setUserSelectedStatus] = useState(false);

  // State for whether a repo has been selected
  const [repoSelectedStatus, setRepoSelectedStatus] = useState(false);

  return (
    <div className="App--container">
      <h1 className="App--heading">Github Search App</h1>
      <UserSearch
        setUserSelectedStatus={setUserSelectedStatus}
        setUserName={setUserName}
        setRepoSelectedStatus={setRepoSelectedStatus}
      />
      {userSelectedStatus && (
        <>
          <UserDisplay
            userName={userName}
            setSelectedRepo={setSelectedRepo}
            setRepoSelectedStatus={setRepoSelectedStatus}
          />
          {repoSelectedStatus && (
            <RepoDisplay userName={userName} selectedRepo={selectedRepo} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
