import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useFormik } from "formik";
import AuthApi from "../../api/AuthApi";
import "../../index.css";
import SubjectsApi from "../../api/SubjectsApi";

const AdminSubjectForm = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: async (values, helpers) => {
      const result = await SubjectsApi.addSubject(values);
      if (!result.success) {
        if (result.message) {
          helpers.setErrors({ name: result.message });
          return;
        }
      }
      formik.resetForm();
    },
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
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  name="name"
                  type="text"
                  placeholder="Wprowadź nazwę przedmiotu"
                  {...formik.getFieldProps("name")}
                />
                {formik.errors.name ? (
                  <p className="error">{formik.errors.name}</p>
                ) : null}
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

export default AdminSubjectForm;
