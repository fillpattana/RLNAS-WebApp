import LossChart from "../components/LossChart";
import OverallAccuracyChart from "../components/OverallAccuracyChart";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OverallFlopChart from "../components/OverallFlopChart";

function Overview() {
  return (
    <div>
      <Container>
        <Row>
          <div className="elements-container">
            <Col>
              <h3> Overall Epoch/Loss of All Agents </h3>
              <LossChart />
            </Col>
          </div>
          <div className="elements-container">
            <Col>
              <h3> Overall Accuracy of All Agents </h3>
              <OverallAccuracyChart />
            </Col>
          </div>
          <div className="elements-container">
            <Col>
              <h3> Overall Flop Rate of All Agents </h3>
              <OverallFlopChart />
            </Col>
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default Overview;
