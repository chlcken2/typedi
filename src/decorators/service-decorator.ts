import { ContainerRegistry } from "../container-registry"
import { EMPTY_VALUE } from "../empty-value"
import { ServiceMetadata } from "../interface/service-metadata"
import { Constructable } from "../types/constructable"
import { ServiceOptions } from "../types/service-options"

export function Service<T = unknown>(): Function;
export function Service<T>(options: ServiceOptions<T> = {}): ClassDecorator {
    return targetConstructor =>{
        const serviceMetadata: ServiceMetadata<T> = {
            id: options.id || targetConstructor,
            type: targetConstructor as unknown as Constructable<T>,
            factory: (options as any).factory || undefined,
            multiple: false,
            eager: false,
            scope: 'container',
            referencedBy: new Map().set(ContainerRegistry.defaultContainer.id, ContainerRegistry.defaultContainer),
            value: EMPTY_VALUE
        }
        ContainerRegistry.defaultContainer.set(serviceMetadata);
    }
}