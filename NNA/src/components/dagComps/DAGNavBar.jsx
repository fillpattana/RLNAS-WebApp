import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Properties from "../Properties";

function DAGNavBar({ node }) {
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
            defaultActiveKey="#Agent1"
            variant="tabs"
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px", fontSize: 18, fontWeight: "bold" }}
            navbarScroll
          >
            <Nav.Link href="#Agent1">Agent 1</Nav.Link>
            <Nav.Link href="#Agent2">Agent 2</Nav.Link>
            <Nav.Link href="#Agent3">Agent 3</Nav.Link>
            <Nav.Link href="#Agent4">Agent 4</Nav.Link>
            <Nav.Link href="#Agent5">Agent 5</Nav.Link>
            <Nav.Link href="#Agent6">Agent 6</Nav.Link>
            <Nav.Link href="#Agent7">Agent 7</Nav.Link>
            <Nav.Link href="#Agent8">Agent 8</Nav.Link>
          </Nav>
          <NavDropdown
            title="Node Properties"
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
