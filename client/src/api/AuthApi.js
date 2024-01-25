import config from "../config";
import AuthService from "../services/AuthService";

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
      token: resData.token,
    };
  }

  static async addTeacher(teacherData) {
    const token = AuthService.getToken();
    const res = await fetch(`${config.API_ADDRES}/auth/teacher`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...teacherData }),
    });

    let data;
    try {
      data = await res.json();
    } catch {}

    if (!res.ok) {
      return { success: false, email: data?.email, pesel: data?.pesel };
    }

    return { success: true };
  }

  static async addStudent(studentData) {
    const token = AuthService.getToken();
    const res = await fetch(`${config.API_ADDRES}/auth/student`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...studentData }),
    });

    let data;
    try {
      data = await res.json();
    } catch {}

    if (!res.ok) {
      return { success: false, email: data?.email, pesel: data?.pesel };
    }

    return { success: true };
  }
}

export default AuthApi;
