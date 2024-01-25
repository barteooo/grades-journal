import config from "../config";

class SubjectsApi {
  static async getSubjects(teacherId = null, Assigned = null) {
    let queryString = "";
    if (teacherId) {
      queryString = `?teacherId=${teacherId}`;

      if (Assigned) {
        queryString += `&Assigned=${Assigned ? 1 : 0}`;
      }
    }

    const res = await fetch(`${config.API_ADDRES}/subjects${queryString}`);
    const resData = await res.json();

    if (!res.ok) {
      return {
        success: false,
      };
    }

    return {
      success: true,
      subjects: resData.subjects,
    };
  }

  static async assignSubjectToTeacher(subjectId, teacherId) {
    const res = await fetch(
      `${config.API_ADDRES}/subjects/subject/${subjectId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teacherId }),
      }
    );

    if (!res.ok) {
      return { success: false };
    }

    return { success: true };
  }

  static async deleteSubjectFromTeacher(subjectId, teacherId) {
    const res = await fetch(
      `${config.API_ADDRES}/subjects/subject/${subjectId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teacherId }),
      }
    );
    if (!res.ok) {
      return { success: false };
    }

    return { success: true };
  }
}

export default SubjectsApi;
