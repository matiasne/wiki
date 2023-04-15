export interface RegisterDTO {
  value: string;
  createDateTime: string;
}

export interface FieldDTO {
  id: string;
  name: string;
  description: string;
  type: string;
  registers: RegisterDTO[];
  updateDateTime: string;
}

export interface MetricDTO {
  id: string;
  name: string;
  description: string;
  fields: FieldDTO[];
  createDateTime: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
}
