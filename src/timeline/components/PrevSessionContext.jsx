const React = require("react");

const { useContext, createContext, useState, useEffect } = React;
const { AllStudySessionProcessing } = require("../../api_recievers/influxqueries");


const PrevSessionContext = createContext();

const PrevSessionProvider = ({ children }) => {
  const [prevSessionIds, setPrevSessionIds] = useState([]);

  useEffect(() => {
    
    AllStudySessionProcessing()
      .then((prevSessionData) => {
      
        let sessionIds = prevSessionData.sessionId; 
        let startTimes = prevSessionData.startTimes; 
        let endTimes = prevSessionData.endTimes; 

        console.log(sessionIds);
        console.log(startTimes);
        console.log(endTimes);

        const prevSessions = sessionIds.map((sessionId, index) => ({
          name: `${startTimes[index]} to ${endTimes[index]}`, sessionId: sessionIds[index],duration: startTimes[index] - endTimes[index]
        }));

        setPrevSessionIds(prevSessions);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
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
