import { ContainerRegistry } from './container.registry.class';
import { Handler } from './interfaces/handler';
import { ContainerIdentifer } from './types/container.identifier';

export class ContainerInstance {
  public readonly id!: ContainerIdentifer;
  private readonly handler: Handler[] = []; //핸들러 타입 정의
  private disposed: boolean = false;

  constructor(id: ContainerIdentifer) {
    this.id = id;
    ContainerRegistry.registeredContainer(this);
    this.handler = ContainerRegistry.defaultContainer?.handler || [];
  }
}
