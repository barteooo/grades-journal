import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import AssigmentsApi from "../../api/AssigmentsApi";
import TeacherJournalAddAssigmet from "./TeacherJournalAddAssigment";
import Form from "react-bootstrap/Form";
import GradesApi from "../../api/GradesApi";
import TeacherJournalAddAssigment from "./TeacherJournalAddAssigment";

const TeacherJournalGradesForm = ({
  selectedClass,
  selectedSubject,
  students,
}) => {
  const [assigments, setAssigments] = useState([]);
  const [assigmentName, setAssigmentName] = useState("");
  const [grades, setGrades] = useState([]);
  const [editGrade, setEditGrade] = useState({
    assigmentId: null,
    studentId: null,
    value: "",
  });

  useEffect(() => {
    if (!selectedClass || !selectedSubject) {
      return;
    }
    initAssigments();
  }, [selectedClass, selectedSubject]);

  useEffect(() => {
    initGrades();
  }, []);

  const initGrades = async () => {
    const result = await GradesApi.getGrades();
    if (!result.success) {
      alert("nie udało się pobrać ocen");
      return;
    }
    setGrades([...result.grades]);
  };

  const initAssigments = async (classId, subjectId) => {
    const assigmentsResult = await AssigmentsApi.getAssigments(
      selectedClass,
      selectedSubject
    );
    if (!assigmentsResult.success) {
      alert("nie udało się pobrać zadań");
      return;
    }
    setAssigments([...assigmentsResult.assigments]);
  };

  const assigmentHandleAdd = async (name, subjectId, classId) => {
    const result = await AssigmentsApi.addAssigment(name, subjectId, classId);
    if (!result.success) {
      alert("nie udało się usunąć przedmiotu");
      return;
    }
    setAssigmentName("");
    initAssigments();
  };

  const assigmentHandleDelete = async (id) => {
    const result = await AssigmentsApi.deleteAssigment(id);
    if (!result.success) {
      alert("nie udało się usunąć przedmiotu");
      return;
    }
    const newAssigments = assigments.filter(
      (assigment) => assigment._id !== id
    );
    setAssigments([...newAssigments]);
  };

  const handleClickEditGrade = (studentId, assigmentId) => {
    const grade = grades.find(
      (x) => x.studentId === studentId && x.assigmentId === assigmentId
    );

    setEditGrade({
      ...editGrade,
      studentId: studentId,
      assigmentId: assigmentId,
      value: grade?.value ?? "",
    });
  };

  const handleClickSaveEditGrade = async () => {
    const result = await GradesApi.updateGrade(editGrade);
    if (!result.success) {
      alert("Błąd aktualizacji oceny");
      return;
    }

    initGrades();

    setEditGrade({
      assigmentId: null,
      studentId: null,
      value: "",
    });
  };

  const handleClickDiscardEditGrad = () => {
    setEditGrade({
      assigmentId: null,
      studentId: null,
      value: "",
    });
  };

  const getGrade = (studentId, assigmentId) => {
    const grade = grades.find(
      (x) => x.studentId === studentId && x.assigmentId === assigmentId
    );
    return grade?.value;
  };

  return (
    <div>
      <TeacherJournalAddAssigment
        selectedClass={selectedClass}
        selectedSubject={selectedSubject}
        assigmentHandleAdd={assigmentHandleAdd}
      />

      {selectedClass && selectedSubject ? (
        <Table>
          <thead>
            <tr>
              <th>uczeń</th>
              {assigments?.map((assigment, idx) => {
                return (
                  <th key={idx}>
                    {assigment.name}
                    <Button
                      variant="danger"
                      style={{ marginLeft: "10px" }}
                      onClick={() => assigmentHandleDelete(assigment._id)}
                    >
                      usun
                    </Button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {students?.map((student, studentIndex) => {
              return (
                <tr key={studentIndex}>
                  <td>
                    {student.name} {student.surname}
                  </td>
                  {assigments?.map((assigment, assigmentIndex) => {
                    return (
                      <td key={assigmentIndex}>
                        {editGrade.studentId === student._id &&
                        editGrade.assigmentId === assigment._id ? (
                          <>
                            <Form.Control
                              style={{ width: 50 }}
                              value={editGrade.value}
                              onChange={(e) => {
                                setEditGrade({
                                  ...editGrade,
                                  value: e.target.value,
                                });
                              }}
                            />
                            <Button
                              variant="success"
                              onClick={handleClickSaveEditGrade}
                            >
                              S
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={handleClickDiscardEditGrad}
                            >
                              O
                            </Button>
                          </>
                        ) : (
                          <>
                            <span
                              style={{ fontSize: "21px", marginRight: "5px" }}
                            >
                              {getGrade(student._id, assigment._id)}
                            </span>
                            <Button
                              onClick={() =>
                                handleClickEditGrade(student._id, assigment._id)
                              }
                            >
                              E
                            </Button>
                          </>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : null}
    </div>
  );
};

export default TeacherJournalGradesForm;
