import ListGroup from "react-bootstrap/ListGroup";
import "../../styles/Episodes.css";

function EpisodeSelect({ episode, activeEpisode, onEpisodeClick }) {
  return (
    <ListGroup as="ol" className="list-group-scrollable">
      {episode.map((agent, index) => (
        <ListGroup.Item
          key={index}
          action
          as="li"
          style={{ fontSize: 15, fontWeight: "normal" }}
          className={`list-group-item-custom ${
            activeEpisode.name === agent.name ? "active" : ""
          }`}
          onClick={() => onEpisodeClick(agent)}
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">{agent.name}</div>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default EpisodeSelect;
