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
            defaultActiveKey="#Agent1"
            variant="tabs"
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link href="#Episode 1">Episode 1</Nav.Link>
            <Nav.Link href="#Episode 2">Episode 2</Nav.Link>
            <Nav.Link href="#Episode 3">Episode 3</Nav.Link>
            <Nav.Link href="#Episode 4">Episode 4</Nav.Link>
            <Nav.Link href="#Episode 5">Episode 5</Nav.Link>
            <Nav.Link href="#Episode 6">Episode 6</Nav.Link>
            <Nav.Link href="#Episode 7">Episode 7</Nav.Link>
            <Nav.Link href="#Episode 8">Episode 8</Nav.Link>
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
