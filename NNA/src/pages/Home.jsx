import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { useTimestamp } from "../context/TimestampContext";
import SessionForm from "../components/SessionForm";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../styles/Home.css";

function Home() {
  const [sessions, setSessions] = useState([]);
  const { setTimestamp } = useTimestamp();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const ws = useRef(null); // WebSocket reference

  
  const fetchData = async () => {
    fetch("http://localhost:3000/api/ActiveSessions")
      .then((response) => response.json())
      .then((data) => setSessions(data))
      .catch((error) => console.error("Error fetching sessions:", error));
  }

  useEffect(() => {
      fetchData();
  }, []);
  
  useEffect(() => {
    // WebSocket setup
    ws.current = new WebSocket("ws://localhost:3000");

    ws.current.onopen = () => {
      console.log("WebSocket connected Session Selection");
      // Subscribe to the "sessions_change" channel
      ws.current.send(JSON.stringify({ type: "subscribe", channel: "sessions_change" }));
    };

    ws.current.onmessage = (event) => {
      try {
        const realTimeData = JSON.parse(event.data);
        console.log("Received WebSocket update in Session Selections:", realTimeData);

        // Trigger data refresh on sessions_change
        fetchData();
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };

    ws.current.onerror = (err) => console.error("WebSocket error:", err);

    ws.current.onclose = () => {
      console.log("WebSocket closed, attempting to reconnect...");
      setTimeout(() => {
        if (ws.current?.readyState !== 1) {
          ws.current = new WebSocket("ws://localhost:3000");
        }
      }, 3000);
    };

    return () => {
      ws.current?.close();
    };
  },[]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "-";
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

  const handleRowClick = (session) => {
    const formattedTimestamp = session.sessionInfo.runtimestamp.replace(
      "T",
      " "
    );
    setTimestamp(formattedTimestamp);
    navigate("/agents");
  };

  // Check if there are any active sessions
  const hasActiveSession = sessions.some(
    (session) => session.sessionInfo.endtimestamp === null
  );

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
                        onClick={() => handleRowClick(session)}
                        style={{ cursor: "pointer" }}
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

        <Row className="mt-3">
          <Col className="text-center">
            {/* "Create New Session" Button */}
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              disabled={hasActiveSession}
            >
              Create New Session
            </Button>
          </Col>
        </Row>

        {/* Modal for Session Form */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Create New Session</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SessionForm />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default Home;
