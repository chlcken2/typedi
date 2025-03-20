import { Constructable } from '../types/constructable.type';
import { ServiceIdentifier, Token } from '../types/service-identifier.type';

/**
 * 각 매개변수 별 즉시로딩인지, 지연로딩인지 판단하는 함수
 * lazyType: 지연평가용
 *eagerType: 즉시평가
 *
 */
export function resolveToTypeWrapper(
  typeOrIdentifier: ((type?: never) => Constructable<unknown>) | ServiceIdentifier<unknown> | undefined,
  target: Object,
  propertyName: string | Symbol,
  index?: number
): { eagerType: ServiceIdentifier | null; lazyType: (type?: never) => ServiceIdentifier } {
  let typeWrapper!: { eagerType: ServiceIdentifier | null; lazyType: (type?: never) => ServiceIdentifier };

  /** If requested type is explicitly set via a string ID or token, we set it explicitly. */
  if ((typeOrIdentifier && typeof typeOrIdentifier === 'string') || typeOrIdentifier instanceof Token) {
    typeWrapper = { eagerType: typeOrIdentifier, lazyType: () => typeOrIdentifier };
  }

  // 지연 평가를 위한 코드
  if (typeOrIdentifier && typeof typeOrIdentifier === 'function') {
    //즉시 평가 안하고, 나중에 평가함
    typeWrapper = { eagerType: null, lazyType: () => (typeOrIdentifier as CallableFunction)() };
  }

  /** If no explicit type is set and handler registered for a class property, we need to get the property type. */
  if (!typeOrIdentifier && propertyName) {
    const identifier = (Reflect as any).getMetadata('design:type', target, propertyName);

    typeWrapper = { eagerType: identifier, lazyType: () => identifier };
  }

  /** If no explicit type is set and handler registered for a constructor parameter, we need to get the parameter types. */
  if (!typeOrIdentifier && typeof index == 'number' && Number.isInteger(index)) {
    const paramTypes: ServiceIdentifier[] = (Reflect as any).getMetadata('design:paramtypes', target, propertyName);
    /** It's not guaranteed, that we find any types for the constructor. */
    const identifier = paramTypes?.[index];

    typeWrapper = { eagerType: identifier, lazyType: () => identifier };
  }

  return typeWrapper;
}
