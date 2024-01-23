import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/esm/Button";
import { Link, Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div>
      <Navbar bg="dark" expand="lg" data-bs-theme="dark">
        <Container fluid>
          <Navbar.Brand href="#home">Dziennik</Navbar.Brand>
          <Nav className="me-auto">
            <Link className="nav-link" to="/admin">
              Tworzenie uzytkowników
            </Link>
            <Link className="nav-link" to="/admin/users">
              Uzytkownicy
            </Link>
          </Nav>
          <Button variant="outline-secondary">Logout</Button>
        </Container>
      </Navbar>
      <main>
        <Outlet />;
      </main>
    </div>
  );
};

export default UserLayout;
