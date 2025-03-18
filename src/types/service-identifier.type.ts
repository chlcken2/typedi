import { AbstractConstructable } from './abstract-constructable.type';
import { Contructable } from './constructable.type';

export type ServiceIdentifier<T = unknown> =
  | Contructable<T>
  | AbstractConstructable<T>
  | CallableFunction
  | Token<T>
  | string;

export class Token<T> {
  constructor(public name?: string) {}
}
