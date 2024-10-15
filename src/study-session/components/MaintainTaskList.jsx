const React = require("react");
require("./start-styling.css");

const TaskList = require("../../task_list/components/TaskList");

const MaintainTaskList = ({Component}) => {
  return (
    <div className="ui">
      <Component />
      <TaskList />
    </div>
  );
};

module.exports = MaintainTaskList;