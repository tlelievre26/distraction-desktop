const React = require("react");
const { useLocation } = require('react-router-dom');

const Task =({ task, deleteTask, toggleCompleted, index, setCurrentTask, length, sessionId })=> {
  const location = useLocation();
  handleChange =()=> {
    toggleCompleted(task.id, sessionId);
  };
 
  return (
    <>
      {task.text !== "" && length !== 1 &&
      <div style={{ display: 'flex'}}>
        {task.text !== "" &&
        <button className="star"
          onClick={() => setCurrentTask(index, sessionId)} >
          <span className={task.currentTask === true ? "on" : "off"}>&#9733;</span>
        </button>
        }
        <div className="task" style={{textDecoration: task.completed ? "line-through" : ""}}>
          {task.text}
          {task.text !== "" && 
            <button onClick={() => deleteTask(task.id)}>
            Delete Task
            </button>
          }
          {location.pathname !== "/" && task.text !== "" && task.currentTask === true &&
            <button onClick={() => toggleCompleted(index, sessionId)}>Complete</button>
          }
        </div>
      </div>
      }
      <div className="no-task">
        {task.text === "" && length === 1 && 
        <p>No Tasks!</p>
        }
      </div>
    </>
  );
};
module.exports = Task;