import LossChart from "../components/LossChart";
import OverallPerformanceChart from "../components/OverallPerformanceChart";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
              <h3> Overall Training Time and Accuracy of All Agents </h3>
              <OverallPerformanceChart />
            </Col>
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default Overview;
