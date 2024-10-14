const React = require("react");

const Timeline = require("./timeline.jsx");

const TimelineScreen = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Timeline />
  </div>
);

module.exports = TimelineScreen;
