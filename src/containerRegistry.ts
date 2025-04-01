import { ContainerInstance } from './containerInstance';
import { ContainerIdentifier } from './types/containerIdentifier';

export class ContainerRegistry {
  public static readonly defaultContainer: ContainerInstance = new ContainerInstance('default');

  public static readonly containerMap: Map<ContainerIdentifier, ContainerInstance> = new Map();
  public static registerContainer(container: ContainerInstance) {
    if (container instanceof ContainerInstance === false) {
      //등록하려는 객체가 컨테이너 인스턴스의 객체가 아닐떄
      throw new Error();
    }
    if (ContainerRegistry.containerMap.has(container.id)) {
      // 유일성 체크
      throw new Error();
    }
    if (ContainerRegistry.defaultContainer && container.id === 'default') {
      // 이미 default컨테이너가 존재할 떄{
      throw new Error();
    }
    ContainerRegistry.containerMap.set(container.id, container);
  }
}
