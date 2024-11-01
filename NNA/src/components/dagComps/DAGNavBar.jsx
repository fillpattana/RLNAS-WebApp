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
    >
      <Container fluid>
        <Navbar.Brand href="#Episodes">Episodes</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScrollable">
          <Nav
            defaultActiveKey="#Agent1"
            variant="tabs"
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link href="#Episode1">1</Nav.Link>
            <Nav.Link href="#Episode2">2</Nav.Link>
            <Nav.Link href="#Episode3">3</Nav.Link>
            <Nav.Link href="#Episode4">4</Nav.Link>
            <Nav.Link href="#Episode5">5</Nav.Link>
            <Nav.Link href="#Episode6">6</Nav.Link>
            <Nav.Link href="#Episode7">7</Nav.Link>
            <Nav.Link href="#Episode8">8</Nav.Link>
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
