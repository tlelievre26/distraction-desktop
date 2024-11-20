const React = require("react");

require('./TaskDisplay.css');
const TaskInput = require('./TaskInput');
const Task = require("./Task");
const { useTasks } = require("./TaskContext");

//Code referenced from: https://medium.com/@worachote/building-a-todo-list-app-with-reactjs-a-step-by-step-guide-2c58b9b6c0f5
//                      https://pusher.com/tutorials/todo-app-react-hooks/#setup
const TaskList = (sessionId) => {
  const { tasks, deleteTask, toggleCompleted, setCurrentTask } = useTasks();

  return (
    <div className="ui">
      <div className="todo-list">
        <div className="header">To-Do List</div>
        <div className="tasks">{tasks.map((task, index)=> (
          <Task
            key={task.id} 
            task={task}
            deleteTask={deleteTask}
            toggleCompleted={toggleCompleted} 
            index={index}
            setCurrentTask={setCurrentTask}
            length={tasks.length}
            sessionId={sessionId}
          />
        ))}
        </div>
        <div className="create-task centered">
          <TaskInput addTask={addTask} />
        </div>
      </div>
    </div>
  );
};

module.exports = TaskList;