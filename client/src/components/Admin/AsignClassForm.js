import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

const AsignClassForm = ({ classes, onClickAdd }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>klasa</th>
          <th>Dodaj klasę </th>
        </tr>
      </thead>
      <tbody>
        {classes?.map((clas, index) => {
          return (
            <tr key={index}>
              <td>{clas.name}</td>
              <td>
                <Button
                  variant="success"
                  onClick={() => onClickAdd?.(clas._id)}
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

export default AsignClassForm;
