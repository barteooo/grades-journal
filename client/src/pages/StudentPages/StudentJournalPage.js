import { useContext, useEffect, useState } from "react";
import SubjectsApi from "../../api/SubjectsApi";
import AppContext from "../../Context/AppContext";
import Table from "react-bootstrap/Table";
import GradesApi from "../../api/GradesApi";
import { Tooltip, OverlayTrigger } from "react-bootstrap";

const StudentJournalPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [contextState, setContextState] = useContext(AppContext);

  useEffect(() => {
    const initSubjects = async () => {
      const subjectResult = await SubjectsApi.getSubjects();
      if (!subjectResult.success) {
        alert("błąd pobierania przedmiotów");
      } else {
        setSubjects([...subjectResult.subjects]);
      }
    };

    const initGrades = async () => {
      const initGradesResult = await GradesApi.getGrades(contextState.user._id);
      if (!initGradesResult.success) {
        alert("błąd pobierania ocen");
      } else {
        setGrades([...initGradesResult.grades]);
      }
    };

    initSubjects();
    initGrades();
  }, [contextState.user._id]);

  const getGrades = (subjectId) => {
    return grades.filter(
      (grade) =>
        grade.studentId === contextState.user._id &&
        grade.subjectId === subjectId
    );
  };

  const renderTooltip = (props, assName) => (
    <Tooltip id="button-tooltip" {...props}>
      {assName}
    </Tooltip>
  );

  return (
    <Table>
      <thead>
        <tr>
          <th>Przedmiot</th>
          <th>Oceny</th>
        </tr>
      </thead>
      <tbody>
        {subjects.map((subject, idx) => (
          <tr key={idx}>
            <td>{subject.name}</td>
            <td>
              {getGrades(subject._id).map((grade, i) => (
                <OverlayTrigger
                  key={i}
                  placement="top"
                  overlay={(props) => renderTooltip(props, grade.assName)}
                >
                  <span
                    style={{
                      margin: "0 5px",
                      cursor: "pointer",
                      color: ["1", "1+", "2-", "2+", "2"].includes(grade.value)
                        ? "red"
                        : ["5", "5-", "6", "6-", "5+"].includes(grade.value)
                        ? "green"
                        : "black",
                    }}
                  >
                    {grade.value}
                  </span>
                </OverlayTrigger>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default StudentJournalPage;
