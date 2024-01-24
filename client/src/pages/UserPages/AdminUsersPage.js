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
  const [edit, setEdit] = useState("");
  const [editData, setEditData] = useState({
    name: "",
    surname: "",
    pesel: "",
  });

  useEffect(() => {
    const initStudents = async () => {
      const result = await UsersApi.getStudents();
      if (!result.success) {
        alert("Błąd pobierania danych uztkowników");
        return;
      }

      setUsers([...result.students]);
      setEdit(new Array(result.students.length).fill(false));
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
      setEdit(new Array(result.students.length).fill(false));
    } else if (e.target.value === "teachers") {
      const result = await UsersApi.getTeachers();
      if (!result.success) {
        alert("Błąd pobierania danych uztkowników");
        return;
      }
      setUsers([...result.teachers]);
      setEdit(new Array(result.teachers.length).fill(false));
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

  const editChange = (e, field) => {
    setEditData({ ...editData, [field]: e.target.value });
  };
  const handleEdit = async (id, key) => {
    if (edit[key]) {
      const result = await UsersApi.changeUserData(id, editData);
      if (!result.success) {
        alert("nie udało się edytować danych");
        return;
      }
      const newEdit = edit.map((elem, idx) => {
        if (idx === key) {
          return false;
        }
        return elem;
      });
      setEdit(newEdit);

      const newUsers = users.map((elem, idx) => {
        if (idx === key) {
          return {
            ...elem,
            name: editData.name ? editData.name : elem.name,
            surname: editData.surname ? editData.surname : elem.surname,
            pesel: editData.pesel ? editData.pesel : elem.pesel,
          };
        }
        return elem;
      });
      setUsers(newUsers);
      setEditData({ name: "", surname: "", pesel: "" });
    } else {
      const newEdit = edit.map((elem, idx) => {
        if (idx === key) {
          return true;
        }
        return elem;
      });
      setEdit(newEdit);
    }
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
            <th>Usuń z systemu</th>
            <th>Edytuj dane</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, index) => {
            return (
              <tr key={index}>
                <td>{user.email}</td>
                <td>
                  {user.name}
                  {edit[index] ? (
                    <input
                      onChange={(e) => editChange(e, "name")}
                      placeholder="nowe imię"
                    />
                  ) : null}
                </td>
                <td>
                  {user.surname}{" "}
                  {edit[index] ? (
                    <input
                      onChange={(e) => editChange(e, "surname")}
                      placeholder="nowe nazwisko"
                    />
                  ) : null}
                </td>
                <td>
                  {user.pesel}{" "}
                  {edit[index] ? (
                    <input
                      placeholder="nowy pesel"
                      onChange={(e) => editChange(e, "pesel")}
                    />
                  ) : null}
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(user._id)}
                  >
                    Usuń
                  </Button>
                </td>
                <td>
                  {edit[index] ? (
                    <Button
                      variant="success"
                      onClick={() => handleEdit(user._id, index)}
                    >
                      Zatwierdz
                    </Button>
                  ) : (
                    <Button
                      variant="warning"
                      onClick={() => handleEdit(user._id, index)}
                    >
                      Edytuj
                    </Button>
                  )}
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
