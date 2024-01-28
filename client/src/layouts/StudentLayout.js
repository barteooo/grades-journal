import { useContext, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { Link, Outlet, useNavigate } from "react-router-dom";
import AppContext from "../Context/AppContext";
import { initialState } from "../Context/AppContextProvider";
import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import AuthService from "../services/AuthService";
import socket from "../sockets";
import Timer from "../components/Timer";
import mqttClient from "../mqttClient";

const StudentLayout = () => {
  const [contextState, setContextState] = useContext(AppContext);
  const navigate = useNavigate();

  const handleClickNavigateHome = () => {
    navigate("/student");
  };

  const handleClickLogout = () => {
    AuthService.remove();
    setContextState({ ...initialState });
    socket.emit("logout");
    mqttClient.unsubscribe("journal/newGrade");
    mqttClient.unsubscribe("journal/updateGrade");

    navigate("/");
  };

  useEffect(() => {
    const handleMessage = (topic, message) => {
      if (topic === "journal/newGrade") {
        const { value, assName, studentId } = JSON.parse(message);
        if (contextState.user._id === studentId) {
          alert(`nowa ocena ${value} z ${assName}`);
        }
      }
      if (topic === "journal/updateGrade") {
        const { value, assName, studentId } = JSON.parse(message);
        if (contextState.user._id === studentId) {
          alert(`zmieniono ocenę na ${value} z ${assName}`);
        }
      }
    };

    mqttClient.on("message", handleMessage);

    return () => {
      mqttClient.off("message", handleMessage);
    };
  }, [contextState.user._id]); //

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
            <h1>
              <Timer />
            </h1>
            <p>{contextState.user.email}</p>
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
