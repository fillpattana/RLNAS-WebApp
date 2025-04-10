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
import Alert from "react-bootstrap/Alert";
import "../styles/Home.css";

function Home() {
  const [sessions, setSessions] = useState([]);
  const { setTimestamp } = useTimestamp();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showStopAlert, setShowStopAlert] = useState(false);
  const ws = useRef(null); // WebSocket reference

  const handleSessionCreated = () => {
    setShowModal(false);
    setShowSuccessAlert(true);
  };

  const handleStopSession = async () => {
    try {
      const activeSession = sessions.find(
        (session) => session.sessionInfo.endtimestamp === null
      );

      console.log(activeSession);

      if (!activeSession) {
        console.warn("No active session to stop.");
        return;
      }

      // Format current timestamp in 'YYYY-MM-DD HH:MM:SS.SSSSSS'
      const now = new Date();
      const formattedTimestamp = now
        .toISOString()
        .replace("T", " ")
        .replace("Z", "");

      const response = await fetch(`http://localhost:3000/api/stopsession`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionid: activeSession.sessionInfo.sessionid,
          endtimestamp: formattedTimestamp,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to stop the session");
      }

      console.log("Session stopped successfully");
      fetchData(); // Refresh session data
      setShowStopAlert(true);
    } catch (error) {
      console.error("Error stopping session:", error);
    }
  };

  const fetchData = async () => {
    fetch("http://localhost:3000/api/ActiveSessions")
      .then((response) => response.json())
      .then((data) => setSessions(data))
      .catch((error) => console.error("Error fetching sessions:", error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // WebSocket setup
    ws.current = new WebSocket("ws://localhost:3000");

    ws.current.onopen = () => {
      console.log("WebSocket connected Session Selection");
      // Subscribe to the "sessions_change" channel
      ws.current.send(
        JSON.stringify({ type: "subscribe", channel: "sessions_change" })
      );
    };

    ws.current.onmessage = (event) => {
      try {
        const realTimeData = JSON.parse(event.data);
        console.log(
          "Received WebSocket update in Session Selections:",
          realTimeData
        );

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
  }, []);

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

  useEffect(() => {
    if (showSuccessAlert) {
      const timer = setTimeout(() => setShowSuccessAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert]);

  useEffect(() => {
    if (showStopAlert) {
      const timer = setTimeout(() => setShowStopAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showStopAlert]);

  return (
    <div>
      <Container>
        {showSuccessAlert && (
          <Alert
            variant="success"
            dismissible
            onClose={() => setShowSuccessAlert(false)}
            className="mt-3"
          >
            <Alert.Heading>Session Created</Alert.Heading>
            <p>
              Your new Neural Architecture Search session has been successfully
              created.
              <br /> Please wait a few moments, before viewing the active
              session from the tables.
            </p>
          </Alert>
        )}
        {showStopAlert && (
          <Alert
            variant="success"
            dismissible
            onClose={() => setShowStopAlert(false)}
            className="mt-3"
          >
            <Alert.Heading>Session Created</Alert.Heading>
            <p>
              Active sessions has been stopped.
              <br /> You are now able to create a new session.
            </p>
          </Alert>
        )}
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
          <Col className="text-center">
            {/* "Stop Active Session" Button */}
            <Button
              variant="danger"
              onClick={handleStopSession}
              disabled={!hasActiveSession}
            >
              Stop Active Session
            </Button>
          </Col>
        </Row>

        {/* Modal for Session Form */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Create New Session</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SessionForm onSuccess={handleSessionCreated} />
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
