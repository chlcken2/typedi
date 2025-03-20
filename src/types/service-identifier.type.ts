import { AbstractConstructable } from './abstract-constructable.type';
import { Constructable } from './constructable.type';

export type ServiceIdentifier<T = unknown> =
  | Constructable<T>
  | AbstractConstructable<T>
  | CallableFunction
  | Token<T>
  | string;

export class Token<T> {
  constructor(public name?: string) {}
}
