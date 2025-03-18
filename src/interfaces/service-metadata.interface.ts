import { Contructable } from '../types/constructable.type';
import { ContainerIdentifier } from '../types/container-identifier.type';
import { ContainerScope } from '../types/container-scope.type';
import { ServiceIdentifier } from '../types/service-identifier.type';

export interface ServiceMetadata<Type = unknown> {
  id: ServiceIdentifier;
  scope: ContainerScope;
  type: Contructable<Type> | null;
  factory: [Contructable<unknown>, string] | CallableFunction | undefined;
  value: unknown | Symbol;
  multiple: boolean;
  eager: boolean;
  referencedBy: Map<ContainerIdentifier, ContainerIdentifier>;
}
