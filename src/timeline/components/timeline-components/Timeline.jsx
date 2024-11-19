/* eslint-disable no-unused-vars */
// Only disable this temporarily so the linter stops yelling at us
const { time } = require("console");

const React = require("react");
const { session } = require("electron");

const { useSessionMetrics } = require("../SessionMetricsContext");
const TimelineChunk = require('./TimelineChunk');

require("./TimelineStyles.css");

const Timeline = () => {
  const { chunkSize, duration, sessionData } = useSessionMetrics();
  const numChunks = Math.ceil(120 * 60 / (60 * chunkSize));

  console.log(sessionData);
  return (
    <div className="timeline">
    </div>
  );
};

module.exports = Timeline;