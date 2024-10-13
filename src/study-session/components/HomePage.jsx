const React = require("react");

const BeginSessionButton = require("./BeginSessionButton");
const TimeLine = require("./timeline");

const HomePage = () => (
  <>
    <BeginSessionButton />
    <TimeLine />
  </>
);

module.exports = HomePage;
