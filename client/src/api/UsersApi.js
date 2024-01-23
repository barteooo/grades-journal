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

  static async getStudents() {
    const res = await fetch(`${config.API_ADDRES}/users/students`);
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
}

export default UsersApi;
