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

  async post(id?: any) {
    const url = id ? `${this.urlBase}/${id}` : `${this.urlBase}`;
    return await http.get(url);
  }

  async update(id?: any) {
    const url = id ? `${this.urlBase}/${id}` : `${this.urlBase}`;
    return await http.get(url);
  }

  async delete(id?: any) {
    const url = id ? `${this.urlBase}/${id}` : `${this.urlBase}`;

    return await http.delete(url);
  }
}
