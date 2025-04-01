import { ContainerRegistry } from "./containerRegistry";

if (!Reflect || !(Reflect as any).getMetadata) {
  throw new Error('error');
}

export const Container = ContainerRegistry.defaultContainer;
