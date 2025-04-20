import { ServiceMetadata } from '../interfaces/service-metadata';

export type ServiceOptions<T = unknown> =
  | Omit<Partial<ServiceMetadata<T>>, 'referencedBy' | 'type' | 'factory'>
  | Omit<Partial<ServiceMetadata<T>>, 'referencedBy' | 'type' | 'factory'>
  | Omit<Partial<ServiceMetadata<T>>, 'referencedBy' | 'type' | 'factory'>;
