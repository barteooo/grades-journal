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
import TeacherJournalSetClass from "../../components/Teacher/TeacherJournalSetClass";
import TeacherJournalSetSubject from "../../components/Teacher/TeacherJournalSetSubject";
import TeacherJournalGradesForm from "../../components/Teacher/TeacherJournalGradesForm";

const JournalPage = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
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

  return (
    <div style={{ marginLeft: "10px" }}>
      <TeacherJournalSetClass
        selectedClass={selectedClass}
        handleClassChange={handleClassChange}
        classes={classes}
      />

      <TeacherJournalSetSubject
        selectedSubject={selectedSubject}
        handleSubjectChange={handleSubjectChange}
        subjects={subjects}
      />

      <TeacherJournalGradesForm
        selectedClass={selectedClass}
        selectedSubject={selectedSubject}
        students={students}
      />
    </div>
  );
};

export default JournalPage;
