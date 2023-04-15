import { Metric, MetricA } from "../../metrics/models/metric";
import { MetricDTO } from "../../metrics/models/metric-dto";
import { Rol } from "../../users/models/user";
import { DepartmentDTO } from "./department-dto";

export enum ValueColors {
  green = "#00bc9b",
  yellow = "#dbdd55",
  red = "#dd556e",
}

export interface IUserRol {
  id: string;
  rol: string;
  email: string;
  name: string;
}

export interface IDepartment {
  id?: string;
  name: string;
  parentDepartmentId?: string;
  goodThreshold: number;
  badThreshold: number;
  children?: Array<IDepartment>;
  metrics: Array<Metric>;
  usersRoles: Array<any>;
}

export class Department implements IDepartment {
  public id?: string;
  public name: string = "Department Proptotype";
  public parentId?: string | undefined;
  public goodThreshold: number = 90;
  public badThreshold: number = 70;
  public children?: IDepartment[] | undefined;
  public metrics: MetricA[] = [];
  public usersRoles: any[] = [];

  constructor() {}

  static transformFromDTO(data: DepartmentDTO): Department {
    let department: Department = new Department();
    department.id = data.id;
    department.name = data.name;

    if (data.parent) department.parentId = data.parent.id;

    if (data.usersRoles && data.usersRoles.length > 0) {
      data.usersRoles.forEach((userRol) => {
        department.usersRoles.push({
          id: userRol.id,
          rol: userRol.rol,
          email: userRol.user.email,
          name: userRol.user.name,
          userId: userRol.user.id,
        });
      });
    }

    if (data.metrics && data.metrics.length > 0) {
      data.metrics.forEach((metric: MetricDTO) => {
        const owner = data.usersRoles?.find(
          (userRol) => userRol.rol === "OWNER"
        )?.user;

        let metricA = MetricA.transformFromDTO(department.id, metric);

        if (owner) {
          metricA.owner.email = owner.email;
        }

        department.metrics.push(metricA);
      });
    }
    return department;
  }

  public getHelathScore(): number {
    let totalScore: number = 0;
    let startWightScore = 100;
    if (this.metrics.length > 1) startWightScore = 100 / this.metrics.length;

    console.log("======================");
    console.log("Department Name: ", this.name);
    console.log("Department Good Threshold: ", this.goodThreshold);
    console.log("Department Bad Threshold: ", this.badThreshold);

    this.metrics.forEach((metric: MetricA) => {
      console.log("Metric Name: ", metric.name);
      console.log("Metric Current Value: ", metric.currentValue);
      console.log("Metric Weighting: ", metric.weighting);
      console.log("Metric Penalty: ", metric.penalty);
      console.log("Metric Weighted Score: ", metric.getWeightedScore());
      console.log("----------------------");
      totalScore += metric.getWeightedScore() * startWightScore;
    });
    return Number(100) - Number(totalScore.toFixed(0));
  }

  public goodAtLowerThreshold(): boolean {
    return this.goodThreshold < this.badThreshold;
  }

  getScoreColor(): string {
    const healthScore = this.getHelathScore();
    if (this.goodAtLowerThreshold()) {
      if (healthScore > this.badThreshold) {
        return ValueColors.red;
      }

      if (healthScore < this.goodThreshold) {
        return ValueColors.green;
      }
    } else {
      if (healthScore > this.goodThreshold) {
        return ValueColors.green;
      }

      if (healthScore < this.badThreshold) {
        return ValueColors.red;
      }
    }

    return ValueColors.yellow;
  }

  getUserRoles(id: string): string[] {
    const userRol = this.usersRoles.filter((userRol) => {
      if (!userRol.userId) return false;
      return userRol.userId === id;
    });
    return userRol.map((userRol) => userRol.rol);
  }

  userCanEdit(user: any): boolean {
    return this.getUserRoles(user.id).includes(Rol.OWNER || Rol.COOWNER);
  }
}
