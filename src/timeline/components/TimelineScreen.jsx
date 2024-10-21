const React = require("react");
const { useState } = React;

const DeleteSessionButton = require("./DeleteSessionButton");
const NewSessionButton = require("./NewSessionButton");
const SelectChunkMenuSize = require("./SelectChunkSizeMenu");
const Timeline = require("./timeline-components/Timeline");
const SessionDuration = require("./SessionDuration");
const { PrevSessionProvider } = require("./PrevSessionContext");
const PrevSessionsMenu = require("./PrevSessionsMenu");

// const Timeline = require("./timeline.jsx");

require("./navbarStyles.css");

const TimelineScreen = () => {
  const [chunkSize, setChunkSize] = useState(30)

  return (
    <div>
      <nav className="navbar navbar-light bg-primary custom-navbar">
        <div className="container-fluid d-flex">
          <PrevSessionProvider>
            <PrevSessionsMenu/>
          </PrevSessionProvider>
          <NewSessionButton/>
          <DeleteSessionButton/>
        </div>
  
      </nav>
      <div className="timeline-body-div">
        <SelectChunkMenuSize chunkSize={chunkSize} setChunkSize={setChunkSize}/>
        <SessionDuration/>
        <div id="metrics">
          {/* Area for us to show metrics relating to the study session as a whole */}
          <div name="DeleteMeLater" style={{height: "100px"}}/>
        </div>
        <div id="timelineArea">
          {/* For an outline's sake I'll assume a session is 2 Hrs with 30 min chunks */}
          <Timeline chunkSize={chunkSize}></Timeline>
        </div>
      </div>
      {/* <Timeline /> */}
    </div>
  );
}


module.exports = TimelineScreen;
