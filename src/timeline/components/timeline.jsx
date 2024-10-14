const React = require("react");
const { Chrono } = require("react-chrono");

const { SpecificStudySessionProcessing } = require("../../api_recievers/influxqueries.js");

const { useState, useEffect } = React;
const { useLocation } = require("react-router-dom");

const TimeLine = () => {
  // Define state for items and loading
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const sessionId = useLocation().state.sessionId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = await SpecificStudySessionProcessing(sessionId);
        console.log("Session Data:", sessionData['Objects']); // Log the output of the function

        const newItems = []; // Initialize an empty array to store new items

        // Loop through sessionData['Objects']
        for (let i = 0; i < sessionData['Objects'].length; i++) {
          // Create a new dictionary for each object
          const item = {
            title: sessionData['Objects'][i]['_value'], // Use _value for title
            cardTitle: sessionData['Objects'][i]['_measurement'], // Use _value for title
            cardSubtitle: sessionData['Objects'][i]['_time'], // Use _value for title
            cardDetailedText: sessionData['Objects'][i]['_value'] // Use _value for title
          };

          newItems.push(item); // Append the new dictionary to the list
        }

        setItems(newItems); // Set the items state to the new list
        setLoading(false); // Set loading to false after data is fetched

      } catch (error) {
        console.error("Error fetching session data:", error);
        setLoading(false); // Also set loading to false in case of error
      }
    };

    fetchData();

  }, []); // Empty dependency array means it runs once when the component mounts

  console.log("Items:", items); // Log the items variable

  // Conditional rendering based on loading state
  if (loading) {
    return <div>Loading...</div>; // Display loading message or spinner
  }

  return (
    <div style={{ width: "500px", height: "400px" }}>
      <Chrono items={items} mode="HORIZONTAL" />
    </div>
  );
};

module.exports = TimeLine;
