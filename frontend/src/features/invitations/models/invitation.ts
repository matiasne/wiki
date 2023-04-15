import { Department } from "../../departments/models/department";
import { User } from "../../users/models/user";

export enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface SendInvitation {
  id?: string;
  rol: string;
  departmentId: string;
  userReceivingEmail: string;
}

export interface Invitation {
  id?: string;
  rol: string;
  status: InvitationStatus;
  expirationDate: string;
  department: Department;
  userReceivingEmail: string;
  userReceiving: User;
  userSender: User;
}
