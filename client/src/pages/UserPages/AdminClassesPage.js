import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import UsersApi from "../../api/UsersApi";
import ClassesApi from "../../api/ClassesApi";

const AdminClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [classToEdit, setClassToEdit] = useState("");
  useEffect(() => {
    const initClasses = async () => {
      const result = await ClassesApi.getClasses();
      if (!result.success) {
        alert("nie udało się pobrać klas");
        return;
      }
      setClasses([...result.classes]);
      setClassToEdit(result.classes[0]);
    };
    initClasses();
  }, []);

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
  console.log(classes);

  return (
    <div>
      <Form.Select className="mb-2" onChange={(e) => handleChange(e)}>
        {classes?.map((clas, index) => {
          return (
            <option key={index} value={clas.name}>
              {clas.name}
            </option>
          );
        })}
      </Form.Select>
      <div></div>

      <Table>
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>liczba uczniow </th>
            <th>Usuń z systemu</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{classToEdit?.name}</td>
            <td>{classToEdit?.students?.length}</td>
            <td>
              {classToEdit?.name ? (
                <Button
                  variant="danger"
                  onClick={() => handleDelete(classToEdit?._id)}
                >
                  Usuń
                </Button>
              ) : null}
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default AdminClassesPage;
