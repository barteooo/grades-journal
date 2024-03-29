import config from "../config";
import AuthService from "../services/AuthService";

class ClassesApi {
  static async getClasses(teacherId = null, Assigned = null) {
    const token = AuthService.getToken();
    let queryString = "";
    if (teacherId) {
      queryString = `?teacherId=${teacherId}`;

      if (Assigned) {
        queryString += `&Assigned=${Assigned ? 1 : 0}`;
      }
    }

    const res = await fetch(`${config.API_ADDRES}/classes${queryString}`, {
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
      classes: resData.classes,
    };
  }

  static async addClass(classData) {
    const token = AuthService.getToken();
    const res = await fetch(`${config.API_ADDRES}/classes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...classData }),
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

  static async deleteClass(id) {
    const token = AuthService.getToken();
    const res = await fetch(`${config.API_ADDRES}/classes/one/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return { success: false };
    }

    return { success: true };
  }

  static async addStudentToClass(classId, studentId) {
    const token = AuthService.getToken();
    const res = await fetch(`${config.API_ADDRES}/classes/student/${classId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ studentId }),
    });

    if (!res.ok) {
      return { success: false };
    }

    return { success: true };
  }

  static async deleteStudentFromClass(classId, studentId) {
    const token = AuthService.getToken();
    const res = await fetch(`${config.API_ADDRES}/classes/student/${classId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ studentId }),
    });

    if (!res.ok) {
      return { success: false };
    }

    return { success: true };
  }

  static async deleteClassFromTeacher(classId, teacherId) {
    const token = AuthService.getToken();
    const res = await fetch(`${config.API_ADDRES}/classes/teacher/${classId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ teacherId }),
    });
    if (!res.ok) {
      return { success: false };
    }

    return { success: true };
  }

  static async assignClassToTeacher(classId, teacherId) {
    const token = AuthService.getToken();
    const res = await fetch(`${config.API_ADDRES}/classes/teacher/${classId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ teacherId }),
    });

    if (!res.ok) {
      return { success: false };
    }

    return { success: true };
  }
}

export default ClassesApi;
