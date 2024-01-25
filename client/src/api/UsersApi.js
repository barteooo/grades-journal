import config from "../config";
import AuthService from "../services/AuthService";

class UsersApi {
  static async getUser(id) {
    const token = AuthService.getToken();
    console.log(token);
    const res = await fetch(`${config.API_ADDRES}/users/one/${id}`, {
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
      user: resData.user,
    };
  }

  static async getStudents(classId = null, inclass = null) {
    let queryString = "";
    if (classId) {
      queryString = `?classId=${classId}`;

      if (inclass != null) {
        queryString += `&inclass=${inclass ? 1 : 0}`;
      }
    }
    const token = AuthService.getToken();

    const res = await fetch(
      `${config.API_ADDRES}/users/students${queryString}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const resData = await res.json();
    if (!res.ok) {
      return {
        success: false,
      };
    }

    return {
      success: true,
      students: resData.students,
    };
  }

  static async getTeachers() {
    const token = AuthService.getToken();
    const res = await fetch(`${config.API_ADDRES}/users/teachers`, {
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
      teachers: resData.teachers,
    };
  }

  static async deleteUser(id) {
    const token = AuthService.getToken();
    const res = await fetch(`${config.API_ADDRES}/users/${id}`, {
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

  static async getStudentsByName(name) {
    const token = AuthService.getToken();
    const res = await fetch(`${config.API_ADDRES}/users/students/${name}`, {
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
      students: resData.students,
    };
  }

  static async getTeachersByName(name) {
    const token = AuthService.getToken();
    const res = await fetch(`${config.API_ADDRES}/users/teachers/${name}`, {
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
      teachers: resData.teachers,
    };
  }

  static async changeUserData(id, data) {
    const token = AuthService.getToken();
    const res = await fetch(`${config.API_ADDRES}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data }),
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

export default UsersApi;
