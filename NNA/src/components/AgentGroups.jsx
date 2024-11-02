import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import "../styles/AgentGroups.css";

function AgentGroups() {
  return (
    <ListGroup as="ol" numbered>
      <ListGroup.Item action as="li" className="list-group-item-custom">
        <div className="ms-2 me-auto">
          <div className="fw-bold">Agent Group 1</div>
        </div>
        <Badge bg="primary" pill>
          # of updates
        </Badge>
      </ListGroup.Item>
      <ListGroup.Item action as="li" className="list-group-item-custom">
        <div className="ms-2 me-auto">
          <div className="fw-bold">Agent Group 2</div>
        </div>
        <Badge bg="primary" pill>
          2
        </Badge>
      </ListGroup.Item>
      <ListGroup.Item action as="li" className="list-group-item-custom">
        <div className="ms-2 me-auto">
          <div className="fw-bold">Agent Group 3</div>
        </div>
        <Badge bg="primary" pill>
          3
        </Badge>
      </ListGroup.Item>
    </ListGroup>
  );
}

export default AgentGroups;
