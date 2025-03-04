import React, { useEffect, useState } from "react";

function TablesList() {
  const [tables, setTables] = useState([]);
  const ws = React.useRef(null);

  // Fetch initial data and set up WebSocket connection
  useEffect(() => {
    // Fetch initial table data
    fetch("http://localhost:3000/api/Graph")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response issue");
        }
        return response.json();
      })
      .then((data) => setTables(data))
      .catch((error) => console.error("Error fetching tables:", error));

    // Set up WebSocket connection
    ws.current = new WebSocket("ws://localhost:3000");

    ws.current.onopen = () => {
      console.log("WebSocket connected!");
    };

    ws.current.onmessage = (event) => {
      try {
        const realTimeData = JSON.parse(event.data);
        console.log("Real-time data notification:", realTimeData);

        // Update the table with new real-time data
        setTables((prevTables) => {
          // Check if the data already exists
          const existingRowIndex = prevTables.findIndex(
            (row) => row.graphid === realTimeData.graphid
          );

          if (existingRowIndex !== -1) {
            // Update the existing row
            const updatedTables = [...prevTables];
            updatedTables[existingRowIndex] = realTimeData;
            return updatedTables;
          } else {
            // Add the new row
            return [...prevTables, realTimeData];
          }
        });
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected.");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      // Cleanup WebSocket connection
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <div>
      <h3>Graph Table Data</h3>
      {tables.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              {Object.keys(tables[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tables.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TablesList;
