import BaseCRUD from "@/shared/services/baseCRUD.service";
import INewNodeDTO from "../models/nodeDTO";
import httpClient from "@/shared/services/http-common";

class NodeService extends BaseCRUD {
  constructor() {
    super("/content-node");
  }

  async createNew(newNode: INewNodeDTO): Promise<void> {
    return await httpClient.post(`${this.urlBase}`, newNode);
  }

  async getAll(): Promise<any> {
    return await httpClient.get(`${this.urlBase}`);
  }

  async getRoot(): Promise<any> {
    return await httpClient.get(`${this.urlBase}/root`);
  }

  async getChilds(id: string): Promise<any> {
    return await httpClient.get(`${this.urlBase}/${id}/childs`);
  }

  async update(id: string, updateNode: any): Promise<any> {
    return await httpClient.patch(`${this.urlBase}/${id}`, updateNode);
  }

  async delete(id: string): Promise<any> {
    return await httpClient.delete(`${this.urlBase}/${id}`);
  }
}

export default new NodeService();
