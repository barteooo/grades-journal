import config from "../config";
import AuthService from "../services/AuthService";

class GradesApi {
  static async getGrades() {
    const token = AuthService.getToken();

    const res = await fetch(`${config.API_ADDRES}/grades/`, {
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
      grades: resData.grades,
    };
  }

  static async updateGrade(gradeData) {
    const token = AuthService.getToken();

    const res = await fetch(`${config.API_ADDRES}/grades/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...gradeData }),
    });

    if (!res.ok) {
      return {
        success: false,
      };
    }

    return {
      success: true,
    };
  }
}

export default GradesApi;