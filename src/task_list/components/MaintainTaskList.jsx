const React = require("react");
require("./../../start-screen/components/start-styling.css");

const TaskList = require("./TaskList");
const { TaskProvider } = require("./TaskContext");

const MaintainTaskList = () => {
  return (
    <TaskProvider>
      <div className="ui">
        <TaskList />
      </div>
    </TaskProvider>

  );
};

module.exports = MaintainTaskList;