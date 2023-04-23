import BaseCRUD from "@/shared/services/baseCRUD.service";

import httpClient from "@/shared/services/http-common";
import { IUserResponseDTO } from "../models/userResponseDTO";

class UserService extends BaseCRUD {
  constructor() {
    super("/users");
  }

  async getById(id: any) {
    const data: any = await this.get(id);
  }

  async getMy(): Promise<IUserResponseDTO> {
    const data: any = await this.get();
    return data;
  }

  async sendInvitation(data: any) {
    await httpClient.post(`${this.urlBase}/invitations`, data);
  }
}

export default new UserService();
