import BaseCRUD from "../../common/baseCRUD";
import http from "../../common/http-common";

class AuthService extends BaseCRUD {
  constructor() {
    super("/auth");
  }

  async confirmEmailCode(username: string, code: string) {
    const data = {
      username: username,
      code: code,
    };

    return http.post(this.urlBase + "/confirm-email-code", data);
  }
}

export default new AuthService();
