import BaseCRUD from "../../../common/baseCRUD";
import http from "../../../common/http-common";

class NotificationService extends BaseCRUD {
  constructor() {
    super("/notifications");
  }

  async getMy() {
    const resp: any = await http.get(`${this.urlBase}/my`);
    return resp.data;
  }
}

export default new NotificationService();
