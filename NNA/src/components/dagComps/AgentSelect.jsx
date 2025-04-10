import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Properties from "../Properties";

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
      </Container>
    </Navbar>
  );
}

export default AgentSelect;
