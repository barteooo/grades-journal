import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import "../../index.css";
import { useFormik } from "formik";
import UsersApi from "../../api/UsersApi";
import AuthApi from "../../api/AuthApi";

const AdminCreatingClassePage = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: async (values, helpers) => {},
  });

  return (
    <>
      <div
        style={{ height: "91vh" }}
        className="d-flex flex-column justify-content-center align-items-center"
      >
        <h2 className="creating-header">Tworzenie przedmiotu</h2>

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
                <Form.Label>Tworzenie przedmiotu</Form.Label>
                <Form.Control
                  required
                  name="name"
                  type="text"
                  placeholder="wprowadź nazwę przedmiotu"
                  {...formik.getFieldProps("name")}
                />
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

export default AdminCreatingClassePage;
