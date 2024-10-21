const React = require("react");
const { useLocation } = require("react-router-dom");
const { useState, useEffect } = React;

require("./TimelineStyles.css");

const Timeline = ({ chunkSize }) => {
  const { duration, sessionId } = useLocation().state;
  const numChunks = Math.ceil(duration / (60 * chunkSize));
  
  const chunks = Array.from({ length: numChunks }, (_, index) => (
    <div key={index} className="chunk" />
  ));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = await SpecificStudySessionProcessing(sessionId);
      } catch (error) {
        onsole.error("Error fetching session data:", error);
      }
    };
  });

  return <div className="timeline">{chunks}</div>;
};

module.exports = Timeline;
