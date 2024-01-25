import config from "../config";
import AuthService from "../services/AuthService";

class SubjectsApi {
  static async addSubject(subjectData) {
    const token = AuthService.getToken();
    const res = await fetch(`${config.API_ADDRES}/subjects/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...subjectData }),
    });

    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.log(err);
    }

    if (!res.ok) {
      return { success: false, message: data.message };
    }

    return { success: true };
  }

  static async getSubjects(teacherId = null, Assigned = null) {
    const token = AuthService.getToken();
    let queryString = "";
    if (teacherId) {
      queryString = `?teacherId=${teacherId}`;

      if (Assigned) {
        queryString += `&Assigned=${Assigned ? 1 : 0}`;
      }
    }

    const res = await fetch(`${config.API_ADDRES}/subjects${queryString}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
    const token = AuthService.getToken();
    const res = await fetch(
      `${config.API_ADDRES}/subjects/subject/${subjectId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
    const token = AuthService.getToken();
    const res = await fetch(
      `${config.API_ADDRES}/subjects/subject/${subjectId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ teacherId }),
      }
    );
    if (!res.ok) {
      return { success: false };
    }

    return { success: true };
  }

  static async deleteSubject(subjectId) {
    const token = AuthService.getToken();
    const res = await fetch(`${config.API_ADDRES}/subjects/one/${subjectId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      return { success: false };
    }

    return { success: true };
  }
}

export default SubjectsApi;
