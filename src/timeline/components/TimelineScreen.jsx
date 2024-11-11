const React = require("react");
const { useState } = React;
const { useLocation } = require('react-router-dom');

const DeleteSessionButton = require("./DeleteSessionButton");
const NewSessionButton = require("./NewSessionButton");
const SelectChunkMenuSize = require("./SelectChunkSizeMenu");
const Timeline = require("./timeline-components/Timeline");
const { PrevSessionProvider } = require("./PrevSessionContext");
const PrevSessionsMenu = require("./PrevSessionsMenu");
const FullSessionMetrics = require("./metrics-components/FullSessionMetrics");
const { SessionMetricsProvider } = require("./SessionMetricsContext");

// const Timeline = require("./timeline.jsx");

require("./navbarStyles.css");

const TimelineScreen = () => {
  const [name, setName] = useState(useLocation().state.name);

  return (
    <div>
      <SessionMetricsProvider>
        <nav className="navbar navbar-light bg-primary custom-navbar">
          <div className="container-fluid d-flex">
            {/* At some point, replace this with the actual start and end times of the session */}
            <p className="countdown">{name}</p> 
            <PrevSessionProvider>
              <PrevSessionsMenu setName={setName}/>
            </PrevSessionProvider>
            <NewSessionButton/>
            <DeleteSessionButton/>
          </div>
  
        </nav>
        <div className="timeline-body-div">
          <SelectChunkMenuSize/>
          <div id="metrics">
            {/* Area for us to show metrics relating to the study session as a whole */}
            <FullSessionMetrics/>
          </div>
          <div id="timelineArea">
            {/* For an outline's sake I'll assume a session is 2 Hrs with 30 min chunks */}
            <Timeline></Timeline>
          </div>
        </div>
        {/* <Timeline /> */}
      </SessionMetricsProvider>
    </div>
  );
};


module.exports = TimelineScreen;
