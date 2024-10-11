
const React = require("react");
const { useState } = require("react");
const { v4: uuidv4 } = require('uuid');

require('./ToDO.css');
const TaskInput = require('./TaskInput');
const ToDOItem = require("./ToDOItem");
//Code referenced from: https://medium.com/@worachote/building-a-todo-list-app-with-reactjs-a-step-by-step-guide-2c58b9b6c0f5
//                      https://pusher.com/tutorials/todo-app-react-hooks/#setup
const ToDOScreen = () => {
  const [tasks, setTasks] = useState([{
    id: uuidv4(),
    text: 'ECE463 Lab',
    completed: false
  },
  {
    id: uuidv4(),
    text: 'Senior Design',
    completed: false
  },
  {
    id: uuidv4(),
    text: ':(',
    completed: true
  }
  ]);

  toggleCompleted =(index)=> {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  addTask = (taskName) => {
    const newTask = [...tasks, {
      id: uuidv4(),
      text: taskName,
      completed: false
    }];
    setTasks(newTask);
  };

  deleteTask =(id)=> {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <>
      <div className="todo-list">
        <div className="header">To-Do List</div>
        <div className="tasks">{tasks.map((task, index)=> (
          <ToDOItem
            key={task.id} 
            task={task}
            deleteTask={deleteTask}
            toggleCompleted={toggleCompleted} 
            index={index}
          />
        ))}
        </div>
        <div className="create-task">
          <TaskInput addTask={addTask} />
        </div>
      </div>
    </>
  );
};

module.exports = ToDOScreen;