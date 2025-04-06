import { ServiceMetadata } from './service-metadata';

export type ServiceOptions<T = unknown> =
  | Omit<Partial<ServiceMetadata<T>>, 'referrencedBy' | 'type' | 'factory'>
  | Omit<Partial<ServiceMetadata<T>>, 'referrencedBy' | 'value' | 'factory'>
  | Omit<Partial<ServiceMetadata<T>>, 'referrencedBy' | 'value' | 'type'>;
