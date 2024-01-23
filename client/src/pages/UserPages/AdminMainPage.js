import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";

import { useFormik } from "formik";
import UsersApi from "../../api/UsersApi";

const UserMainPage = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
      surname: "",
      pesel: "",
      role: "student",
    },
    onSubmit: async (values, helpers) => {
      let result;
      if (values.role === "student") {
        result = await UsersApi.addStudent({
          email: values.email,
          password: values.password,
          name: values.name,
          surname: values.surname,
          pesel: values.pesel,
        });
      } else if (values.role === "teacher") {
        result = await UsersApi.addTeacher({
          email: values.email,
          password: values.password,
          name: values.name,
          surname: values.surname,
          pesel: values.pesel,
        });
      }

      if (!result.success) {
        alert("Błąd dodawania!");
        return;
      }

      helpers.resetForm();
    },
  });

  return (
    <div
      style={{ height: "100vh" }}
      className="d-flex justify-content-center align-items-center"
    >
      <Card
        className="w-25"
        style={{ maxHeight: "100%", overflow: "auto", boxSizing: "border-box" }}
      >
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
              <Form.Label>Hasło</Form.Label>
              <Form.Control
                required
                name="password"
                type="password"
                placeholder="hasło"
                {...formik.getFieldProps("password")}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Imię</Form.Label>
              <Form.Control
                required
                name="name"
                type="string"
                placeholder="imię"
                {...formik.getFieldProps("name")}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Nazwisko</Form.Label>
              <Form.Control
                required
                name="surname"
                type="string"
                placeholder="nazwisko"
                {...formik.getFieldProps("surname")}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>PESEL</Form.Label>
              <Form.Control
                required
                name="pesel"
                type="string"
                placeholder="pesel"
                {...formik.getFieldProps("pesel")}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Rola</Form.Label>
              <Form.Select name="role" {...formik.getFieldProps("role")}>
                <option value="student">Uczeń</option>
                <option value="teacher">Nauczyciel</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Dodaj
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserMainPage;
