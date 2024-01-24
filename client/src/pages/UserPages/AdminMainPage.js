import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import "../../index.css";
import { useFormik } from "formik";
import UsersApi from "../../api/UsersApi";
import AuthApi from "../../api/AuthApi";

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
      console.log("test - 0");
      if (values.role === "student") {
        result = await AuthApi.addStudent({
          email: values.email,
          password: values.password,
          name: values.name,
          surname: values.surname,
          pesel: values.pesel,
          class: values.class,
        });
      } else if (values.role === "teacher") {
        result = await AuthApi.addTeacher({
          email: values.email,
          password: values.password,
          name: values.name,
          surname: values.surname,
          pesel: values.pesel,
          course: values.course,
        });
      }

      if (!result.success) {
        if (result.email) {
          console.log("test 1");
          console.log(result);
          helpers.setErrors({ email: result.email });
          return;
        }
        if (result.pesel) {
          console.log("test 2");
          console.log(result);
          helpers.setErrors({ pesel: result.pesel });
          return;
        }

        console.log("test 3");
        alert("Błąd dodawania!");
        return;
      }

      console.log("reset");
      formik.resetForm();
    },
  });

  return (
    <>
      <div
        style={{ height: "91vh" }}
        className="d-flex flex-column justify-content-center align-items-center"
      >
        <h2 className="creating-header">Tworzenie uzytkownika</h2>

        <Card
          className="w-25"
          style={{
            maxHeight: "100%",
            overflow: "auto",
            boxSizing: "border-box",
          }}
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
                {formik.errors.email ? (
                  <p className="error">{formik.errors.email}</p>
                ) : null}
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
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Imię</Form.Label>
                <Form.Control
                  required
                  name="name"
                  type="string"
                  placeholder="imię"
                  {...formik.getFieldProps("name")}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicSurname">
                <Form.Label>Nazwisko</Form.Label>
                <Form.Control
                  required
                  name="surname"
                  type="string"
                  placeholder="nazwisko"
                  {...formik.getFieldProps("surname")}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPesel">
                <Form.Label>PESEL</Form.Label>
                <Form.Control
                  required
                  name="pesel"
                  type="string"
                  placeholder="pesel"
                  {...formik.getFieldProps("pesel")}
                />
                {formik.errors.pesel ? (
                  <p className="error">{formik.errors.pesel}</p>
                ) : null}
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPesel">
                <Form.Label>Rola</Form.Label>
                <Form.Select
                  required
                  name="role"
                  {...formik.getFieldProps("role")}
                >
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
    </>
  );
};

export default UserMainPage;
