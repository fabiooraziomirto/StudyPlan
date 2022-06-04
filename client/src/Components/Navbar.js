import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Nav } from 'react-bootstrap';


const NavbarS = () => {

  return (
      <Navbar bg="secondary" expand="sm" variant="dark" fixed="top" className="navbar-padding">
        <Navbar.Brand href="/">
          <img
            alt=""
            src="./logo_poli_bianco_260.png"
            width="100"
            height="40"
            className="d-inline-block align-top"
          />{' '} Study Plan
        </Navbar.Brand>
          <Nav className="mt-0">
            <Nav.Item>
              <Nav.Link href="/login" className="bi bi-person-circle icon-size" style={{align: 'center', position: 'absolute', right: 100, top: 15 }}>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>
    );
}

export { NavbarS };