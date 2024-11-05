import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Properties from "../Properties";

// Define the list of agents at the top
const agents = [
  "Agent 1",
  "Agent 2",
  "Agent 3",
  "Agent 4",
  "Agent 5",
  "Agent 6",
  "Agent 7",
  "Agent 8",
];

function AgentSelect({ agents, activeAgent, onAgentChange }) {
  return (
    <Navbar
      bg="light"
      data-bs-theme="light"
      expand="lg"
      className="bg-body-tertiary"
      style={{
        borderTopLeftRadius: "25px",
        borderTopRightRadius: "25px",
      }}
    >
      <Container fluid>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScrollable">
          <Nav
            variant="tabs"
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px", fontSize: 18, fontWeight: "bold" }}
            navbarScroll
          >
            {agents.map((agent) => (
              <Nav.Link
                key={agent.id}
                active={activeAgent === agent.id}
                onClick={() => onAgentChange(agent.id)}
              >
                {agent.name}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
        {/* <NavDropdown
          title="Node Properties"
          autoClose="inside"
          drop="down"
          align={{ lg: "end" }}
          id="diagram-properties"
        >
          <NavDropdown.Header as="div">
            <Properties node={node} />
          </NavDropdown.Header>
        </NavDropdown> */}
      </Container>
    </Navbar>
  );
}

export default AgentSelect;
