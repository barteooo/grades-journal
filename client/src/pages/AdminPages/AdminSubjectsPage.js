import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import UsersApi from "../../api/UsersApi";
import SubjectsApi from "../../api/SubjectsApi";

const AdminSubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const initSubjects = async () => {
      const resultSubjects = await SubjectsApi.getSubjects();
      if (!resultSubjects.success) {
        alert("Błąd pobierania przedmiotów");
        return;
      }
      const resultTeachers = await UsersApi.getTeachers();
      if (!resultTeachers.success) {
        alert("Błąd pobierania nauczycieli do przedmiotów");
        return;
      }
      setSubjects([...resultSubjects.subjects]);
      setTeachers([...resultTeachers.teachers]);
      return;
    };
    initSubjects();
  }, []);

  const handleDelete = async (id) => {
    const result = await SubjectsApi.deleteSubject(id);
    if (!result.success) {
      alert("nie udało się usunac przedmiotu");
      return;
    }
    const subjectsAdterDelete = subjects.filter((s) => s._id !== id);
    setSubjects(subjectsAdterDelete);
  };
  return (
    <Table>
      <thead>
        <tr>
          <th>przedmiot</th>
          <th>nauczyciele</th>
          <th>usuń</th>
        </tr>
      </thead>
      <tbody>
        {subjects?.map((subject, index) => {
          return (
            <tr key={index}>
              <td>{subject?.name}</td>
              <td>
                {subject?.teachers?.map((id, idx) => {
                  const teacher = teachers?.find(
                    (teacher) => teacher._id === id
                  );
                  return (
                    <div key={idx}>
                      {teacher?.name} {teacher?.surname} <br></br>
                    </div>
                  );
                })}
              </td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(subject._id)}
                >
                  Usuń
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default AdminSubjectsPage;
