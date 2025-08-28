import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './NavbarC.css'

const NavbarC = () => {
  return (
    <>
      <Navbar expand="lg" className="custom-navbar">
        <Container>
          <Navbar.Brand href="#home" className="d-flex align-items-center">
            <img
              src="/images/LOGOCAT.PNG"
              width="40"
              height="40"
              className="d-inline-block align-top me-2"
              alt="Logo CAT"
            />
            <span className="brand-text">Simulador de Tasas</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home" className="nav-link-custom">Inicio</Nav.Link>
              <NavDropdown 
                title="Selector" 
                id="basic-nav-dropdown"
                className="nav-dropdown-custom"
              >
                <NavDropdown.Item href="#action/3.1" className="dropdown-item-custom">
                  Vivienda Unifamiliar
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2" className="dropdown-item-custom">
                  Edificios en altura
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3" className="dropdown-item-custom">
                  Edificios especiales
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4" className="dropdown-item-custom">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarC;