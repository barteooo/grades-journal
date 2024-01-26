import UsersApi from "../../api/UsersApi";
import { useCallback, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import SubjectsApi from "../../api/SubjectsApi";
import AdminSubjectsHeader from "../../components/Admin/AdminSubjectsHeader";
import UnsignSubjectForm from "../../components/Admin/UnsignSubjectForm";
import AsignSubjectForm from "../../components/Admin/AsignSubjectForm";
const AdminTeachersSubjectsPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [teacherToEdit, setTeacherToEdit] = useState({});
  const [teacherSubjects, setTeacherSubjects] = useState([]);
  const [otherSubjects, setOtherSubjects] = useState([]);

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
    initSubjects();
  }, [teacherToEdit]);

  const initSubjects = useCallback(async () => {
    if (!teacherToEdit._id) {
      return;
    }
    const resultAssigned = await SubjectsApi.getSubjects(
      teacherToEdit._id,
      true
    );

    if (!resultAssigned.success) {
      alert("nie udało sie pobrac nauczycieli");
      return;
    }
    const resultNotAssigned = await SubjectsApi.getSubjects(
      teacherToEdit._id,
      false
    );

    console.log(resultNotAssigned);

    if (!resultNotAssigned.success) {
      alert("nie udało sie pobrac nauczycieli");
      return;
    }

    setTeacherSubjects([...resultAssigned.subjects]);
    setOtherSubjects([...resultNotAssigned.subjects]);
  }, [teacherToEdit]);

  const handleChangeTeacher = useCallback(
    (id) => {
      const teacher = teachers.find((x) => x._id.toString() === id);
      setTeacherToEdit({ ...teacher });
    },
    [teachers]
  );
  const handleDeleteSubjectFromTeacher = async (id) => {
    const result = await SubjectsApi.deleteSubjectFromTeacher(
      id,
      teacherToEdit._id
    );
    if (!result.success) {
      alert("Nie udało się usunąć klasy");
      return;
    }
    initSubjects();
  };

  const handleAssignSubjectToTeacher = async (id) => {
    const result = await SubjectsApi.assignSubjectToTeacher(
      id,
      teacherToEdit._id
    );
    if (!result.success) {
      alert("Nie udało się usunąć klasy");
      return;
    }
    initSubjects();
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
          <AdminSubjectsHeader
            teacher={teacherToEdit}
            subjects={teacherSubjects}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <UnsignSubjectForm
            subjects={teacherSubjects}
            onClickDelete={handleDeleteSubjectFromTeacher}
          />
        </Col>
        <Col>
          <AsignSubjectForm
            subjects={otherSubjects}
            onClickAdd={handleAssignSubjectToTeacher}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminTeachersSubjectsPage;
