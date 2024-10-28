import Dropdown from "react-bootstrap/Dropdown";
import Properties from "../Properties";

function dropDownProps({ node }) {
  return (
    <Dropdown autoClose="inside" key="end" drop="end">
      <Dropdown.Toggle variant="secondary" id="dropdown-properties">
        Properties
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Header as="div">
          <Properties node={node} />
        </Dropdown.Header>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default dropDownProps;
