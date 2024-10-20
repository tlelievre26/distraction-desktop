const React = require("react");
const { useState, useEffect } = React;

require("./TimelineStyles.css")

//This was like 95% ChatGPT generated for the sake of creating an "outline" for the timeline, doesn't work super well though
const Timeline = ({ sessionLength, chunkSizeMinutes }) => {

  const numChunks = (sessionLength / 60) / chunkSizeMinutes;
  const chunks = Array.from({ length: numChunks }, (_, index) => (
    <div key={index} className="chunk" />
  ));

  useEffect(() => {
    const fetchData = async () => {
        try {
            const sessionData = await SpecificStudySessionProcessing(sessionId);

        } catch (error) {
            onsole.error("Error fetching session data:", error);
        }}
    })

  return (
    <div className="timeline">
      {chunks}
    </div>
  );
};

module.exports = Timeline;