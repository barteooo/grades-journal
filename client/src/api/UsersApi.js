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
}

export default UsersApi;
