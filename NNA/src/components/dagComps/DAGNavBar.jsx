import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Properties from "../Properties";

function DAGNavBar({ node }) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScrollable">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link href="#Agent1">Agent1</Nav.Link>
            <Nav.Link href="#Agent2">Agent2</Nav.Link>
            <Nav.Link href="#Agent3">Agent3</Nav.Link>
            <Nav.Link href="#Agent4">Agent4</Nav.Link>
            <Nav.Link href="#Agent5">Agent5</Nav.Link>
            <Nav.Link href="#Agent6">Agent6</Nav.Link>
            <Nav.Link href="#Agent7">Agent7</Nav.Link>
            <Nav.Link href="#Agent8">Agent8</Nav.Link>
          </Nav>
          <NavDropdown
            title="Properties"
            autoClose="inside"
            drop="down"
            align={{ lg: "end" }}
            id="diagram-properties"
          >
            <NavDropdown.Header as="div">
              <Properties node={node} />
            </NavDropdown.Header>
          </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default DAGNavBar;
