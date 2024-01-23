import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import UsersApi from "../../api/UsersApi";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filterOption, setFilterOption] = useState("students");
  const [patternName, setPatternName] = useState("");

  useEffect(() => {
    const initStudents = async () => {
      const result = await UsersApi.getStudents();
      if (!result.success) {
        alert("Błąd pobierania danych uztkowników");
        return;
      }

      setUsers([...result.students]);
    };

    initStudents();
  }, []);

  const handleChangeFilterOption = async (e) => {
    setFilterOption(e.target.value);

    if (e.target.value === "students") {
      const result = await UsersApi.getStudents();
      if (!result.success) {
        alert("Błąd pobierania danych uztkowników");
        return;
      }

      setUsers([...result.students]);
    } else if (e.target.value === "teachers") {
      const result = await UsersApi.getTeachers();
      if (!result.success) {
        alert("Błąd pobierania danych uztkowników");
        return;
      }

      setUsers([...result.teachers]);
    }
  };

  const searchByName = async () => {
    if (filterOption === "students") {
      const result = await UsersApi.getStudentsByName(patternName);
      if (!result.success) {
        alert("błąd");
        return;
      }
      setUsers(result.students);
      return;
    }
    const result = await UsersApi.getTeachersByName(patternName);
    if (!result.success) {
      alert("błąd");
      return;
    }
    setUsers(result.teachers);
    return;
  };

  const handleDelete = async (id) => {
    const result = await UsersApi.deleteUser(id);
    if (!result.success) {
      alert("nie udało się usunac uzytkownika");
      return;
    }

    const usersAdterDelete = users.filter((u) => u._id !== id);
    setUsers(usersAdterDelete);
    alert("usunieto!");
  };

  return (
    <div>
      <Form.Select
        className="mb-2"
        onChange={handleChangeFilterOption}
        value={filterOption}
      >
        <option value="students">Uczniowie</option>
        <option value="teachers">Nauczyciele</option>
      </Form.Select>
      <div>
        <input
          className="ms-3"
          type="text"
          placeholder="wprowadź imię"
          onChange={(e) => setPatternName(e.target.value)}
        />
        <button className="ms-1" onClick={searchByName}>
          szukaj
        </button>
      </div>

      <Table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th>PESEL</th>
            <th onClick={handleDelete}>Usuń z systemu</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, index) => {
            return (
              <tr key={index}>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>{user.surname}</td>
                <td>{user.pesel}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(user._id)}
                  >
                    Usuń
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminUsersPage;
