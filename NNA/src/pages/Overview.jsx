import SingleLineChart from "../components/SingleLineChart";
import BiaxialLineChart from "../components/BiaxialChart";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Overview() {
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <h3> Overall Epoch/Loss of Agents </h3>
            <SingleLineChart />
          </Col>
          <Col>
            <h3> Overall Training Time and Accuracy of Agents </h3>
            <BiaxialLineChart />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Overview;
