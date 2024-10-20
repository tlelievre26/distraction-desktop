const { useContext, createContext, useState } = require('react');

// Create the context
const TaskContext = createContext();

// Create a provider component
const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

// Export the context for use in other components
const useTasks = () => useContext(TaskContext);

module.exports = { TaskProvider, useTasks };