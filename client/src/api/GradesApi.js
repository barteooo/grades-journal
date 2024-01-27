import config from "../config";
import AuthService from "../services/AuthService";

class GradesApi {
  static async getGrades(studentId = null) {
    const token = AuthService.getToken();
    const query = `?teacherId=${studentId}`;

    const res = await fetch(`${config.API_ADDRES}/grades${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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

  static async deleteGrade(id) {
    const token = AuthService.getToken();
    const res = await fetch(`${config.API_ADDRES}/grades/${id}`, {
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
}

export default GradesApi;
