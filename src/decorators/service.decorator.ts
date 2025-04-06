import { ContainerRegistry } from '../container.registry.class';
import { EMPTY_VALUE } from '../empty.const';
import { ServiceMetadata } from '../interfaces/service-metadata';
import { ServiceOptions } from '../interfaces/service-options';
import { Constructable } from '../types/constructable';

export function Service<T = unknown>(): Function;
export function Service<T = unknown>(options: ServiceOptions<T>): Function;
export function Service<T>(options: ServiceOptions<T> = {}): ClassDecorator {
  return (targetConstrctable) => {
    const ServiceMetadata: ServiceMetadata<T> = {
      id: options.id || targetConstrctable,
      scope: options.scope || 'container',
      type: targetConstrctable as unknown as Constructable<T>,
      factory: (options as any).factory || undefined,
      value: EMPTY_VALUE,
      multiple: options.multiple || false,
      eager: options.eager || false,
      referredcedBy: new Map().set(ContainerRegistry.defaultContainer.id, ContainerRegistry.defaultContainer),
    };
    ContainerRegistry.defaultContainer.set(ServiceMetadata);
  };
}
