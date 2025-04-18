import { DEPENDENCIES, Constructable, Token } from './constants';
import { Container } from './container';

export function Injectable(options?: {
  token?: symbol;
  inject?: Token[];
}): ClassDecorator {
  return function (target) {
    Reflect.set(target, DEPENDENCIES, options?.inject ?? []);
    Container.instance.register(
      target as unknown as Constructable,
      options?.token
    );
  };
}
