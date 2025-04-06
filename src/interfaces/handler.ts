import { ContainerInstance } from '../container.instance.class';
import { Constructable } from '../types/constructable';

export interface Handler<T = unknown> {
  object: Constructable<T>;
  propertyName?: string;
  index?: number;
  value: (container: ContainerInstance) => any;
}
