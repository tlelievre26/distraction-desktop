 
// Only disable this temporarily so the linter stops yelling at us
const React = require("react");

const { useSessionMetrics } = require("../SessionMetricsContext");
const TimelineChunk = require('./TimelineChunk');

require("./TimelineStyles.css");

const Timeline = () => {
  const { chunkSize, duration, sessionData } = useSessionMetrics();
  // console.log(sessionData);
  const numChunks = Math.ceil(duration / (60 * chunkSize));
  let chunks;
  const segmentsPerChunk = chunkSize / 15;
  if(sessionData) {
    chunks = Array.from({ length: numChunks }, (_, index) => {
      let dataForChunk = sessionData.chunks.slice(index * segmentsPerChunk, index * segmentsPerChunk + segmentsPerChunk);

      for(let i = 0; i < dataForChunk.length - 1; i++) {
        if(dataForChunk[i][dataForChunk[i].length - 1].name === dataForChunk[i+1][0].name) {
          dataForChunk[i+1][0].timeSpent += dataForChunk[i][dataForChunk[i].length - 1].timeSpent;
          dataForChunk[i].pop();
        }
      }
      dataForChunk = dataForChunk.flat();

      return <TimelineChunk key={index} id={index} data={dataForChunk} className="chunk" />;
    });
  }


  return (
    <div className="timeline">
      {chunks}
    </div>
  );
};

module.exports = Timeline;