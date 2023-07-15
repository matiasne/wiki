import BaseCRUD from "@/shared/services/baseCRUD.service";
import httpClient from "@/shared/services/http-common";
import { INewChatterboxDTO } from "../models/new-chatterbox.dto";

export interface ISendMessageDTO {
  message: string;
  chatterboxId: string;
  history: string[];
  conversationId: string;
}

class ChatterboxService extends BaseCRUD {
  constructor() {
    super("/chatterbox");
  }

  async sendMessage(
    chatterboxId: string,
    message: any,
    history: string[],
    conversationId: string
  ): Promise<any> {
    const data: ISendMessageDTO = {
      message: message,
      chatterboxId: chatterboxId,
      history: history,
      conversationId: conversationId,
    };

    return await httpClient.post(this.urlBase + "/message", data);
  }

  async processData(id: string): Promise<any> {
    return await httpClient.get(`${this.urlBase}/process/${id}`);
  }
}

export default new ChatterboxService();
