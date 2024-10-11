const React = require("react");
const { useLocation } = require('react-router-dom');

const Task =({ task, deleteTask, toggleCompleted, index })=> {
  const location = useLocation();
  handleChange =()=> {
    toggleCompleted(task.id);
  };
 
  return (
    <div className="todo-item" style={{textDecoration: task.completed ? "line-through" : ""}}>
      <p>{task.text}</p>
      {location.pathname !=="/session" && task.text !== "" && 
        <button onClick={() => deleteTask(task.id)}>
        Delete Task
        </button>
      }
      {location.pathname !=="/" && 
      <button onClick={() => toggleCompleted(index)}>Complete</button>
      }
    </div>
  );
};
module.exports = Task;