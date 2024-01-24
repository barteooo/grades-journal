import config from "../config";

class ClassesApi {
  static async getClasses() {
    const res = await fetch(`${config.API_ADDRES}/classes/`);
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

  static async deleteClass(id) {
    const res = await fetch(`${config.API_ADDRES}/classes/one/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      return { success: false };
    }

    return { success: true };
  }

  static async addStudentToClass(classId, studentId) {
    const res = await fetch(`${config.API_ADDRES}/classes/student/${classId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId }),
    });

    if (!res.ok) {
      return { success: false };
    }

    return { success: true };
  }

  static async deleteStudentFromClass(classId, studentId) {
    const res = await fetch(`${config.API_ADDRES}/classes/student/${classId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId }),
    });

    if (!res.ok) {
      return { success: false };
    }

    return { success: true };
  }
}

export default ClassesApi;
