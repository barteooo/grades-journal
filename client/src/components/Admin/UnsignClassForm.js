import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

const UnsignClassForm = ({ classes, onClickDelete }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>klasa</th>
          <th>usuń klasę </th>
        </tr>
      </thead>
      <tbody>
        {classes?.map((clas, index) => {
          return (
            <tr key={index}>
              <td>{clas.name}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => onClickDelete?.(clas._id)}
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

export default UnsignClassForm;
