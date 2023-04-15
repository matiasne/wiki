import { MetricDTO } from "../../metrics/models/metric-dto";

interface UserDTO {
  id: string;
  name: string;
  email: string;
}

interface usersRolDTO {
  id: string;
  rol: string;
  user: UserDTO;
}

export interface DepartmentDTO {
  id: string;
  name: string;
  parent: DepartmentDTO;
  children?: DepartmentDTO[];
  metrics?: MetricDTO[];
  usersRoles?: usersRolDTO[];
}
