import http from "./http-common";

export default class BaseCRUD {
  urlBase: string = "/";

  constructor(baseURL: string) {
    this.urlBase = baseURL;
  }

  async get(id?: any) {
    const url = id ? `${this.urlBase}/${id}` : `${this.urlBase}`;
    return await http.get(url);
  }

  async post(data: any, id?: any) {
    const url = id ? `${this.urlBase}/${id}` : `${this.urlBase}`;
    return await http.post(url, data);
  }

  async update(id?: any, data?: any) {
    const url = id ? `${this.urlBase}/${id}` : `${this.urlBase}`;
    return await http.patch(url, data);
  }

  async delete(id?: any) {
    const url = id ? `${this.urlBase}/${id}` : `${this.urlBase}`;

    return await http.delete(url);
  }
}
