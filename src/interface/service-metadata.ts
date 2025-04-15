import { ContainerInstance } from "../container-instance";
import { Constructable } from "../types/constructable";
import { ContainerIdentifier } from "../types/container-identfifier";
import { ContainerScope } from "../types/container-scope";
import { ServiceIdentifier } from "../types/service-identifier";

export interface ServiceMetadata<Type = unknown> {
    id: ServiceIdentifier;
    scope: ContainerScope;
    type: Constructable<Type> | null;
    factory: [Constructable<unknown>, string] | CallableFunction | undefined,
    value : unknown | Symbol,
    eager: boolean,
    multiple: boolean,
    referencedBy: Map<ContainerIdentifier, ContainerInstance>
}