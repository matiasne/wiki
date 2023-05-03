import BaseCRUD from "@/shared/services/baseCRUD.service";
import httpClient from "@/shared/services/http-common";
import { INewChatterboxDTO } from "../models/new-chatterbox.dto";

class ChatterboxService extends BaseCRUD {
  constructor() {
    super("/chatterbox");
  }

  async sendMessage(nodeId: string, message: any) {
    const data = {
      message: message,
      nodeId: nodeId,
    };

    return await httpClient.post(this.urlBase + "/message", data);
  }

  async processData(id: string): Promise<any> {
    return await httpClient.get(`${this.urlBase}/process/${id}`);
  }
}

export default new ChatterboxService();
