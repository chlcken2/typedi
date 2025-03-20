import { ContainerInstance } from '../container-instance.class';
import { Constructable } from '../types/constructable.type';

export interface Handler<T = unknown> {
  /**
   * Service object used to apply handler to.
   */
  object: Constructable<T>;

  /**
   * Class property name to set/replace value of.
   * Used if handler is applied on a class property.
   */
  propertyName?: string;

  /**
   * Parameter index to set/replace value of.
   * Used if handler is applied on a constructor parameter.
   */
  index?: number;

  /**
   * Factory function that produces value that will be set to class property or constructor parameter.
   * Accepts container instance which requested the value.
   */
  value: (container: ContainerInstance) => any;
}
