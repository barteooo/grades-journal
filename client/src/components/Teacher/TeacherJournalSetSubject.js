const TeacherJournalSetSubject = ({
  selectedSubject,
  handleSubjectChange,
  subjects,
}) => {
  return (
    <div style={{ marginLeft: "10px" }}>
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
  );
};

export default TeacherJournalSetSubject;
