import { ContainerInstance } from '../container-instance';
import { ContainerScope } from '../types/constainer-scope';
import { Constructable } from '../types/constructable';
import { ContainerIdentifier } from '../types/container-identifier';
import { ServiceIdentifier } from '../types/service-identifier';

export interface ServiceMetadata<T = unknown> {
  id: ServiceIdentifier;
  scope: ContainerScope;
  type: Constructable<T> | null;
  factory: [Constructable<unknown>, string] | CallableFunction | undefined;
  value: unknown | Symbol;
  multiple: boolean;
  eager: boolean;
  referencedBy: Map<ContainerIdentifier, ContainerInstance>;
}
