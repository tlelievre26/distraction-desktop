const React = require("react");
const { useNavigate } = require("react-router-dom");

const { useTasks } = require("../../task_list/components/TaskContext");
require("./navbarStyles.css");

const NewSessionButton = () => {
  const { removeCompletedTasks } = useTasks();
  const navigation = useNavigate();
  const goToStart = () => {
    removeCompletedTasks();
    navigation("/");
  };

  return (
    <div className="navbar-button p-2">
      <button type="button" className="btn btn-success" onClick={goToStart}>
        New Session
      </button>
    </div>
  );
};

module.exports = NewSessionButton;