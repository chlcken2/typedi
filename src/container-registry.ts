import { ContainerInstance } from "./container-instance";
import { ContainerIdentifier } from "./types/container-identfifier";

export class ContainerRegistry {
    private static readonly containerMap: Map<ContainerIdentifier,ContainerInstance> = new Map();

    public static readonly defaultContainer: ContainerInstance = new ContainerInstance('default');

    public static registeredContainer(container: ContainerInstance): void {
        if(container instanceof ContainerInstance===false){
            throw new Error('이미존재');
        }
        if(!!ContainerRegistry.defaultContainer && container.id === 'default'){
            throw new Error('das');
        }


        if(this.containerMap.has(container.id)){
            throw new Error('이미존재');
        }
        ContainerRegistry.containerMap.set(container.id, container);
    }
}