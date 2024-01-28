import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import mqttClient from "../../mqttClient";

const StudentMainPage = () => {
  return (
    <Container>
      <Row className="mb-3 gx-2 ">
        <Col md={4}>
          <Link to="/student/messages">
            <div className="p-3 bg-primary text-white">Wiadomości</div>
          </Link>
        </Col>
        <Col md={4}>
          <Link to="/student/journal">
            <div className="p-3 bg-success text-white">Dziennik</div>
          </Link>
        </Col>
        <Col md={4}>
          <div className="p-3 bg-info text-white">Edycja ustawień</div>
        </Col>
      </Row>

      <Row className="gx-2">
        <Col md={4}>
          <div className="p-3 bg-warning text-dark">Plan zajęć</div>
        </Col>
        <Col md={4}>
          <div className="p-3 bg-danger text-white">Najbliższe dni wolne</div>
        </Col>
        <Col md={4}>
          <div className="p-3 bg-secondary text-white">
            Szczęśliwy numer w dzienniku
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentMainPage;
