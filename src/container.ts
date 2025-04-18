import { DEPENDENCIES, Token, Constructable, Dependencies } from './constants';

const INSTANCE = Symbol.for('instance');

export class Container extends Map<Token, Constructable> {
  private static [INSTANCE]?: Container;
  private instances = new Map<Token, unknown>();

  private constructor() {
    super();
  }

  public static get instance(): Container {
    if (!this[INSTANCE]) {
      this[INSTANCE] = new this();
    }

    return this[INSTANCE]!;
  }

  public register(service: Constructable, token?: symbol): void {
    this.set(token ?? service, service);
  }

  public resolve<T>(token: Token<T>): T {
    const instance = this.instances.get(token);

    if (!instance) {
      const Service = this.get(token);

      if (!Service) {
        throw new Error(`Please register ${String(token)}!`);
      }

      const dependencies = Reflect.get(Service, DEPENDENCIES) as Dependencies;

      this.instances.set(
        token,
        new Service(...dependencies.map(d => this.resolve<typeof d>(d)))
      );
    }

    return this.instances.get(token) as T;
  }
}
