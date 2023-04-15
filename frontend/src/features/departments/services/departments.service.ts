import BaseCRUD from "../../../common/baseCRUD";
import http from "../../../common/http-common";
import { Department } from "../models/department";
import { DepartmentDTO } from "../models/department-dto";

class DepartmentService extends BaseCRUD {
  constructor() {
    super("/departments");
  }

  async getById(id?: any) {
    const resp = await http.get(`${this.urlBase}/${id}`);
    let dept: DepartmentDTO = resp.data;
    return Department.transformFromDTO(dept);
  }

  async createNew(name: string, parentId: string = "0") {
    const data = {
      name: name,
      parentId: parentId,
    };

    const resp = await http.post(`${this.urlBase}`, data);
    let dept: DepartmentDTO = resp.data;
    return Department.transformFromDTO(dept);
  }

  async update(department: Department) {
    const resp = await http.patch(
      `${this.urlBase}/${department.id}`,
      department
    );
    return resp;
  }

  async getAll() {
    const resp = await http.get(`${this.urlBase}`);
    return resp.data;
  }
}

export default new DepartmentService();
