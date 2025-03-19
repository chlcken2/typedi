import { ContainerRegistry } from './container-registry.class';

// typedi가 동작하가위해 Reflect.getMetadata 필요
if (!Reflect || !(Reflect as any).getMetadata) {
  throw new Error('TypeDI requires Reflect.getMetadata to work');
}

/**
  - example:
  사용자가 컨테이너를 지정하지 않음
  @Service()
  class UserService {}
  - 자동으로 기본 컨테이너에 등록됨
  Container === ContainerRegistry.defaultContainer
  const userService = Container.get(UserService);
  명시적으로 다른 컨테이너 사용
  const apiContainer = Container.of('api');
  apiContainer.set({ id: 'apiConfig', value: { url: 'https://api.example.com' } });
  const apiConfig = apiContainer.get('apiConfig');

  기본 컨테이너가 선언된 이유: 
  대부분의 경우 싱글톤으로 사용되니까 하나의 컨테이너만 필요하고, 매번 컨테이너 지정할 필요없이 @Service()와 Container.get()만 사용하면 됨
 */
export const Container = ContainerRegistry.defaultContainer;
export default Container;
