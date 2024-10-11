const React = require("react");

const ToDOItem =({ task, deleteTask, toggleCompleted, index })=> {
  handleChange =()=> {
    toggleCompleted(task.id);
  };
 
  return (
    <div className="todo-item" style={{textDecoration: task.completed ? "line-through" : ""}}>
      <p>{task.text}</p>
      <button onClick={() => deleteTask(task.id)}>
      Delete Task
      </button>
      <button onClick={() => toggleCompleted(index)}>Complete</button>
    </div>
  );
};
module.exports = ToDOItem;