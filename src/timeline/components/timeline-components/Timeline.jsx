/* eslint-disable no-unused-vars */
// Only disable this temporarily so the linter stops yelling at us
const { time } = require("console");

const React = require("react");

const { useSessionMetrics } = require("../SessionMetricsContext");
const TimelineChunk = require('./TimelineChunk');
const data = require("./two_hr_session.json");

require("./TimelineStyles.css");

const Timeline = () => {
  const { chunkSize, duration, sessionData } = useSessionMetrics();
  const numChunks = Math.ceil(120 * 60 / (60 * chunkSize));
  
  const timeConversion = data.map(element => {
    return new Date(element._time);
  });

  const timeSpent = timeConversion.map((element, index, arr) => {
    if (index+1 < arr.length) {
      const endTime = arr[index+1];

      const secondsStart = element.getUTCSeconds() + element.getUTCMinutes() * 60 + element.getUTCHours() * 3600;
      const secondsEnd = endTime.getUTCSeconds() + endTime.getUTCMinutes() * 60 + endTime.getUTCHours() * 3600;
    
      return secondsEnd - secondsStart;
    }
    else
    {
      return 0;
    }
  });

  return (
    <div className="timeline"> {data.map((element, index) => (
      <TimelineChunk
        timeSpent={timeSpent[index]}
        name={element._value}
        timeChunk={chunkSize * 60}
      />
    ))}
    </div>
  );
};

module.exports = Timeline;