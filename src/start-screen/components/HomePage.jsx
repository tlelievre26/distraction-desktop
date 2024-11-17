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
  

  const [filepath, setFilepath] = useState(localStorage.getItem('influxFilepath') || '');
  const [apiKey, setApiKey] = useState(localStorage.getItem('influxApiKey') || '');
  //Tracks if we've successfully connected to Influx
  const [dbSuccess, setDbSuccess] = useState(sessionStorage.getItem('db-status') || false);

  useEffect(() => {

    ipcRenderer.on('db-conn-success', (_event) => {
      sessionStorage.setItem('db-status', true);
      setDbSuccess(true);
    });

    ipcRenderer.on('db-conn-failed', (_event) => {
      localStorage.setItem('db-status', false);
      setDbSuccess(false);
    });

    ipcRenderer.on('load-settings', (_event, influxPath, apiKey) => {
      setApiKey(apiKey);
      setFilepath(influxPath);
      localStorage.setItem('influxApiKey', apiKey); //If we reload the page
      localStorage.setItem('influxFilepath', influxPath);
    });

    return () => {
      ipcRenderer.removeAllListeners('db-conn-success');
      ipcRenderer.removeAllListeners('db-conn-failed');
      ipcRenderer.removeAllListeners('load-settings');
    };

  }, []);

  return(
    <>
      <nav className="navbar bg-primary custom-navbar">
        <div className="container-fluid d-flex">
          <p className="countdown">Welcome to DistrAction!</p>
          <PrevSessionProvider readyToLoad={dbSuccess}>
            <StartPrevSessionsMenu/>
          </PrevSessionProvider>
          <SettingsButton apiKey={apiKey} setApikey={setApiKey} filepath={filepath} setFilepath={setFilepath}/>
        </div>
      </nav>
      <BeginSessionButton dbSuccess={dbSuccess}/>
      <TaskList/>
    </>
  );
}; 

module.exports = HomePage;
