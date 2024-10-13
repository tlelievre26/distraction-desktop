
const React = require("react");
const { useState } = require("react");
const { v4: uuidv4 } = require('uuid');
const { useLocation } = require('react-router-dom');

require('./TaskDisplay.css');
const TaskInput = require('./TaskInput');
const Task = require("./Task");
//Code referenced from: https://medium.com/@worachote/building-a-todo-list-app-with-reactjs-a-step-by-step-guide-2c58b9b6c0f5
//                      https://pusher.com/tutorials/todo-app-react-hooks/#setup
const TaskList = () => {
  const location = useLocation();
  const [tasks, setTasks] = useState([{
    text: "",
    key: uuidv4(),
    completed: false,
    currentTask: false
  }]);

  toggleCompleted =(index)=> {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  addTask =(taskName)=> {
    const newTask = [...tasks, {
      id: uuidv4(),
      text: taskName,
      completed: false,
      currentTask: false
    }];
    setTasks(newTask);
  };

  deleteTask =(id)=> {
    setTasks(tasks.filter(task => task.id !== id));
  };

  setCurrentTask =(index)=> {
    const newTasks = [...tasks];
    newTasks[index].currentTask = !newTasks[index].currentTask;
    setTasks(newTasks);
  };

  return (
    <>
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
          />
        ))}
        </div>
        {location.pathname !=="/session" && 
          <div className="create-task">
            <TaskInput addTask={addTask} />
          </div>
        }
      </div>
    </>
  );
};

module.exports = TaskList;