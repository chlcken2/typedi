import 'reflect-metadata';

/**
 * We have a hard dependency on reflect-metadata package. Without it the
 * dependency lookup won't work, so we warn users when it's not loaded.
 */
if (!Reflect || !(Reflect as any).getMetadata) {
  throw new Error(
    'TypeDI requires "Reflect.getMetadata" to work. Please import the "reflect-metadata" package at the very first line of your application.'
  );
}

/** This is an internal package, so we don't re-export it on purpose. */
/** We export the default container under the Container alias. */
// export const Container = ContainerRegistry.defaultContainer;
// export default Container;
import { ContainerRegisty } from './container-registry';
import { ServiceA } from './serviceA';

function main() {
  console.log('start');
  // ContainerRegisty.defaultContainer;

  //아래 코드가 정상 동작 할 수 있게 구현하시오
  const container = ContainerRegisty.getContainer('default');
  const serviceA = container.get(ServiceA);
  serviceA.serviceB.sayHello();
  serviceA.sayHello();
}

main();
