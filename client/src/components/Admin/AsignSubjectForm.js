import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

const AsignSubjectForm = ({ subjects, onClickAdd }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>klasa</th>
          <th>Dodaj przedmiot </th>
        </tr>
      </thead>
      <tbody>
        {subjects?.map((subject, index) => {
          return (
            <tr key={index}>
              <td>{subject.name}</td>
              <td>
                <Button
                  variant="success"
                  onClick={() => onClickAdd?.(subject._id)}
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

export default AsignSubjectForm;
