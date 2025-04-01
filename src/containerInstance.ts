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
}
