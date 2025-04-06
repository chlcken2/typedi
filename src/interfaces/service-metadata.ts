import { ContainerInstance } from '../container.instance.class';
import { Constructable } from '../types/constructable';
import { ContainerIdentifer } from '../types/container.identifier';
import { ContainerScope } from '../types/container.scope';
import { ServiceIdentifier } from '../types/service.identifier';

export interface ServiceMetadata<Type = unknown> {
  id: ServiceIdentifier;
  scope: ContainerScope;
  type: Constructable<Type> | null;
  factory: [Constructable<unknown>, string] | CallableFunction | undefined;
  value: unknown | Symbol;
  multiple: boolean;
  eager: boolean;
  referredcedBy: Map<ContainerIdentifer, ContainerInstance>;
}
