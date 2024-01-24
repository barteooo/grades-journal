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
}

export default ClassesApi;
