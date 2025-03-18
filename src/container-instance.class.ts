import { ContainerRegistry } from './container-registry.class';
import { Handler } from './interfaces/handler.interface';
import { ContainerIdentifier } from './types/container-identifier.type';

export class ContainerInstance {
  public readonly id!: ContainerIdentifier;
  private disposed: boolean = false;
  private readonly handlers: Handler[] = [];
private metadataMap: Map<ServiceIdentifier, ServiceMetadata<unknown>> = new Map();

  constructor(id: ContainerIdentifier) {
    this.id = id;

    ContainerRegistry.registerContainer(this);

    /**
     * TODO: This is to replicate the old functionality. This should be copied only
     * TODO: if the container decides to inherit registered classes from a parent container.
     */
    this.handlers = ContainerRegistry.defaultContainer?.handlers || [];
  }

  private throwIfDisposed() {
    if (this.disposed) {
      throw new Error('Cannot use container after it has been disposed.');
    }
  }

  //of() 메서드는 특정 ID를 가진 컨테이너 인스턴스를 가져오는 기능
  public of(containerId: ContainerIdentifier = 'default'): ContainerInstance {
    this.throwIfDisposed();

    if (containerId === 'default') {
      return ContainerRegistry.defaultContainer;
    }

    /**
     * 컨테이너 인스턴스가 이미 존재하는지 확인
     * 존재하면 해당 인스턴스 반환
     * 존재하지 않으면 새로 생성
     */
    if (ContainerRegistry.hasContainer(containerId)) {
      return ContainerRegistry.getContainer(containerId);
    }
    return new ContainerInstance(containerId);
  }
}
