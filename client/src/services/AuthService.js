import CookieService from "./CookieService";

class AuthService {
  static setToken(token) {
    CookieService.setCookie("token", token, 7);
  }

  static getToken() {
    return CookieService.getCookie("token");
  }

  static remove() {
    CookieService.removeCookie("token");
    CookieService.removeCookie("userId");
  }

  static setUserId(id) {
    CookieService.setCookie("userId", id, 7);
  }

  static getUserId() {
    return CookieService.getCookie("userId");
  }
}

export default AuthService;
