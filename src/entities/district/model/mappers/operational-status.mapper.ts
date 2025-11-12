import { OperationalStatusEnum } from '@entities/district/model';

export class OperationalStatusMapper {
  static toLabel(status: OperationalStatusEnum): string {
    const labels: Record<OperationalStatusEnum, string> = {
      [OperationalStatusEnum.ACTIVE]: 'Activo',
      [OperationalStatusEnum.SUSPENDED]: 'Suspendido',
      [OperationalStatusEnum.TRIAL]: 'Prueba',
    };
    return labels[status] || status;
  }

  static toSeverity(status: OperationalStatusEnum): 'success' | 'warn' | 'danger' {
    const severities: Record<OperationalStatusEnum, 'success' | 'warn' | 'danger'> = {
      [OperationalStatusEnum.ACTIVE]: 'success',
      [OperationalStatusEnum.SUSPENDED]: 'danger',
      [OperationalStatusEnum.TRIAL]: 'warn',
    };
    return severities[status] || 'warn';
  }

  static toColor(status: OperationalStatusEnum): string {
    const colors: Record<OperationalStatusEnum, string> = {
      [OperationalStatusEnum.ACTIVE]: 'bg-green-100 text-green-700',
      [OperationalStatusEnum.SUSPENDED]: 'bg-red-100 text-red-700',
      [OperationalStatusEnum.TRIAL]: 'bg-yellow-100 text-yellow-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  }
}
