import { ContainerInstance } from '../container-instance.class';
import { ContainerRegistry } from '../container-registry.class';
import { CannotInjectValueError } from '../error/cannot-inject-value.error';
import { CannotInstantiateValueError } from '../error/cannot-instantiate-value.error';
import { Constructable } from '../types/constructable.type';
import { ServiceIdentifier } from '../types/service-identifier.type';
import { resolveToTypeWrapper } from '../utils/resolve-to-type-wrapper.util';

export function Inject(): Function;
export function Inject(
  typeOrIdentifier?: ((type?: never) => Constructable<unknown>) | ServiceIdentifier<unknown>
): ParameterDecorator | PropertyDecorator {
  /**
   * @Inject()가 호출되는 순간 선어부에서 내부 함수를 반환 런타임이 이 내부 함수를 호출하면서 세가지 매개변수를 자동으로 전달함
   * target: 클래스 자체
   * propertyName: 내부 클래스 속성
   * index: undefined or 생성자 매개변수 -> 해당 클래스의 생성자에 있는 또 다른 매개변수의 인덱스
   * ex: constructor(@Inject() private database: Database) {}에서 database가 생성자 매개변수이므로 index는 0
   */
  return function (target: Object, propertyName: string | Symbol, index?: number): void {
    const typeWrapper = resolveToTypeWrapper(typeOrIdentifier, target, propertyName, index);

    if (typeWrapper === undefined || typeWrapper.eagerType === undefined || typeWrapper.eagerType === Object) {
      throw new CannotInjectValueError(target as Constructable<unknown>, propertyName as string);
    }

    /**
     * 객체 참조의 원리:
     * ContainerRegistry.defaultContainer는 ContainerInstance 타입의 객체 인스턴스입니다.
     * 이 객체는 메모리에 생성되고, 그 참조가 defaultContainer 변수에 저장됩니다.
     */
    ContainerRegistry.defaultContainer.registerHandler({
      object: target as Constructable<unknown>,
      propertyName: propertyName as string,
      index,
      value: (containerInstance) => {
        const evaluatedLazyType = typeWrapper.lazyType();

        if (evaluatedLazyType === undefined || evaluatedLazyType === Object) {
          throw new CannotInjectValueError(target as Constructable<unknown>, propertyName as string);
        }

        return containerInstance.get<unknown>(evaluatedLazyType);
      },
    });
  };
}
