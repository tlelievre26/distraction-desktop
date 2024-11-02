const React = require("react");
const { useState, useEffect } = React;
const { ipcRenderer } = require("electron");

const BeginSessionButton = require("./BeginSessionButton");
const { PrevSessionProvider } = require("../../timeline/components/PrevSessionContext");
const TaskList = require("../../task_list/components/TaskList");
const StartPrevSessionsMenu = require("./StartPrevSessionsMenu");
const SettingsButton = require("./SettingsButton");

require("./../../timeline/components/navbarStyles.css");

const HomePage = () => {
  

  const [filepath, setFilepath] = useState('');
  const [apiKey, setApiKey] = useState('');
  //Tracks if we've successfully connected to Influx
  const [dbSuccess, setDbSuccess] = useState(false);

  useEffect(() => {

    ipcRenderer.on('db-conn-success', (_event) => {
      setDbSuccess(true);
    });

    ipcRenderer.on('db-conn-failed', (_event) => {
      setDbSuccess(false);
    });

    ipcRenderer.on('load-settings', (_event, influxPath, apiKey) => {
      setApiKey(apiKey);
      setFilepath(influxPath);
    });


  }, []);

  return(
    <>
      <nav className="navbar navbar-dark bg-primary custom-navbar">
        <div className="container-fluid d-flex justify-content-end mx-auto align-items-center">
          <p className="countdown">Welcome to DistrAction!</p>
          <SettingsButton apiKey={apiKey} setApikey={setApiKey} filepath={filepath} setFilepath={setFilepath}/>
          <PrevSessionProvider>
            <StartPrevSessionsMenu/>
          </PrevSessionProvider>
        </div>
      </nav>
      <BeginSessionButton dbSuccess={dbSuccess}/>
      <TaskList/>
    </>
  );
}; 

module.exports = HomePage;
