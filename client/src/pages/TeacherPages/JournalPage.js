import React, { useState, useEffect, useContext, useCallback } from "react";
import AppContext from "../../Context/AppContext";
import ClassesApi from "../../api/ClassesApi";
import SubjectsApi from "../../api/SubjectsApi";
import UsersApi from "../../api/UsersApi";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import AssigmentsApi from "../../api/AssigmentsApi";
import GradesApi from "../../api/GradesApi";

const JournalPage = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [assigments, setAssigments] = useState();
  const [assigmentName, setAssigmentName] = useState("");
  const [grades, setGrades] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [contextState] = useContext(AppContext);

  const [editGrade, setEditGrade] = useState({
    assigmentId: null,
    studentId: null,
    value: "",
  });

  useEffect(() => {
    const initClasses = async () => {
      if (!contextState.user._id) {
        return;
      }
      const classesResult = await ClassesApi.getClasses(
        contextState.user._id,
        true
      );
      if (classesResult.success) {
        setClasses(classesResult.classes);
      } else {
        alert("Nie udało się pobrać klas");
      }
    };

    const initSubjects = async () => {
      if (!contextState.user._id) {
        return;
      }
      const subjectsResult = await SubjectsApi.getSubjects(
        contextState.user._id,
        true
      );
      if (subjectsResult.success) {
        setSubjects(subjectsResult.subjects);
      } else {
        alert("Nie udało się pobrać przedmiotów");
      }
    };

    initClasses();
    initSubjects();
  }, [contextState.user._id]);

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

  const handleClassChange = async (event) => {
    const classId = event.target.value;
    setSelectedClass(classId);
    if (classId) {
      const studentsResponse = await UsersApi.getStudents(classId, true);
      if (studentsResponse.success) {
        setStudents(studentsResponse.students);
      } else {
        alert("Nie udało się pobrać studentów");
        return;
      }
    } else {
      setStudents([]);
    }
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
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

  const assigmentHandleAdd = async (name, subjectId, classId) => {
    const result = await AssigmentsApi.addAssigment(name, subjectId, classId);
    if (!result.success) {
      alert("nie udało się usunąć przedmiotu");
      return;
    }
    setAssigmentName("");
    initAssigments();
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
    <div style={{ marginLeft: "10px" }}>
      <div>
        <label htmlFor="class-select" style={{ marginRight: "5px" }}>
          Wybierz klasę:
        </label>
        <select
          id="class-select"
          value={selectedClass}
          onChange={handleClassChange}
        >
          <option value="">--Wybierz klasę--</option>
          {classes.map((classItem) => (
            <option key={classItem._id} value={classItem._id}>
              {classItem.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="subject-select" style={{ marginRight: "5px" }}>
          Wybierz przedmiot:
        </label>
        <select
          id="subject-select"
          value={selectedSubject}
          onChange={handleSubjectChange}
        >
          <option value="">--Wybierz przedmiot--</option>
          {subjects.map((subject) => (
            <option key={subject._id} value={subject._id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>
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
    </div>
  );
};

export default JournalPage;
