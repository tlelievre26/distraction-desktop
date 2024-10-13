const React = require("react");

const TaskList = require("./TaskList");

const MaintainTaskList = ({Component}) => {
  return (
    <>
      <Component />
      <TaskList />
    </>
  );
};

module.exports = MaintainTaskList;