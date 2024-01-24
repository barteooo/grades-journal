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

  static async getStudents(classId = null, inclass = null) {
    let queryString = "";
    if (classId) {
      queryString = `?classId=${classId}`;

      if (inclass != null) {
        queryString += `&inclass=${inclass ? 1 : 0}`;
      }
    }

    const res = await fetch(
      `${config.API_ADDRES}/users/students${queryString}`
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
    const res = await fetch(`${config.API_ADDRES}/users/teachers`);
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
    const res = await fetch(`${config.API_ADDRES}/users/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      return { success: false };
    }

    return { success: true };
  }

  static async getStudentsByName(name) {
    const res = await fetch(`${config.API_ADDRES}/users/students/${name}`);
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
    const res = await fetch(`${config.API_ADDRES}/users/teachers/${name}`);
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
    const res = await fetch(`${config.API_ADDRES}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
