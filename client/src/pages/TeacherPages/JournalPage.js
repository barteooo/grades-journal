import React, { useState, useEffect, useContext } from "react";
import AppContext from "../../Context/AppContext";
import ClassesApi from "../../api/ClassesApi";
import SubjectsApi from "../../api/SubjectsApi";
import UsersApi from "../../api/UsersApi";
import Table from "react-bootstrap/Table";
import AssigmentsApi from "../../api/AssigmentsApi";

const JournalPage = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [assigments, setAssigments] = useState();
  const [assigmentName, setAssigmentName] = useState("");

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [contextState] = useContext(AppContext);

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
    } else {
      initAssigments();
    }
  }, [selectedClass, selectedSubject]);

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
  return (
    <div>
      <div>
        <label htmlFor="class-select">Wybierz klasę:</label>
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
        <label htmlFor="subject-select">Wybierz przedmiot:</label>
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
          />
          <button
            onClick={() =>
              assigmentHandleAdd(assigmentName, selectedSubject, selectedClass)
            }
          >
            dodaj
          </button>
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
                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => assigmentHandleDelete(assigment._id)}
                  >
                    usun
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {students?.map((student, idx) => {
            return (
              <tr key={idx}>
                <td>
                  {student.name} {student.surname}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default JournalPage;
