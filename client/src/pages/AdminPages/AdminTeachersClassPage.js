import { useCallback, useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import ClassesApi from "../../api/ClassesApi";
import UsersApi from "../../api/UsersApi";
import AdminTeachersHeader from "../../components/AdminTeachersHeader";
import UnsignClassForm from "../../components/UnsignClassForm";
import AsignClassForm from "../../components/AsignClassForm";

const AdminTeachersClassPage = () => {
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [otherClasses, setOtherClasses] = useState([]);

  const [teachers, setTeachers] = useState([]);
  const [teacherToEdit, setTeacherToEdit] = useState({});

  useEffect(() => {
    const initTeachers = async () => {
      const result = await UsersApi.getTeachers();
      if (!result.success) {
        alert("Nie udało się pobrać nauczycieli");
        return;
      }

      setTeachers([...result.teachers]);
      if (result.teachers?.length > 0) {
        setTeacherToEdit(result.teachers[0]);
      }
    };
    initTeachers();
  }, []);

  useEffect(() => {
    initClasses();
  }, [teacherToEdit]);

  const initClasses = useCallback(async () => {
    if (!teacherToEdit._id) {
      return;
    }
    const resultAssigned = await ClassesApi.getClasses(teacherToEdit._id, true);
    if (!resultAssigned.success) {
      alert("nie udało sie pobrac nauczycieli");
      return;
    }
    const resultNotAssigned = await ClassesApi.getClasses(
      teacherToEdit._id,
      false
    );
    if (!resultNotAssigned.success) {
      alert("nie udało sie pobrac nauczycieli");
      return;
    }
    setTeacherClasses([...resultAssigned.classes]);
    setOtherClasses([...resultNotAssigned.classes]);
  }, [teacherToEdit]);

  const handleChangeTeacher = useCallback(
    (id) => {
      const teacher = teachers.find((x) => x._id.toString() === id);
      setTeacherToEdit({ ...teacher });
    },
    [teachers]
  );

  const handleDeleteClassFromTeacher = async (id) => {
    const result = await ClassesApi.deleteClassFromTeacher(
      id,
      teacherToEdit._id
    );
    if (!result.success) {
      alert("Nie udało się usunąć klasy");
      return;
    }
    initClasses();
  };

  const handleAssignClassToTeacher = async (id) => {
    const result = await ClassesApi.assignClassToTeacher(id, teacherToEdit._id);
    if (!result.success) {
      alert("Nie udało się usunąć klasy");
      return;
    }
    initClasses();
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Form.Select
            className="mb-2"
            onChange={(e) => handleChangeTeacher(e.target.value)}
          >
            {teachers?.map((teacher, index) => {
              return (
                <option key={index} value={teacher._id}>
                  {teacher.name} {teacher.surname}
                </option>
              );
            })}
          </Form.Select>
        </Col>
      </Row>
      <Row className="mb-5">
        <Col>
          <AdminTeachersHeader
            teacher={teacherToEdit}
            classes={teacherClasses}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <UnsignClassForm
            classes={teacherClasses}
            onClickDelete={handleDeleteClassFromTeacher}
          />
        </Col>
        <Col>
          <AsignClassForm
            classes={otherClasses}
            onClickAdd={handleAssignClassToTeacher}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminTeachersClassPage;
