const React = require("react");

const { useContext, createContext, useState, useEffect } = React;
const { grabAllPreviousStudySessionIDs } = require("../../api_recievers/influxqueries");
const formatDate = require("../../util/format-date");


const PrevSessionContext = createContext();

const PrevSessionProvider = ({ children }) => {
  const [prevSessionIds, setPrevSessionIds] = useState([]);

  useEffect(() => {
  
    const fetchSessionMetadata = async () => {
      const sessionMetadata = await grabAllPreviousStudySessionIDs();

      const prevSessions = sessionMetadata.map((prevSession) => ({
        name: formatDate(prevSession.startTime, prevSession.endTime), sessionId: prevSession.sessionId, duration: prevSession.duration
      }));
      setPrevSessionIds(prevSessions);
    };

    fetchSessionMetadata();
  }, []); 

  return (
    <PrevSessionContext.Provider value={{ prevSessionIds, setPrevSessionIds }}>
      {children}
    </PrevSessionContext.Provider>
  );
};

// Export the context for use in other components
const usePrevSession = () => useContext(PrevSessionContext);

module.exports = { PrevSessionProvider, usePrevSession };
