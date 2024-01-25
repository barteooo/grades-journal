import { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/esm/Button";
import { Link, Outlet, useNavigate } from "react-router-dom";
import AppContext from "../Context/AppContext";
import { initialState } from "../Context/AppContextProvider";

const AdminLayout = () => {
  const [contextState, setContextState] = useContext(AppContext);
  const navigate = useNavigate();
  const handleClick = () => {
    setContextState(initialState);
    navigate("/");
  };
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
            <Link className="nav-link" to="/admin/classes">
              Klasy
            </Link>
            <Link className="nav-link" to="/admin/teachers">
              Nauczyciele i klasy
            </Link>
            <Link className="nav-link" to="/admin/subjects/teachers">
              Nauczyciele i przedmioty
            </Link>
            <Link className="nav-link" to="/admin/subject">
              Dodawanie przedmiotu
            </Link>
            <Link className="nav-link" to="/admin/class">
              Dodawanie klasy
            </Link>
            <Link className="nav-link" to="/admin/subjects">
              Przedmioty
            </Link>
          </Nav>
          <Button variant="outline-secondary" onClick={handleClick}>
            Logout
          </Button>
        </Container>
      </Navbar>
      <main>
        <Outlet />;
      </main>
    </div>
  );
};

export default AdminLayout;
