import { useFormik } from "formik";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";

import AuthApi from "../api/AuthApi";
import { useContext } from "react";
import AppContext from "../Context/AppContext";
import UsersApi from "../api/UsersApi";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import socket from "../sockets";

const SigninPage = () => {
  const [contextState, setContextState] = useContext(AppContext);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values, helpers) => {
      const result = await AuthApi.sigin(values);
      if (!result.success) {
        helpers.setErrors({ error: result.message });
        return;
      }

      AuthService.setToken(result.token);
      AuthService.setUserId(result.id);

      const getUserResult = await UsersApi.getUser(result.id);
      if (!getUserResult) {
        helpers.setErrors({ error: "Błąd pobierania danych uzytkownika!" });
        return;
      }

      socket.emit("user_data", { userId: getUserResult.user._id });
      setContextState({ ...contextState, user: getUserResult.user });

      if (getUserResult.user.role === "admin") {
        navigate("/admin");
      } else if (getUserResult.user.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/student");
      }
    },
  });

  return (
    <div
      style={{ height: "100vh" }}
      className="d-flex justify-content-center align-items-center"
    >
      <Card className="w-25">
        <Card.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                name="email"
                type="email"
                placeholder="Enter email"
                {...formik.getFieldProps("email")}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                name="password"
                type="password"
                placeholder="Password"
                {...formik.getFieldProps("password")}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Zaloguj
            </Button>
            {formik.errors.error ? (
              <Alert className="mt-2" variant="danger">
                {formik.errors.error}
              </Alert>
            ) : null}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SigninPage;
