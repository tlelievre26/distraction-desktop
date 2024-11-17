const React = require("react");
const { useContext, createContext, useState, useEffect } = React;
const { ipcRenderer } = require("electron");

const formatDate = require("../../util/format-date");


const PrevSessionContext = createContext();

const PrevSessionProvider = ({ children, readyToLoad = true }) => {
  const [prevSessionIds, setPrevSessionIds] = useState([]);

  useEffect(() => {
  
    // const fetchSessionMetadata = async () => {
    //   const sessionMetadata = await grabAllPreviousStudySessionIDs();
    ipcRenderer.on('return-prev-sessions', (_event, sessionMetadata) => {
      const prevSessions = sessionMetadata.map((prevSession) => ({
        name: formatDate(prevSession.startTime, prevSession.endTime), sessionId: prevSession.sessionId, duration: prevSession.duration
      }));
      setPrevSessionIds(prevSessions);
    });
  
    if(readyToLoad) { //Only try and access prev sessions when we've successfully connected to Influx
      ipcRenderer.send('get-prev-sessions');
      // fetchSessionMetadata();
    }

    return () => {
      ipcRenderer.removeAllListeners('return-prev-sessions');
    };
  }, [readyToLoad]); 

  return (
    <PrevSessionContext.Provider value={{ prevSessionIds, setPrevSessionIds }}>
      {children}
    </PrevSessionContext.Provider>
  );
};

// Export the context for use in other components
const usePrevSession = () => useContext(PrevSessionContext);

module.exports = { PrevSessionProvider, usePrevSession };
