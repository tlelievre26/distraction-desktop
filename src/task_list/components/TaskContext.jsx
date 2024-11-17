const React = require('react');
const { useContext, createContext, useState } = React;

// Create the context
const TaskContext = createContext();

const numCompletedTasks = 0;

// Create a provider component
const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([{
    text: "",
    key: "",
    completed: false,
    currentTask: false
  }]);
  const [screen, setScreen] = useState('start');

  const removeCompletedTasks = () => {
    const filteredTasks = prevTasks.filter(task => !task.completed);
    numCompletedTasks = prevTasks.length - filteredTasks.length;
    setTasks(filteredTasks);
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, removeCompletedTasks, screen, setScreen }}>
      {children}
    </TaskContext.Provider>
  );
};

const getCompletedTasks = () => {
  return numCompletedTasks;
};

// Export the context for use in other components
const useTasks = () => useContext(TaskContext);

module.exports = { TaskProvider, useTasks, getCompletedTasks };