import BaseCRUD from "@/shared/services/baseCRUD.service";
import httpClient from "@/shared/services/http-common";
import { INewChatterboxDTO } from "../models/new-chatterbox.dto";

export interface ISendMessageDTO {
  message: string;
  nodeId: string;
  chatterboxId: string;
}

export interface IConversationDTO {
  nodeId: string;
  page: number;
}

class ChatterboxService extends BaseCRUD {
  constructor() {
    super("/chatterbox");
  }

  async sendMessage(
    chatterboxId: string = "",
    nodeId: string = "",
    message: any
  ): Promise<any> {
    const data: ISendMessageDTO = {
      message: message,
      nodeId: nodeId,
      chatterboxId: chatterboxId,
    };

    return await httpClient.post(this.urlBase + "/message", data);
  }

  async getConversation(nodeId: string, page: number): Promise<any> {
    const data: IConversationDTO = {
      nodeId: nodeId,
      page: page,
    };

    return await httpClient.post(`${this.urlBase}/conversation`, data);
  }

  async processData(id: string): Promise<any> {
    return await httpClient.get(`${this.urlBase}/process/${id}`);
  }
}

export default new ChatterboxService();
