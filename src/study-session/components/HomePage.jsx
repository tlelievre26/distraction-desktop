const React = require("react");

const BeginSessionButton = require("./BeginSessionButton");
const TimeLine = require("./timeline");

const HomePage = () => (
  <div>
    <BeginSessionButton />
    <TimeLine />
  </div>
);

module.exports = HomePage;
