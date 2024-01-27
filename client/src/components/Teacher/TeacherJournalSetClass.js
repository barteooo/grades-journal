const TeacherJournalSetClass = ({
  selectedClass,
  handleClassChange,
  classes,
}) => {
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
    </div>
  );
};

export default TeacherJournalSetClass;
