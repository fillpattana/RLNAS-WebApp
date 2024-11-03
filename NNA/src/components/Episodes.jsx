import ListGroup from "react-bootstrap/ListGroup";
import "../styles/Episodes.css";

function Episodes({ episode }) {
  return (
    <ListGroup as="ol" className="list-group-scrollable">
      {episode.map((agent, index) => (
        <ListGroup.Item
          key={index}
          action
          as="li"
          className="list-group-item-custom"
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">{agent.name}</div>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default Episodes;
