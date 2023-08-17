import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { deleteCookieHandler } from "../../hooks/cookieHandler";
import { MdSchool } from "react-icons/md";

class Navigationbar extends Component {
  logout() {
    deleteCookieHandler();
    document.location.href = "/";
  }

  render() {
    return (
      <div style={{ color: "#ffffff" }} className="flex-fill bg-info">
        <Navbar
          key={false}
          expand={false}
          className="bg-body-tertiary mb-3 dark"
        >
          <Container fluid>
            <Navbar.Brand href="/">
              <MdSchool />
              School Management System
            </Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${false}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${false}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${false}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${false}`}>
                  School Management
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link href="/">Home</Nav.Link>
                  <Nav.Link onClick={() => this.logout()}>Logout</Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default Navigationbar;
