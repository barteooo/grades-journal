import { useContext } from "react";
import Container from "react-bootstrap/Container";
import { Link, Outlet, useNavigate } from "react-router-dom";
import AppContext from "../Context/AppContext";
import { initialState } from "../Context/AppContextProvider";
import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import AuthService from "../services/AuthService";

const StudentLayout = () => {
  const [contextState, setContextState] = useContext(AppContext);
  const navigate = useNavigate();

  const handleClickNavigateHome = () => {
    navigate("/teacher");
  };

  const handleClickLogout = () => {
    AuthService.remove();
    setContextState({ ...initialState });
    navigate("/");
  };

  return (
    <div>
      <Container fluid>
        <Row className="mb-3 text-white text-center bg-dark ">
          <Col>
            <div className="h-100 d-flex justify-content-start align-items-center">
              <Button variant="secondary" onClick={handleClickNavigateHome}>
                Strona główna
              </Button>
            </div>
          </Col>

          <Col>
            <h1>14:00</h1>
            <p>13 sierpnia 2020, czwartek</p>
          </Col>
          <Col>
            <div className="h-100 d-flex justify-content-end align-items-center">
              <Button variant="secondary" onClick={handleClickLogout}>
                Wyloguj
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      <Outlet />
    </div>
  );
};

export default StudentLayout;
