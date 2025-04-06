import { ContainerInstance } from './container.instance.class';
import { ContainerIdentifer } from './types/container.identifier';

export class ContainerRegistry {
  public static readonly defaultContainer: ContainerInstance = new ContainerInstance('default');
  private static readonly containerMap: Map<ContainerIdentifer, ContainerInstance> = new Map();

  public static registeredContainer(container: ContainerInstance): void {
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
