import { useCallback, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import UsersApi from "../../api/UsersApi";
import ClassesApi from "../../api/ClassesApi";
import DeleteFromClassForm from "../../components/DeleteFromClassForm";
import AddToClassForm from "../../components/AddToClassForm";
import AdminClassesHeader from "../../components/AdminClassesHeader";

const AdminClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [classToEdit, setClassToEdit] = useState({});

  const [classStudents, setClassStudents] = useState([]);
  const [otherStudents, setOtherStudents] = useState([]);

  useEffect(() => {
    const initClasses = async () => {
      const result = await ClassesApi.getClasses();
      if (!result.success) {
        alert("Nie udało się pobrać klas");
        return;
      }
      setClasses([...result.classes]);
      setClassToEdit(result.classes[0]);
    };
    initClasses();
  }, []);

  useEffect(() => {
    initStudents();
  }, [classToEdit]);

  const initStudents = useCallback(async () => {
    if (!classToEdit?._id) {
      return;
    }

    const resultInClass = await UsersApi.getStudents(classToEdit._id, true);
    if (!resultInClass.success) {
      alert("Nie udało się pobrać uczniów");
      return;
    }

    setClassStudents([...resultInClass.students]);

    const resultNoinclass = await UsersApi.getStudents(classToEdit._id, false);
    if (!resultNoinclass.success) {
      alert("Nie udało się pobrać uczniów");
      return;
    }

    setOtherStudents([...resultNoinclass.students]);
  }, [classToEdit._id]);

  const handleChange = (e) => {
    const newClassToEdit = classes.filter(
      (clas) => clas.name === e.target.value
    )[0];
    setClassToEdit(newClassToEdit);
  };

  const handleDelete = async (id) => {
    const result = await ClassesApi.deleteClass(id);
    if (!result.success) {
      alert("nie udało się usunąć klasy");
      return;
    }
    const newClasses = classes.filter((clas) => clas._id !== id);

    setClasses([...newClasses]);
    const newClassToEdit = newClasses[0] ? newClasses[0] : [];
    setClassToEdit(newClassToEdit);
    alert("usunieto klase!");
  };

  const handleClickDeleteStudentFromClass = async (id) => {
    const res = await ClassesApi.deleteStudentFromClass(classToEdit._id, id);
    if (!res.success) {
      alert("nie udało się usunąć ucznia z klasy");
      return;
    }

    await initStudents();
  };

  const handleClickAddStudentToClass = async (id) => {
    const res = await ClassesApi.addStudentToClass(classToEdit._id, id);
    if (!res.success) {
      alert("nie udało się dodać ucznia do klasy");
      return;
    }

    await initStudents();
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Form.Select className="mb-2" onChange={(e) => handleChange(e)}>
            {classes?.map((clas, index) => {
              return (
                <option key={index} value={clas.name}>
                  {clas.name}
                </option>
              );
            })}
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <AdminClassesHeader
            clas={classToEdit}
            studentsCount={classStudents.length}
            onClickDelete={handleDelete}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <DeleteFromClassForm
            students={classStudents}
            onClickDelete={handleClickDeleteStudentFromClass}
          />
        </Col>
        <Col>
          <AddToClassForm
            students={otherStudents}
            onCLickAdd={handleClickAddStudentToClass}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminClassesPage;
