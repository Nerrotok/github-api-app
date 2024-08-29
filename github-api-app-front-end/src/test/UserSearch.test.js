import React from "react";
import UserSearch from "../components/UserSearch";
import renderer from "react-test-renderer";

test("UserSearch renders correctly", () => {
  const tree = renderer.create(<UserSearch />).toJSON();
  expect(tree).toMatchSnapshot();
});
