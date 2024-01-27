import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

const AdminSubjectsHeader = ({ teacher, subjects }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Nauczyciel</th>
          <th>Przedmioty</th>
          <th>Pesel</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {teacher?.name} {teacher?.surname}
          </td>
          <td>
            {subjects.length > 0
              ? subjects?.map((e) => e?.name + " ")
              : "brak przypisanych klas"}
          </td>
          <td>{teacher?.pesel}</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default AdminSubjectsHeader;
