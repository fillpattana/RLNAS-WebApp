import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation on row click
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import "../styles/Home.css";

function Home() {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate(); // Hook to navigate on row click

  useEffect(() => {
    fetch("http://localhost:3000/api/ActiveSessions")
      .then((response) => response.json())
      .then((data) => {
        setSessions(data);
      })
      .catch((error) => console.error("Error fetching sessions:", error));
  }, []);

  // Function to format timestamp for user-friendly display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "-"; // Handle null values
    const dateObj = new Date(timestamp);
    return dateObj.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // Handle row click: Pass raw timestamp to another component
  const handleRowClick = (session) => {
    const formattedTimestamp = session.sessionInfo.runtimestamp.replace(
      "T",
      " "
    );
    navigate("/agents", { state: { runtimestamp: formattedTimestamp } });
  };

  return (
    <div>
      <Container>
        <Row>
          <div className="elements-container">
            <Col>
              <h3>Neural Architecture Search Sessions</h3>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Start Time Stamp</th>
                    <th>End Time Stamp</th>
                    <th>Activity Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session, index) => {
                    const { datasetname, runtimestamp, endtimestamp } =
                      session.sessionInfo;
                    const isActive = endtimestamp === null;

                    return (
                      <tr
                        key={index}
                        className="clickable-row"
                        onClick={() => handleRowClick(session)} // Pass raw data
                        style={{ cursor: "pointer" }} // Indicate it's clickable
                      >
                        <td>{datasetname}</td>
                        <td title={runtimestamp}>
                          {formatTimestamp(runtimestamp)}
                        </td>
                        <td title={endtimestamp}>
                          {endtimestamp ? formatTimestamp(endtimestamp) : "-"}
                        </td>
                        <td>
                          <Badge bg={isActive ? "success" : "secondary"}>
                            {isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
