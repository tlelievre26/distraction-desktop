const React = require("react");
const { useLocation } = require('react-router-dom');

const Task =({ task, deleteTask, toggleCompleted, index, setCurrentTask, length })=> {
  const location = useLocation();
  handleChange =()=> {
    toggleCompleted(task.id);
  };
 
  return (
    <div>
      {task.text !== "" && length !== 1 &&
    <div className="task" style={{textDecoration: task.completed ? "line-through" : ""}}>
      <div className="star">
        {location.pathname !=="/" && task.text !== "" &&
        <button 
          onClick={() => setCurrentTask(index)} >
          <span className={task.currentTask === true ? "on" : "off"}>&#9733;</span>
        </button>
        }
      </div>
      <p>{task.text}</p>
      {location.pathname !=="/session" && task.text !== "" && 
        <button onClick={() => deleteTask(task.id)}>
        Delete Task
        </button>
      }
      <div>
        {location.pathname !=="/" && task.text !== "" &&
      <button onClick={() => toggleCompleted(index)}>Complete</button>
        }
      </div>
    </div>
      }
      {task.text === "" && length === 1 && 
        <p>No Tasks! :)</p>
      }
    </div>
  );
};
module.exports = Task;