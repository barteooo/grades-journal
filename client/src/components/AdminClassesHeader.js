import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

const AdminClassesHeader = ({ clas, studentsCount, onClickDelete }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>nazwa</th>
          <th>liczba uczniow</th>
          <th>Usuń z systemu</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{clas?.name}</td>
          <td>{studentsCount}</td>
          <td>
            <Button variant="danger" onClick={() => onClickDelete?.(clas._id)}>
              Usuń
            </Button>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default AdminClassesHeader;
