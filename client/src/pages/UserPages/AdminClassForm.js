import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useFormik } from "formik";
import "../../index.css";
import SubjectsApi from "../../api/SubjectsApi";
import ClassesApi from "../../api/ClassesApi";

const AdminClassForm = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: async (values, helpers) => {
      const result = await ClassesApi.addClass(values);
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
        <h2 className="creating-header">Tworzenie klasy</h2>

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
                  placeholder="Wprowadź nazwę klasy"
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

export default AdminClassForm;
