import { ContainerRegistry } from './container-registry.class';

// typedi가 동작하가위해 Reflect.getMetadata 필요
if (!Reflect || !(Reflect as any).getMetadata) {
  throw new Error('TypeDI requires Reflect.getMetadata to work');
}

export const Container = ContainerRegistry.defaultContainer;
export default Container;
