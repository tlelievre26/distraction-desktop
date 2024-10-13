const React = require("react");
const { Chrono } = require("react-chrono");

const { SpecificStudySessionProcessing } = require("../../api_recievers/influxqueries.js");


const TimeLine = () => {
  const [items, setItems] = React.useState([
    {
      title: "May 1940",
      cardTitle: "Dunkirk",
      cardSubtitle: "Men of the British Expeditionary Force (BEF) wade out to...",
      cardDetailedText: "Men of the British Expeditionary Force (BEF) wade out to..."
    }
  ]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = await SpecificStudySessionProcessing(2);

        console.log("Session Data:", sessionData); 

      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: "500px", height: "400px" }}>
      <Chrono items={items} mode="HORIZONTAL" />
    </div>
  );
};

module.exports = TimeLine;
