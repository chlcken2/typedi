import { ServiceIdentifier, Token } from '../types/service-identifier.type';

export class ServiceNotFoundError extends Error {
  constructor(identifier: ServiceIdentifier) {
    super();

    if (typeof identifier === 'string') {
      this.normalizedIdentifier = identifier;
    } else if (identifier instanceof Token) {
      this.normalizedIdentifier = `Token<${identifier.name || 'UNSET_NAME'}>`;
    } else if (identifier && (identifier.name || identifier.prototype?.name)) {
      this.normalizedIdentifier =
        `MaybeConstructable<${identifier.name}>` ||
        `MaybeConstructable<${(identifier.prototype as { name: string })?.name}>`;
    }
  }
  public name = 'ServiceNotFoundError';

  private normalizedIdentifier: string = '<UNKNOWN_IDENTIFIER>';

  get message(): string {
    return (
      `Service with "${this.normalizedIdentifier}" identifier was not found in the container. ` +
      `Register it before usage via explicitly calling the "Container.set" function or using the "@Service()" decorator.`
    );
  }
}
