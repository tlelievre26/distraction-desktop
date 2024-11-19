const React = require('react');
const { useContext, createContext, useState } = React;
const { v4: uuidv4 } = require('uuid');

const { taskData } = require("../../api_recievers/influxqueries");

// Create the context
const TaskContext = createContext();

// Create a provider component
const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([{
    text: "",
    key: "",
    completed: false,
    currentTask: false
  }]);
  const [screen, setScreen] = useState('start');
  const [numCompletedTasks, setNumCompletedTasks] = useState(0);

  const removeCompletedTasks = () => {
    setTasks(prevTasks.filter(task => !task.completed));
  };

  toggleCompleted = async (index, sessionId) => {
    const newTasks = [...tasks];
    taskData(true, newTasks[index].text, sessionId);
    newTasks[index].completed = !newTasks[index].completed;
    newTasks[index].currentTask = false;
    setNumCompletedTasks(prevCount => prevCount + (task.completed ? 1 : -1));
    if (index !== newTasks.length - 1) {
      const currentTask = newTasks[index];
      newTasks.splice(index, 1);
      newTasks.push(currentTask);
    }

    setTasks(newTasks);
  };

  addTask = (taskName) => {
    const newTask = {
      id: uuidv4(),
      text: taskName,
      completed: false,
      currentTask: false
    };
    setTasks([...tasks, newTask]);
  };

  deleteTask =(id)=> {
    setTasks(tasks.filter(task => task.id !== id));
  };

  setCurrentTask = async (index, sessionId) => {
    const newTasks = [...tasks];
    taskData(false, newTasks[index].text, sessionId);
    newTasks[index].currentTask = !newTasks[index].currentTask;
    newTasks[index].completed = false;
    newTasks.map((task, i)=> {
      if(i !== index && newTasks[i].currentTask === true) {
        newTasks[i].currentTask = false;
      }
      return task;
    });

    if (index !== 0) {
      const currentTask = newTasks[index];
      newTasks.splice(index, 1);
      newTasks.unshift(currentTask);
    }
    setTasks(newTasks);
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, removeCompletedTasks, toggleCompleted, addTask, deleteTask, numCompletedTasks,
      setNumCompletedTasks, setCurrentTask, screen, setScreen }}>
      {children}
    </TaskContext.Provider>
  );
};


// Export the context for use in other components
const useTasks = () => useContext(TaskContext);

module.exports = { TaskProvider, useTasks };