import { ContainerRegistry } from './container.registry.class';
import { EMPTY_VALUE } from './empty.const';
import { Handler } from './interfaces/handler';
import { ServiceMetadata } from './interfaces/service-metadata';
import { ServiceOptions } from './interfaces/service-options';
import { Token } from './token';
import { Constructable } from './types/constructable';
import { ContainerIdentifer } from './types/container.identifier';
import { ContainerScope } from './types/container.scope';
import { ServiceIdentifier } from './types/service.identifier';

export class ContainerInstance {
  public readonly id!: ContainerIdentifer;
  private readonly handlers: Handler[] = []; //핸들러 타입 정의
  private disposed: boolean = false;
  private multiServiceIds: Map<ServiceIdentifier, { tokens: Token<unknown>[]; scope: ContainerScope }> = new Map();
  private metadataMap: Map<ServiceIdentifier, ServiceMetadata<unknown>> = new Map();

  private throwIfDisposed() {
    if (this.disposed) {
      throw new Error();
    }
  }

  constructor(id: ContainerIdentifer) {
    this.id = id;
    ContainerRegistry.registeredContainer(this);
    this.handlers = ContainerRegistry.defaultContainer?.handlers || [];
  }

  public set<T = unknown>(serviceOptions: ServiceOptions<T>): this {
    this.throwIfDisposed();

    if (serviceOptions.scope === 'singleton' && ContainerRegistry.defaultContainer !== this) {
      ContainerRegistry.defaultContainer.set(serviceOptions);
      return this;
    }
    const newMetadata: ServiceMetadata<T> = {
      id: ((serviceOptions as any).id || (serviceOptions as any).type) as ServiceIdentifier,
      scope: serviceOptions.scope || 'container',
      type: (serviceOptions as ServiceMetadata<T>).type || null,
      factory: (serviceOptions as ServiceMetadata<T>).factory,
      value: (serviceOptions as ServiceMetadata).value,
      multiple: (serviceOptions as ServiceMetadata).multiple || false,
      eager: (serviceOptions as ServiceMetadata).eager || false,
      ...serviceOptions,
      referredcedBy: new Map().set(this.id, this),
    };

    if (serviceOptions.multiple) {
      const maskedtoken = new Token(`Multi-${newMetadata.id.toString()}`);
      const existingMultiGroup = this.multiServiceIds.get(newMetadata.id);

      if (existingMultiGroup) {
        existingMultiGroup.tokens.push(maskedtoken);
      } else {
        this.multiServiceIds.set(newMetadata.id, { scope: newMetadata.scope, tokens: [maskedtoken] });
      }
      newMetadata.id = maskedtoken;
      newMetadata.multiple = false;
    }

    const existingMetadata = this.metadataMap.get(newMetadata.id);
    if (existingMetadata) {
      Object.assign(existingMetadata, newMetadata);
    } else {
      this.metadataMap.set(newMetadata.id, newMetadata);
    }

    if (newMetadata.eager && newMetadata.scope !== 'transient') {
      this.get(newMetadata.id);
    }
    return this;
  }

  public get<T = unknown>(identiFier: ServiceIdentifier<T>): T {
    this.throwIfDisposed();

    const global = ContainerRegistry.defaultContainer.metadataMap.get(identiFier);
    const local = this.metadataMap.get(identiFier);

    const metadata = global?.scope === 'singleton' ? global : local;

    if (metadata && metadata.multiple === true) {
      throw new Error();
    }

    if (metadata) {
      return this.getServiceValue(metadata);
    }

    if (global && this !== ContainerRegistry.defaultContainer) {
      const clondedService = { ...global };
      clondedService.value = EMPTY_VALUE;

      this.set(clondedService);
      const value = this.getServiceValue(clondedService);
      this.set({ ...clondedService, value });
      return value;
    }
    throw new Error();
  }

  private getServiceValue(serviceMetadata: ServiceMetadata<unknown>): any {
    let value: unknown = EMPTY_VALUE;

    if (serviceMetadata.value !== EMPTY_VALUE) {
      return serviceMetadata.value;
    }

    if (!serviceMetadata.factory && !serviceMetadata.type) {
      throw new Error();
    }

    if (serviceMetadata.factory) {
      if (serviceMetadata.factory instanceof Array) {
        let factoryInstance;

        try {
          factoryInstance = this.get<any>(serviceMetadata.factory[0]);
        } catch (error) {
          throw new Error();
        }

        value = factoryInstance[serviceMetadata.factory[1]](this, serviceMetadata.id);
      } else {
        value = serviceMetadata.factory(this, serviceMetadata.id);
      }
    }

    if (!serviceMetadata.factory && serviceMetadata.type) {
      const constructableTargetType: Constructable<unknown> = serviceMetadata.type;
      const paramTypes: unknown[] = (Reflect as any)?.getMetadata('design:paramtypes', constructableTargetType) || [];
      const param = this.initializeParams(constructableTargetType, paramTypes);

      param.push(this);
      value = new constructableTargetType(...param);
    }

    if (serviceMetadata.scope !== 'transient' && value != EMPTY_VALUE) {
      serviceMetadata.value = value;
    }

    if (value === EMPTY_VALUE) {
      throw new Error();
    }

    if (serviceMetadata.type) {
      this.applyPropertyHanlders(serviceMetadata.type, value as Record<string, any>);
    }
    return value;
  }

  private applyPropertyHanlders(target: Function, instance: { [key: string]: any }) {
    this.handlers.forEach((handler) => {
      if (typeof handler.index === 'number') return;
      if (handler.object.constructor !== target && !(target.prototype instanceof handler.object.constructor)) return;

      if (handler.propertyName) {
        instance[handler.propertyName] = handler.value(this);
      }
    });
  }

  private initializeParams(target: Function, paramTypes: any[]): unknown[] {
    return paramTypes.map((paramType, index) => {
      const paramHandler =
        this.handlers.find((handler) => {
          /**
           * @Inject()-ed values are stored as parameter handlers and they reference their target
           * when created. So when a class is extended the @Inject()-ed values are not inherited
           * because the handler still points to the old object only.
           *
           * As a quick fix a single level parent lookup is added via `Object.getPrototypeOf(target)`,
           * however this should be updated to a more robust solution.
           *
           * TODO: Add proper inheritance handling: either copy the handlers when a class is registered what
           * TODO: has it's parent already registered as dependency or make the lookup search up to the base Object.
           */
          return handler.object === target && handler.index === index;
        }) ||
        this.handlers.find((handler) => {
          return handler.object === Object.getPrototypeOf(target) && handler.index === index;
        });

      if (paramHandler) return paramHandler.value(this);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if (paramType && paramType.name && !this.isPrimitiveParamType(paramType.name)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return this.get(paramType);
      }

      return undefined;
    });
  }

  private isPrimitiveParamType(paramTypeName: string): boolean {
    return ['string', 'boolean', 'number', 'object'].includes(paramTypeName.toLowerCase());
  }
}
