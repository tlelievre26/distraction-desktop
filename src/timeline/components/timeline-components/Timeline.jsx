/* eslint-disable no-unused-vars */
// Only disable this temporarily so the linter stops yelling at us
const React = require("react");

const { useSessionMetrics } = require("../SessionMetricsContext");

require("./TimelineStyles.css");

const Timeline = () => {
  const { chunkSize, duration, sessionData } = useSessionMetrics();
  const numChunks = Math.ceil(duration / (60 * chunkSize));
  
  const chunks = Array.from({ length: numChunks }, (_, index) => (
    <div key={index} className="chunk" />
  ));


  return <div className="timeline">{chunks}</div>;
};

module.exports = Timeline;
