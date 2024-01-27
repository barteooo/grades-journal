import config from "../config";
import AuthService from "../services/AuthService";

class AssigmentsApi {
  static async getAssigments(classId = null, subjectId = null) {
    const token = AuthService.getToken();
    let queryString = "";

    queryString = `?classId=${classId}&subjectId=${subjectId}`;

    const res = await fetch(`${config.API_ADDRES}/assigments${queryString}`, {
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
      assigments: resData.assigments,
    };
  }

  static async deleteAssigment(id) {
    const token = AuthService.getToken();
    const res = await fetch(`${config.API_ADDRES}/assigments/one/${id}`, {
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

  static async addAssigment(name, subjectId, classId) {
    const token = AuthService.getToken();
    const res = await fetch(`${config.API_ADDRES}/assigments/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, subjectId, classId }),
    });

    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.log(err);
    }
    if (!res.ok) {
      return { success: data.success };
    }

    return { success: data.success };
  }

  static async updateAssigment(id, name) {
    const token = AuthService.getToken();

    const res = await fetch(`${config.API_ADDRES}/assigments/one/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: name }),
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

export default AssigmentsApi;
