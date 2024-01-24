import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

const AdminTeachersHeader = ({ teacher }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Nauczyciel</th>
          <th>Predmioty</th>
          <th>Usuń z systemu</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {teacher?.name} {teacher?.surname}
          </td>
          <td></td>
          <td>
            {teacher ? (
              <Button
                variant="danger"
                // onClick={() => handleDelete(classToEdit?._id)}
              >
                Usuń
              </Button>
            ) : null}
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default AdminTeachersHeader;
