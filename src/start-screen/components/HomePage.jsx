const React = require("react");

const BeginSessionButton = require("./BeginSessionButton");
const { PrevSessionProvider } = require("../../timeline/components/PrevSessionContext");
const TaskList = require("../../task_list/components/TaskList");
const StartPrevSessionsMenu = require("./StartPrevSessionsMenu");

require("./../../timeline/components/navbarStyles.css");

const HomePage = () => (
  <>
    <nav className="navbar navbar-dark bg-primary custom-navbar">
      <div className="container-fluid d-flex justify-content-end mx-auto align-items-center">
        <p className="countdown">Welcome to DistrAction!</p>
        <PrevSessionProvider>
          <StartPrevSessionsMenu/>
        </PrevSessionProvider>
      </div>
    </nav>
    <BeginSessionButton />
    <TaskList/>
  </>
);

module.exports = HomePage;
