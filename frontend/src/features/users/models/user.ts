import { UserDTO } from "./user-dto";

export enum Rol {
  OWNER = "OWNER",
  COOWNER = "COOWNER",
  VIEWER = "VIEWER",
  INHERITEDVIEWER = "INHERITEDVIEWER",
}

export interface UserInvited {
  id?: string;
  email: any;
  date: string;
}

export interface IUser {
  id?: string;
  email: any;
}

class DepartmentRol {
  constructor(public id: string, public rol: string) {}
}

class MetricRol {
  constructor(public id: string, public rol: string) {}
}

export class User implements IUser {
  id? = "";
  name = "";
  email = "";
  departmentsRoles: DepartmentRol[] = [];
  metricsRoles: MetricRol[] = [];

  static transformFromDTO(data: UserDTO): User {
    let user: User = new User();
    user.id = data.id;
    user.email = data.email;
    user.name = data.name;

    if (data.departmentsRoles && data.departmentsRoles.length > 0) {
      data.departmentsRoles.forEach((departmentRol) => {
        if (departmentRol.department) {
          user.departmentsRoles.push(
            new DepartmentRol(departmentRol.department.id, departmentRol.rol)
          );
        }
      });
    }

    if (data.metricsRoles && data.metricsRoles.length > 0) {
      data.metricsRoles.forEach((metricRol) => {
        user.metricsRoles.push(
          new MetricRol(metricRol.metric.id, metricRol.rol)
        );
      });
    }
    return user;
  }

  getFirstDepartmentOwnerId() {
    return this.departmentsRoles.find(
      (department) => department.rol === Rol.OWNER
    )?.id;
  }

  getOwnerMetricsIds(): string[] {
    return this.metricsRoles
      .filter((metric) => metric.rol === Rol.OWNER)
      .map((metric) => metric.id);
  }

  getOwnerDepartmentsIds(): string[] {
    return this.departmentsRoles
      .filter((department) => department.rol === Rol.OWNER)
      .map((department) => department.id);
  }
}
