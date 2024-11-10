const React = require('react');
const { useContext, createContext, useState } = React;

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

  const removeCompletedTasks = () => {
    setTasks((prevTasks) => prevTasks.filter(task => !task.completed));
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, removeCompletedTasks, screen, setScreen }}>
      {children}
    </TaskContext.Provider>
  );
};

// Export the context for use in other components
const useTasks = () => useContext(TaskContext);

module.exports = { TaskProvider, useTasks };