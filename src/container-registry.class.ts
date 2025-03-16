import { ContainerInstance } from './container-instance.class';

export class ContainerRegistry {
  public static readonly defaultContainer: ContainerInstance = new ContainerInstance('default');
  public static registerContainer(container: ContainerInstance): void {
    if (!!ContainerRegistry.defaultContainer && container.id === 'default') {
      // TODO: Create custom error for this.
      throw new Error('You cannot register a container with the "default" ID.');
    }
    // ContainerRegistry.containerMap.set(container.id, container);
  }
}
