interface DepartmentDTO {
  id: string;
  name: string;
}

interface MetricDTO {
  id: string;
  name: string;
}

interface DepartmentRolDTO {
  id: string;
  rol: string;
  department: DepartmentDTO;
}

interface MetricRolDTO {
  id: string;
  rol: string;
  metric: MetricDTO;
}

export interface UserDTO {
  id?: string;
  email: any;
  status: string;
  name: string;
  departmentsRoles: DepartmentRolDTO[];
  metricsRoles: MetricRolDTO[];
}
