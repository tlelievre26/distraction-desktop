const React = require("react");

const BeginSessionButton = require("./BeginSessionButton");
const TaskList = require("./TaskList");

const HomePage = () => (
  <div>
    <BeginSessionButton />
    <TaskList />
  </div>
);

module.exports = HomePage;