import { ContainerInstance } from './container-instance.class';
import { ContainerIdentifier } from './types/container-identifier.type';

export class ContainerRegistry {
  public static readonly containerMap: Map<ContainerIdentifier, ContainerInstance> = new Map();
  /**
   * 여러개의 컨테이너를 관리
   * 특정 ID로 컨테이너를 조회
   * 앱 전체에서 동일 컨테이너 공유ㄴ
   */
  public static readonly defaultContainer: ContainerInstance = new ContainerInstance('default');

  public static registerContainer(container: ContainerInstance): void {
    if (container instanceof ContainerInstance === false) {
      throw new Error('only container instance can be registered');
    }
    if (ContainerRegistry.containerMap.has(container.id)) {
      throw new Error('only container instance can be registered');
    }
    if (!!ContainerRegistry.defaultContainer && container.id === 'default') {
      // TODO: Create custom error for this.
      throw new Error('You cannot register a container with the "default" ID.');
    }
    // ContainerRegistry.containerMap.set(container.id, container);
  }

  public static hasContainer(id: ContainerIdentifier): boolean {
    return ContainerRegistry.containerMap.has(id);
  }

  public static getContainer(id: ContainerIdentifier): ContainerInstance {
    const registeredContainer = this.containerMap.get(id);

    //미존재시
    if (registeredContainer === undefined) {
      throw new Error('No container is registered');
    }
    return registeredContainer;
  }
}
