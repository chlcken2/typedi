import { ContainerInstance } from './container-instance';
import { EMPTY_VALUE } from './empty-value';
import { ServiceMetadata } from './interfaces/service-metadata';
import { ContainerIdentifier } from './types/container-identifier';
import { ServiceIdentifier } from './types/service-identifier';
import { ServiceOptions } from './types/service-options';

export class ContainerRegisty {
  private static readonly containerMap: Map<ContainerIdentifier, ContainerInstance> = new Map();
  public static readonly defaultContainer: ContainerInstance = new ContainerInstance('default');

  public static registerContainer(container: ContainerInstance): void {
    if (container instanceof ContainerInstance === false) {
      throw new Error('error');
    }

    if (!!ContainerRegisty.defaultContainer && container.id === 'default') {
      throw new Error('errror');
    }

    if (ContainerRegisty.containerMap.has(container.id)) {
      throw new Error('error');
    }

    ContainerRegisty.containerMap.set(container.id, container);
  }

  public static getContainer(id: ContainerIdentifier): ContainerInstance {
    const registedContainer = this.containerMap.get(id);
    if (registedContainer === undefined) {
      throw new Error('error');
    }

    return registedContainer;
  }
}
