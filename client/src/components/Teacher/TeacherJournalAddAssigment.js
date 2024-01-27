import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";

const TeacherJournalAddAssigmet = ({
  selectedClass,
  selectedSubject,
  assigmentHandleAdd,
}) => {
  const [assigmentName, setAssigmentName] = useState("");

  return (
    <>
      {selectedClass && selectedSubject ? (
        <div>
          <input
            placeholder="nazwa zadania"
            value={assigmentName}
            onChange={(e) => setAssigmentName(e.target.value)}
            style={{ marginRight: "5px" }}
          />
          <Button
            variant="success"
            onClick={() =>
              assigmentHandleAdd(assigmentName, selectedSubject, selectedClass)
            }
          >
            dodaj
          </Button>
        </div>
      ) : null}
    </>
  );
};

export default TeacherJournalAddAssigmet;
