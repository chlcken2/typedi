import { ContainerRegistry } from './container.registry.class';

if (!Reflect || !(Reflect as any).metadata) {
  throw new Error('error ');
}

export const defaultContainer = ContainerRegistry.defaultContainer;
export default defaultContainer;
