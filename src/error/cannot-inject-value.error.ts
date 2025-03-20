import { Constructable } from '../types/constructable.type';

export class CannotInjectValueError extends Error {
  public name = 'CannotInjectValueError';

  get message(): string {
    return `대충 에러 메시지 ${this.target} ${this.propertyName}`;
  }

  constructor(private target: Constructable<unknown>, private propertyName: string) {
    super();
  }
}
