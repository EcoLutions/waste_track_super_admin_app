export interface DeviceEntity {
  id: string;
  deviceIdentifier: string;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}
