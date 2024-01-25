import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

const UnsignSubjectForm = ({ subjects, onClickDelete }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>przedmiot</th>
          <th>usuń przedmiot</th>
        </tr>
      </thead>
      <tbody>
        {subjects?.map((subject, index) => {
          return (
            <tr key={index}>
              <td>{subject.name}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => onClickDelete?.(subject._id)}
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

export default UnsignSubjectForm;
