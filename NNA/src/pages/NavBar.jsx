import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import "../styles/NavBar.css";

function NavBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={NavLink} to="/" end>
          Neural Network Reinforcement Learning
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link
            as={NavLink}
            to="/overview"
            style={({ isActive }) =>
              isActive
                ? { textDecoration: "underline", fontWeight: "bold" }
                : {}
            }
          >
            Overview
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/agents"
            style={({ isActive }) =>
              isActive
                ? { textDecoration: "underline", fontWeight: "bold" }
                : {}
            }
          >
            Agents
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;
