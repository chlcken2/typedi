import { ContainerInstance } from './container.instance';
import { ContainerIdentifier } from './types/container-identifier';

export class ContainerRegistry {
  public static readonly defaultContainer: ContainerInstance = new ContainerInstance('default');

  private static readonly containerMap: Map<ContainerIdentifier, ContainerInstance> = new Map();

  public static registerContainer(container: ContainerInstance): void {
    if (container instanceof ContainerInstance === false) {
      throw new Error();
    }
    if (!!ContainerRegistry.defaultContainer && container.id === 'default') {
      throw new Error();
    }
    if (ContainerRegistry.containerMap.has(container.id)) {
      throw new Error();
    }

    ContainerRegistry.containerMap.set(container.id, container);
  }
}
