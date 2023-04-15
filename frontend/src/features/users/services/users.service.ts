import BaseCRUD from "../../../common/baseCRUD";
import http from "../../../common/http-common";
import { SendInvitation } from "../../invitations/models/invitation";
import { User } from "../models/user";

class UserService extends BaseCRUD {
  constructor() {
    super("/users");
  }

  async getById(id: any) {
    const data: any = await this.get(id);
  }

  async getMy(): Promise<User> {
    const data: any = await this.get();
    return User.transformFromDTO(data.data);
  }

  async sendInvitation(data: SendInvitation) {
    await http.post(`${this.urlBase}/invitations`, data);
  }
}

export default new UserService();
