import RepoDisplay from "../components/RepoDisplay";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

test("Posts and gets content from API on start", async () => {
  // Mock the global fetch function for POST and GET requests
  global.fetch = jest
    .fn()
    // First fetch for POST request
    .mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    )
    // Second fetch for GET request
    .mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            repoLink: "https://github.com/Nerrotok/black-jack",
            creationDate: "2023-10-06",
            lastCommitDate: "2023-10-06",
            description:
              "An old black jack project where you can only hit, stick or double down. ",
            language: "Python",
            recentCommits: ["Cleaned code slightly", "Initial commit"],
          }),
      })
    );

  // Using repo I don't think I will be updating
  render(<RepoDisplay userName="nerrotok" selectedRepo="black-jack" />);

  await waitFor(() => {
    // Check if the repo information is displayed
    expect(screen.getByText("Repo Information:")).toBeInTheDocument();
    expect(screen.getByText("Repo Name:")).toBeInTheDocument();
    expect(screen.getByText("Date Created:")).toBeInTheDocument();
    expect(screen.getByText("Date of last commit:")).toBeInTheDocument();
    expect(screen.getByText("Description:")).toBeInTheDocument();
    expect(screen.getByText("Language Used:")).toBeInTheDocument();

    // Check if the recent commits are displayed
    expect(screen.getByText("Latest Commits:")).toBeInTheDocument();
  });

  // Restore the original fetch function
  global.fetch.mockRestore();
});
