const React = require("react");
const { v4: uuidv4 } = require('uuid');

require('./TaskDisplay.css');
const { appData } = require("../../api_recievers/influxqueries.js");
const TaskInput = require('./TaskInput');
const Task = require("./Task");
const { useTasks } = require("./TaskContext");
const { getSessionId } =("../../study-session/session-control.js");
//Code referenced from: https://medium.com/@worachote/building-a-todo-list-app-with-reactjs-a-step-by-step-guide-2c58b9b6c0f5
//                      https://pusher.com/tutorials/todo-app-react-hooks/#setup
const TaskList = () => {
  const { tasks, setTasks } = useTasks();

  toggleCompleted = async (index)=> {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    newTasks[index].currentTask = false;
    if(getSessionId() !== null) {
      await appData("TaskList", newTasks[index].text, getSessionId());
    }   
    if (index !== newTasks.length - 1) {
      const currentTask = newTasks[index];
      newTasks.splice(index, 1);
      newTasks.push(currentTask);
    }

    setTasks(newTasks);
  };

  addTask = (taskName)=> {
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

  setCurrentTask = async (index)=> {
    const newTasks = [...tasks];
    newTasks[index].currentTask = !newTasks[index].currentTask;
    newTasks[index].completed = false;
    if(getSessionId() !== null) {
      await appData("TaskList", newTasks[index].text, getSessionId());
    }
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