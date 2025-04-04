import LossChart from "../components/LossChart";
import OverallAccuracyChart from "../components/OverallAccuracyChart";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OverallFlopChart from "../components/OverallFlopChart";
import { useTimestamp } from "../context/TimestampContext"; // Import context

function Overview() {
  const { timestamp } = useTimestamp(); // Get timestamp from context
  return (
    <div>
      <Container>
        <Row>
          <div className="elements-container">
            <Col>
              <h3> Overall Epoch/Loss of All Agents </h3>
              <LossChart runtimestamp={timestamp}/>
            </Col>
          </div>
          <div className="elements-container">
            <Col>
              <h3> Overall Accuracy of All Agents </h3>
              <OverallAccuracyChart runtimestamp={timestamp}/>
            </Col>
          </div>
          <div className="elements-container">
            <Col>
              <h3> Overall Flop Rate of All Agents </h3>
              <OverallFlopChart runtimestamp={timestamp}/>
            </Col>
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default Overview;
