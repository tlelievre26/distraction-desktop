const React = require("react");

const TaskList = require("../../task_list/components/TaskList");

const MaintainTaskList = ({Component}) => {
  return (
    <>
      <Component />
      <TaskList />
    </>
  );
};

module.exports = MaintainTaskList;