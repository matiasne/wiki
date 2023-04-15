import { convertISOStringToMonthDay } from "../../../common/util/date";
import { User } from "../../users/models/user";
import { FieldDTO, MetricDTO } from "./metric-dto";

enum MetricFieldType {
  STRING = "string",
  NUMBER = "number",
  SELECTABLE = "selectable",
}

export enum ValueColors {
  green = "#00bc9b",
  yellow = "#dbdd55",
  red = "#dd556e",
}

export interface IRegister {
  id?: string;
  value: any;
  createdAt: string;
}

export interface IOptions {
  id?: string;
  value: any;
  label: string;
}

export interface IMetricField {
  id?: number;
  description: string;
  actualRegister: IRegister;
  options?: IOptions[];
  label: string;
}

export class MetricField implements IMetricField {
  id?: number;
  description: string = "";
  actualRegister: IRegister;
  options?: IOptions[] = [];

  constructor(public label: string, public type: MetricFieldType) {
    this.actualRegister = {
      value: "",
      createdAt: "",
    };
  }
}

export interface IMetric {
  id?: string;
  name: string;
  description: string;
  owner: User;
  categories: Array<string>;
  updateDateTime: string;
  departmentId?: string;

  getWeightedScore(): number;
}

export class Metric implements IMetric {
  id?: string;
  name: string = "";
  description: string = "";
  categories: string[] = [];
  departmentId?: string = "";
  public owner: User = new User();
  public currentValue = 99;
  updateDateTime: string = "";

  public getWeightedScore(): number {
    return 9999999999;
  }
}

export class MetricA extends Metric {
  public id?: string;
  public name: string = "";
  public description: string = "";
  public categories: string[] = [];
  public currentValue = 0;
  public beforeValue = 0;
  public goodThreshold = 0;
  public badThreshold = 0;
  public penalty = 0;
  public weighting = 0;
  public showColor: boolean = false;

  static transformFromDTO(departmentId = "", data: MetricDTO): MetricA {
    let metricA: MetricA = new MetricA();
    metricA.id = data.id;
    metricA.name = data.name;
    metricA.departmentId = departmentId;
    if (data.owner) metricA.owner.email = data.owner.email;

    data.fields.forEach((field: FieldDTO) => {
      if (field.registers && field.registers[0]) {
        field.registers = this.orderByDate(field.registers);

        let value: any = field.registers[field.registers.length - 1].value;
        value = Number(field.registers[field.registers.length - 1].value);

        (metricA as any)[field.name] = value;

        metricA.updateDateTime = convertISOStringToMonthDay(
          field.updateDateTime
        );
      }
    });
    return metricA;
  }

  static orderByDate(registers: any) {
    return registers.sort((a: any, b: any) =>
      a.createDateTime > b.createDateTime
        ? 1
        : b.createDateTime > a.createDateTime
        ? -1
        : 0
    );
  }

  public getValueGrow(): number {
    return this.currentValue - this.beforeValue;
  }

  public goodAtLowerThreshold(): boolean {
    return this.goodThreshold < this.badThreshold;
  }

  public getWeightedScore(): number {
    return (
      (Number(this.OverThresholdPercent()) + Number(this.penalty)) *
      (this.weighting / 100)
    );
  }

  public OverBadThresholdValue(): number {
    //ok
    if (this.goodAtLowerThreshold())
      return this.currentValue - this.badThreshold;
    else return this.badThreshold - this.currentValue;
  }

  public OverThresholdPercent(): number {
    if (this.badThreshold == 0) return 0;
    return this.OverBadThresholdValue() / this.badThreshold;
  }

  getValueColor(): string {
    if (this.goodAtLowerThreshold()) {
      if (this.currentValue > this.badThreshold) {
        return ValueColors.red;
      }

      if (this.currentValue < this.goodThreshold) {
        return ValueColors.green;
      }
    } else {
      if (this.currentValue > this.goodThreshold) {
        return ValueColors.green;
      }

      if (this.currentValue < this.badThreshold) {
        return ValueColors.red;
      }
    }

    return ValueColors.yellow;
  }
}
