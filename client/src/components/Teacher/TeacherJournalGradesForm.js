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
    subjectId: selectedSubject,
  });
  const [editAssigment, setEditAssigment] = useState({
    assigmentId: null,
    name: "",
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
    const assigmentDeleteResult = await AssigmentsApi.deleteAssigment(id);
    if (!assigmentDeleteResult.success) {
      alert("nie udało się usunąć przedmiotu");
      return;
    }
    const newAssigments = assigments.filter(
      (assigment) => assigment._id !== id
    );
    deleteGrades(id);

    setAssigments([...newAssigments]);
  };

  const deleteGrades = async (id) => {
    const gradesToDelete = grades.filter((grade) => grade.assigmentId === id);
    const results = await gradesToDelete.map(
      async (grade) => await GradesApi.deleteGrade(grade._id)
    );
    const resultsNotSuccess = results.filter(
      (result) => result.success === false
    );
    if (resultsNotSuccess.length > 0) {
      alert("błąd");
      return;
    }
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

  const handleClickSaveEditGrade = async (assName) => {
    const result = await GradesApi.updateGrade({ ...editGrade, assName });
    if (!result.success) {
      alert("Błąd aktualizacji oceny");
      return;
    }

    initGrades();

    setEditGrade({
      assigmentId: null,
      studentId: null,
      subjectId: selectedSubject,
      value: "",
    });
  };

  const handleClickDiscardEditGrad = () => {
    setEditGrade({
      assigmentId: null,
      studentId: null,
      subjectId: selectedSubject,
      value: "",
    });
  };

  const handleClickDiscardEditAssigment = () => {
    setEditAssigment({
      assigmentId: null,
      name: "",
    });
  };
  const handleClickSaveEditAssigment = async () => {
    const result = await AssigmentsApi.updateAssigment(
      editAssigment.assigmentId,
      editAssigment.name
    );
    if (!result.success) {
      alert("Błąd aktualizacji oceny");
      return;
    }
    initAssigments();
    setEditAssigment({
      assigmentId: null,
      name: "",
    });
  };

  const getGrade = (studentId, assigmentId) => {
    const grade = grades.find(
      (x) => x.studentId === studentId && x.assigmentId === assigmentId
    );
    return grade?.value;
  };

  const assigmentHandleUpdate = (id) => {
    const assigment = assigments.find((x) => x._id === id);
    setEditAssigment({
      ...editAssigment,
      assigmentId: id,
      name: assigment?.name ?? "",
    });
  };

  return (
    <div style={{ overflowX: "auto" }}>
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
                    {editAssigment.assigmentId === assigment._id ? (
                      <>
                        <Form.Control
                          style={{ width: 70 }}
                          value={editAssigment.name}
                          onChange={(e) => {
                            setEditAssigment({
                              ...editAssigment,
                              name: e.target.value,
                            });
                          }}
                        />
                        <Button
                          variant="success"
                          onClick={handleClickSaveEditAssigment}
                        >
                          S
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={handleClickDiscardEditAssigment}
                        >
                          O
                        </Button>
                      </>
                    ) : (
                      <div>
                        {assigment.name}
                        <Button
                          variant="danger"
                          style={{ marginLeft: "10px" }}
                          onClick={() => assigmentHandleDelete(assigment._id)}
                        >
                          usun
                        </Button>
                        <Button
                          variant="warning"
                          style={{ marginLeft: "10px" }}
                          onClick={() => assigmentHandleUpdate(assigment._id)}
                        >
                          edytuj
                        </Button>
                      </div>
                    )}
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
                          <div>
                            <Form.Control
                              style={{ width: 50 }}
                              value={editGrade.value}
                              onChange={(e) => {
                                setEditGrade({
                                  ...editGrade,
                                  subjectId: selectedSubject,
                                  value: e.target.value,
                                });
                              }}
                            />
                            <Button
                              variant="success"
                              onClick={() =>
                                handleClickSaveEditGrade(assigment.name)
                              }
                            >
                              S
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={handleClickDiscardEditGrad}
                            >
                              O
                            </Button>
                          </div>
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
