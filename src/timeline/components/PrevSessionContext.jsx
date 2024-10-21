const React = require("react");
const { useContext, createContext, useState } = React;

// Create the context
const PrevSessionContext = createContext();

// Create a provider component
const PrevSessionProvider = ({children}) => {
  const prevSessions = [
    { name: "MM/DD/YY HH:MM to HH:MM", sessionId: 0 },
    { name: "MM/DD/YY HH:MM to HH:MM", sessionId: 1 },
  ]; //REPLACE THIS ARRAY with an array of session IDs queried from the database
  const [prevSessionIds, setPrevSessionIds] = useState(prevSessions);

  return (
    <PrevSessionContext.Provider value={{ prevSessionIds, setPrevSessionIds }}>
      {children}
    </PrevSessionContext.Provider>
  );
};

// Export the context for use in other components
const usePrevSession = () => useContext(PrevSessionContext);

module.exports = { PrevSessionProvider, usePrevSession };
