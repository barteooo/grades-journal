import { useCallback, useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import ClassesApi from "../../api/ClassesApi";
import UsersApi from "../../api/UsersApi";
import AdminTeachersHeader from "../../components/AdminTeachersHeader";

const AdminTeachersPage = () => {
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

    // const initClasses = async () => {
    //   const result = await ClassesApi.getClasses();
    //   if (!result.success) {
    //     alert("Nie udało się pobrać klas");
    //     return;
    //   }
    //   setClasses([...result.classes]);
    //   //   setClassToEdit(result.classes[0]);
    // };
    // initClasses();
  }, []);

  const initClasses = () => {};

  const handleChangeTeacher = useCallback(
    (id) => {
      const teacher = teachers.find((x) => x._id.toString() === id);
      setTeacherToEdit({ ...teacher });
    },
    [teachers]
  );

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
      <Row>
        <Col>
          <AdminTeachersHeader teacher={teacherToEdit} />
        </Col>
      </Row>
      <Row>
        <Col></Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default AdminTeachersPage;
