import { ContainerRegistry } from "./container-registry";
import { ServiceMetadata } from "./interface/service-metadata";
import { ContainerIdentifier } from "./types/container-identfifier";
import { ServiceIdentifier } from "./types/service-identifier";

export class ContainerInstance{
    public readonly id!: ContainerIdentifier;
    private metadataMap: Map<ServiceIdentifier,ServiceMetadata<unknown>> = new Map();
    
    constructor(id: ContainerIdentifier){
        this.id = id;
        ContainerRegistry.registeredContainer(this);
        
    }

}