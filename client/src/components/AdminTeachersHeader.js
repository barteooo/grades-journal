import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

const AdminTeachersHeader = ({ teacher, classes }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Nauczyciel</th>
          <th>klasy</th>
          <th>Pesel</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {teacher?.name} {teacher?.surname}
          </td>
          <td>
            {classes.length > 0
              ? classes?.map((e) => e.name)
              : "brak przypisanych klas"}
          </td>
          <td>{teacher?.pesel}</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default AdminTeachersHeader;
