import { ServiceMetadata } from '../interfaces/service-metadata.interface';

export type ServiceOptions<T = unknown> =
  | Omit<Partial<ServiceMetadata<T>>, 'referenceBy' | 'type' | 'factory'>
  | Omit<Partial<ServiceMetadata<T>>, 'referenceBy' | 'value' | 'factory'>
  | Omit<Partial<ServiceMetadata<T>>, 'referenceBy' | 'value' | 'type'>;
