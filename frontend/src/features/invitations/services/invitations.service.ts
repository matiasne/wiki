import BaseCRUD from "../../../common/baseCRUD";
import http from "../../../common/http-common";
import { SendInvitation } from "../models/invitation";

class InvitationsService extends BaseCRUD {
  constructor() {
    super("/invitations");
  }

  async sendInvitation(data: SendInvitation) {
    await http.post(`${this.urlBase}`, data);
  }

  async getAllByDepartment(departmentId: string) {
    const resp = await this.get(`department/${departmentId}`);
    return resp.data;
  }

  async accept(id: string) {
    const resp: any = await http.post(`${this.urlBase}/accept`, {
      id: "" + id,
    });
    return resp.data;
  }

  async decline(id: string) {
    const resp: any = await http.post(`${this.urlBase}/decline`, {
      id: "" + id,
    });
    return resp.data;
  }
}

export default new InvitationsService();
