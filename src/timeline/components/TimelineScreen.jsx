const React = require("react");

const DeleteSessionButton = require("./DeleteSessionButton");
const NewSessionButton = require("./NewSessionButton");
const PrevSessionsMenu = require("./PrevSessionsMenu");
const SelectChunkMenuSize = require("./SelectChunkSizeMenu");
const Timeline = require("./timeline-components/Timeline");

// const Timeline = require("./timeline.jsx");

require("./navbarStyles.css");

const TimelineScreen = () => (
  
  <div>
    <nav className="navbar navbar-light bg-primary custom-navbar">
      <div className="container-fluid d-flex justify-content-end mx-auto align-items-center">
        <PrevSessionsMenu/> 
        <NewSessionButton/>
        <DeleteSessionButton/>
      </div>

    </nav>
    <div className="timeline-body-div">
      <SelectChunkMenuSize/>
      {/* Add something for session duration here */}
      <div id="metrics">
        {/* Area for us to show metrics relating to the study session as a whole */}
        <div name="DeleteMeLater" style={{height: "100px"}}/>
      </div>
      <div id="timelineArea">
        {/* For an outline's sake I'll assume a session is 2 Hrs with 30 min chunks */}
        <Timeline sessionLength={120 * 60} chunkSizeMinutes={30}></Timeline>
      </div>
    </div>
    {/* <Timeline /> */}
  </div>
);

module.exports = TimelineScreen;
