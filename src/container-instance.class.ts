import { ContainerRegistry } from './container-registry.class';
import { EMPTY_VALUE } from './empty.const';
import { CannotInstantiateValueError } from './error/cannot-instantiate-value.error';
import { ServiceNotFoundError } from './error/service-not-found.error';
import { Handler } from './interfaces/handler.interface';
import { ServiceMetadata } from './interfaces/service-metadata.interface';
import { ServiceOptions } from './types/service-options.type';
import { ContainerIdentifier } from './types/container-identifier.type';
import { ContainerScope } from './types/container-scope.type';
import { ServiceIdentifier, Token } from './types/service-identifier.type';

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

  private multiServiceIds: Map<ServiceIdentifier, { token: Token<unknown>[]; scope: ContainerScope }> = new Map();

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

  public async dispose(): Promise<void> {
    this.reset({ strategy: 'resetServices' });
    this.disposed = true;
    await Promise.resolve();
  }

  public reset(options: { strategy: 'resetValue' | 'resetServices' } = { strategy: 'resetValue' }): this {
    this.throwIfDisposed();

    switch (options.strategy) {
      case 'resetValue':
        this.metadataMap.forEach((service) => this.disposeServiceInstance(service));
        break;
      case 'resetServices':
        this.metadataMap.forEach((service) => this.disposeServiceInstance(service));
        this.metadataMap.clear();
        this.multiServiceIds.clear();
        break;
      default:
        throw new Error('received invalid reset strategy');
    }
    return this;
  }

  private disposeServiceInstance(serviceMetadata: ServiceMetadata, force = false) {
    this.throwIfDisposed();

    const shouldResetValue = force || !!serviceMetadata.type || !!serviceMetadata.factory;

    if (shouldResetValue) {
      if (typeof (serviceMetadata?.value as Record<string, unknown>)['dispose'] === 'function') {
        try {
          (serviceMetadata.value as { dispose: CallableFunction }).dispose();
        } catch (error) {
          console.error(error);
        }
      }
    }

    serviceMetadata.value = undefined;
  }

  public get<T = unknown>(id: ServiceIdentifier<T>): T {
    // 컨테이너가 사용 중이지 않는지 확인
    this.throwIfDisposed();

    //전역, 지역 메타데이터 조회
    const global = ContainerRegistry.defaultContainer.metadataMap.get(id);
    const local = this.metadataMap.get(id);

    //싱글톤이면 전역, 아니면 지역
    const metadata = global?.scope === 'singleton' ? global : local;

    // 단일 인스턴스를 반환하는 함수에서, 멀티플 인스턴스 존재 시 에러 발생
    if (metadata && metadata.multiple === true) {
      throw new Error('cannot resolve multiple value');
    }

    // 메타데이터가 존재하면 값 반환
    if (metadata) {
      return this.getServiceValue(metadata);
    }

    //전역 컨테이너에서 찾았으면서 현재 컨테이너가 전역 컨테이너가 아닌 경우
    if (global && this !== ContainerRegistry.defaultContainer) {
      const clonedService = { ...global };
      clonedService.value = EMPTY_VALUE;

      this.set(clonedService);

      const value = this.getServiceValue(clonedService);
      this.set({ ...clonedService, value });
      return value;
    }
    throw new ServiceNotFoundError(id);
  }

  public set<T = unknown>(serviceOptions: ServiceOptions<T>): this {
    this.throwIfDisposed();

    if (serviceOptions.scope === 'singleton' && ContainerRegistry.defaultContainer !== this) {
      ContainerRegistry.defaultContainer.set(serviceOptions);
      return this;
    }

    const newMetadata: ServiceMetadata<T> = {
      id: ((serviceOptions as any).id || (serviceOptions as any).type) as ServiceIdentifier,
      type: (serviceOptions as ServiceMetadata<T>).type || null,
      factory: (serviceOptions as ServiceMetadata<T>).factory,
      value: (serviceOptions as ServiceMetadata<T>).value || EMPTY_VALUE,
      multiple: serviceOptions.multiple || false,
      eager: serviceOptions.eager || false,
      scope: serviceOptions.scope || 'container',
      /** We allow overriding the above options via the received config object. */
      ...serviceOptions,
      referencedBy: new Map().set(this.id, this),
    };

    if (serviceOptions.multiple) {
      const maskedToken = new Token(`MultiMaskToken-${newMetadata.id.toString()}`);
      const existingMultiGroup = this.multiServiceIds.get(newMetadata.id);

      if (existingMultiGroup) {
        existingMultiGroup.token.push(maskedToken);
      } else {
        this.multiServiceIds.set(newMetadata.id, { token: [maskedToken], scope: newMetadata.scope });
      }

      newMetadata.id = maskedToken;
      newMetadata.multiple = true;
    }

    const existringMetadata = this.metadataMap.get(newMetadata.id);

    if (existringMetadata) {
      Object.assign(existringMetadata, newMetadata);
    } else {
      this.metadataMap.set(newMetadata.id, newMetadata);
    }
    if (newMetadata.eager && newMetadata.scope !== 'transient') {
      this.get(newMetadata.id);
    }

    return this;
  }

  private getServiceValue(serviceMetadata: ServiceMetadata<unknown>): any {
    let value: unknown = EMPTY_VALUE;

    if (serviceMetadata.value !== EMPTY_VALUE) {
      return serviceMetadata.value;
    }

    if (!serviceMetadata.factory && !serviceMetadata.type) {
      throw new CannotInstantiateValueError(serviceMetadata.id);
    }

    if (serviceMetadata.factory) {
      if (serviceMetadata.factory instanceof Array) {
        let factoryInstance;

        try {
          factoryInstance = this.get<any>(serviceMetadata.factory[0]);
        } catch (error) {
          if (error instanceof ServiceNotFoundError) {
          }
        }
      }
    }
  }
}
