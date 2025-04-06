import { ContainerRegistry } from './container-registry';

if (!Reflect || !(Reflect as any).metadata) {
  throw new Error();
}

export const container = ContainerRegistry.defaultContainer;
export default container;
