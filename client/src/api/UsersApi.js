import config from "../config";

class UsersApi {
  static async getUser(id) {
    const res = await fetch(`${config.API_ADDRES}/users/one/${id}`);
    const resData = await res.json();

    if (!res.ok) {
      return {
        success: false,
      };
    }

    return {
      success: true,
      user: resData.user,
    };
  }

  static async addStudent(studentData) {
    const res = await fetch(`${config.API_ADDRES}/users/student`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...studentData }),
    });

    if (!res.ok) {
      return { success: false };
    }

    return { success: true };
  }

  static async addTeacher(teacherData) {
    const res = await fetch(`${config.API_ADDRES}/users/teacher`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...teacherData }),
    });

    if (!res.ok) {
      return { success: false };
    }

    return { success: true };
  }
}

export default UsersApi;
