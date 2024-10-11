const React = require("react");

const BeginSessionButton = require("./BeginSessionButton");
const ToDOScreen = require("./ToDOScreen");

const HomePage = () => (
  <div>
    <BeginSessionButton />
    <ToDOScreen />
  </div>
);

module.exports = HomePage;