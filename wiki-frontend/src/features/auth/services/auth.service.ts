import BaseCRUD from "@/shared/services/baseCRUD.service";
import httpClient from "@/shared/services/http-common";

class AuthService extends BaseCRUD {
  constructor() {
    super("/auth");
  }

  async confirmEmailCode(username: string, code: string) {
    const data = {
      username: username,
      code: code,
    };

    return httpClient.post(this.urlBase + "/confirm-email-code", data);
  }
}

export default new AuthService();
