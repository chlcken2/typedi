import { ContainerRegisty } from './container-registry';
import { ServiceMetadata } from './interfaces/service-metadata';
import { EMPTY_VALUE } from './empty-value';
import { Constructable } from './types/constructable';
import { ContainerIdentifier } from './types/container-identifier';
import { ServiceIdentifier } from './types/service-identifier';
import { ServiceOptions } from './types/service-options';

export class ContainerInstance {
  public readonly id!: ContainerIdentifier;
  private metadataMap: Map<ServiceIdentifier, ServiceMetadata<unknown>> = new Map();

  constructor(identifier: ContainerIdentifier) {
    this.id = identifier;
    ContainerRegisty.registerContainer(this);
  }

  public set<T>(serviceOptions: ServiceOptions<T>): this {
    // if (serviceOptions.scope === 'singleton' && ContainerRegisty.defaultContainer !== this) {
    //   ContainerRegisty.defaultContainer.set(serviceOptions);
    //   return this;
    // }

    const newMetadata: ServiceMetadata<T> = {
      id: ((serviceOptions as any).id || (serviceOptions as any).type) as ServiceIdentifier,
      type: (serviceOptions as ServiceMetadata<T>).type || null,
      factory: (serviceOptions as ServiceMetadata<T>).factory,
      value: (serviceOptions as ServiceMetadata<T>).value || EMPTY_VALUE,
      multiple: serviceOptions.multiple || false,
      eager: serviceOptions.eager || false,
      scope: serviceOptions.scope || 'container',
      ...serviceOptions,
      referencedBy: new Map().set(this.id, this),
    };
    const existingMetadata = this.metadataMap.get(newMetadata.id);
    if (existingMetadata) {
      Object.assign(existingMetadata, newMetadata);
    } else {
      this.metadataMap.set(newMetadata.id, newMetadata);
    }
    return this;
  }

  public get<T = unknown>(identifier: ServiceIdentifier<T>): T {
    const global = ContainerRegisty.defaultContainer.metadataMap.get(identifier);
    const local = this.metadataMap.get(identifier);

    const metadata = global?.scope === 'singleton' ? global : local;

    if (metadata) {
      return this.getServiceValue(metadata);
    }

    throw new Error('서비스 반드시 존재해야함');
  }

  public getServiceValue(serviceMetadata: ServiceMetadata<unknown>): any {
    let value: unknown = EMPTY_VALUE;

    if (serviceMetadata.value !== EMPTY_VALUE) {
      return serviceMetadata.value;
    }

    if (!serviceMetadata.factory && serviceMetadata.type) {
      const constructableTargetType: Constructable<unknown> = serviceMetadata.type;
      const paramTypes: unknown[] = (Reflect as any)?.getMetadata('design:paramtypes', constructableTargetType) || [];
      const params = this.initializeParams(constructableTargetType, paramTypes);

      params.push(this);
      value = new constructableTargetType(...params);
    }

    if (serviceMetadata.scope !== 'transient' && value !== EMPTY_VALUE) {
      serviceMetadata.value = value;
    }

    if (value === EMPTY_VALUE) {
      throw new Error('not ');
    }

    return value;
  }

  private initializeParams(target: Function, paramtypes: any[]): unknown[] {
    return paramtypes.map((paramtype, index) => {
      if (paramtype && paramtype.name && !this.isPrimitiveTypes(paramtype.name)) {
        return this.get(paramtype);
      }
      return undefined;
    });
  }

  private isPrimitiveTypes(typeName: string) {
    return ['string', 'boolean', 'number', 'object'].includes(typeName.toLowerCase());
  }
}
