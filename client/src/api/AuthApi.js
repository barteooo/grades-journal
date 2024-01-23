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
}

export default AuthApi;
