import { ContainerRegistry } from './containerRegistry';
import { Handler } from './interfaces/handler';
import { ContainerIdentifier } from './types/containerIdentifier';

export class ContainerInstance {
  public readonly id!: ContainerIdentifier;
  private readonly handlers: Handler[] = [];

  constructor(id: ContainerIdentifier) {
    this.id = id;
    ContainerRegistry.registerContainer(this);
    this.handlers = ContainerRegistry.defaultContainer.handlers || []; // handelr 등록
  }

  public of(containerId: ContainerIdentifier = 'default'): ContainerInstance {
    if (containerId === 'default') {
      return ContainerRegistry.defaultContainer;
    }
    let container: ContainerInstance;

    if (ContainerRegistry.hasContainer(containerId)) {
      container = ContainerRegistry.getContainer(containerId);
    } else {
      container = new ContainerInstance(containerId);
    }

    return container;
  }
}
