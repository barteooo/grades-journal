import config from "../config";

class AuthApi {
  static async sigin(userData) {
    const res = await fetch(`${config.API_ADDRES}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }),
    });

    let resData;

    try {
      resData = await res.json();
    } catch {
      resData = {};
    }

    if (!res.ok) {
      return {
        success: false,
        message: resData?.message,
      };
    }

    return {
      success: true,
      id: resData.id,
    };
  }

  static async addTeacher(teacherData) {
    const res = await fetch(`${config.API_ADDRES}/auth/teacher`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...teacherData }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, email: data.email, pesel: data.pesel };
    }

    return { success: true, email: data.email, pesel: data.pesel };
  }

  static async addStudent(studentData) {
    const res = await fetch(`${config.API_ADDRES}/auth/student`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...studentData }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, email: data.email, pesel: data.pesel };
    }

    return { success: true };
  }
}

export default AuthApi;
