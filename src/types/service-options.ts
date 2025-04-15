import { ServiceMetadata } from "../interface/service-metadata";

export type ServiceOptions<T=unknown> = 
| Omit<Partial<ServiceMetadata<T>>, 'referencedBy' | 'type' | 'value'>
| Omit<Partial<ServiceMetadata<T>>, 'referencedBy' | 'type' | 'factory'>
| Omit<Partial<ServiceMetadata<T>>, 'referencedBy' | 'factory' | 'value'>