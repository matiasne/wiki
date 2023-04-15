export enum EnumNotificationType {
  INVITATION = "INVITATION",
  MESSAGE = "MESSAGE",
  TASK = "TASK",
  OTHER = "OTHER",
}

export enum EnumNotificationStatus {
  SENT = "SENT",
  READ = "READ",
}

export interface Notification {
  id: string;
  status: EnumNotificationStatus;
  message: string;
  type: EnumNotificationType;
  typeRefUID: string;
}
