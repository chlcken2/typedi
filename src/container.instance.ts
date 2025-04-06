import { ContainerRegistry } from './container-registry';
import { Handler } from './interfaces/handler';
import { ContainerIdentifier } from './types/container-identifier';

export class ContainerInstance {
  public readonly id!: ContainerIdentifier;
  public readonly handlers: Handler[] = [];
  public metadataMap;
  public multiServiceIds;

  constructor(id: ContainerIdentifier) {
    this.id = id;
    ContainerRegistry.registerContainer(this);
    this.handlers = ContainerRegistry.defaultContainer.handlers || [];
  }
}
