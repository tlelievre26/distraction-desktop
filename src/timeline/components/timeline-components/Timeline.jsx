 
// Only disable this temporarily so the linter stops yelling at us
const React = require("react");

const { useSessionMetrics } = require("../SessionMetricsContext");
const TimelineChunk = require('./TimelineChunk');
const TaskChunk = require("./TaskChunk");

require("./TimelineStyles.css");

const Timeline = () => {
  const { chunkSize, duration, sessionData, taskData } = useSessionMetrics();
  // console.log(sessionData);
  const numChunks = Math.ceil(duration / (60 * chunkSize));
  let chunks;
  let taskChunks;
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

      return <TimelineChunk key={index} id={index} data={dataForChunk}/>;
    });
    taskChunks = Array.from({ length: taskData.length }, (_, index) => {
      const percentOffset = Math.ceil((taskData[index].offset / duration) * 100);
      const percentWidth = Math.floor((taskData[index].duration / duration) * 100);
      return <TaskChunk offset={percentOffset} width={percentWidth} name={taskData[index].name} status={taskData[index].status}/>;
    });
  }


  return (
    <div>
      <div className="timeline">
        {chunks}
      </div>
      <div className="task-timeline">
        {taskChunks}
      </div>
    </div>


  );
};

module.exports = Timeline;