import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

const AddToClassForm = ({ students, onCLickAdd }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Uczeń</th>
          <th>Pesel</th>
          <th>Usuń z klasy</th>
        </tr>
      </thead>
      <tbody>
        {students?.map((student, index) => {
          return (
            <tr key={index}>
              <td>{student.name}</td>
              <td>{student.pesel}</td>
              <td>
                <Button
                  variant="success"
                  onClick={() => onCLickAdd?.(student._id)}
                >
                  Dodaj
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default AddToClassForm;
