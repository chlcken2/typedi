import { ContainerRegistry } from "./container-registry";

if(!Reflect || !(Reflect as any).getMetadata){
    throw new Error();
}

export const Container = ContainerRegistry.defaultContainer;
export default Container; 