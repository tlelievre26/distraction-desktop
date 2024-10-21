const React = require("react");
const { Chrono } = require("react-chrono");
const { useLocation } = require("react-router-dom");

const { SpecificStudySessionProcessing } = require("../../api_recievers/influxqueries.js");

const { useState, useEffect } = React;


const TimeLine = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); 
  const sessionId = useLocation().state.sessionId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = await SpecificStudySessionProcessing(sessionId);
        // console.log("Session Data:", sessionData['Objects']);

        const newItems = []; 

        // Loop through sessionData['Objects']
        for (let i = 0; i < sessionData['Objects'].length; i++) {
          // Create a new dictionary for each object
          const item = {
            title: sessionData['Objects'][i]['_value'], // Use _value for title
            cardTitle: sessionData['Objects'][i]['_measurement'], // Use _value for title
            cardSubtitle: sessionData['Objects'][i]['_time'], // Use _value for title
            cardDetailedText: sessionData['Objects'][i]['_value'] // Use _value for title
          };

          newItems.push(item); 
        }

        setItems(newItems); 
        setLoading(false); 

      } catch (error) {
        console.error("Error fetching session data:", error);
        setLoading(false);
      }
    };

    fetchData();

  }, []); 

  console.log("Items:", items);

  
  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Chrono items={items} mode="HORIZONTAL" />
    </div>
  );
};

module.exports = TimeLine;
