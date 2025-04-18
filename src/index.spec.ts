import { Container, Injectable } from '.';

describe(Container.name, () => {
  const subject = Container.instance;
  it('should be a singleton', () => {
    expect(subject).toBeInstanceOf(Container);
  });

  describe(subject.register.name, () => {
    it('saves without a token', () => {
      class Service {}

      subject.register(Service);

      expect(subject.get(Service)).toBe(Service);
    });

    it('saves with a token', () => {
      class Service {}
      const token = Symbol.for('token');

      subject.register(Service, token);

      expect(subject.get(token)).toBe(Service);
    });
  });

  describe(subject.resolve.name, () => {
    class Tokenized {}
    const token = Symbol.for('token');

    subject.register(Tokenized, token);

    it('does not resolve without decoration', () => {
      class Service {}
      subject.register(Service);

      expect.assertions(1);
      try {
        subject.resolve(Service);
      } catch (error) {
        expect(error).toEqual(
          new TypeError("Cannot read properties of undefined (reading 'map')")
        );
      }
    });

    it('resolves without token', () => {
      @Injectable()
      class Service {
        public stamp = Symbol.for('stamped');
      }

      const resolved = subject.resolve(Service);

      expect(resolved).toEqual(new Service());
    });

    it('resolves with token', () => {
      const TOKENIZED = Symbol.for('tokenized');
      @Injectable({
        token: TOKENIZED,
      })
      class Tokenized {
        public stamp = Symbol.for('stamped');
      }

      const resolved = subject.resolve(TOKENIZED);

      expect(resolved).toEqual(new Tokenized());
    });

    it('resolves dependencies', () => {
      @Injectable()
      class Dep1 {
        public stamp = Symbol.for('stamp1');
      }

      @Injectable()
      class Dep2 {
        public stamp = Symbol.for('stamp2');
      }

      @Injectable({
        inject: [Dep1, Dep2],
      })
      class Service {
        public stamp = Symbol.for('service');
        constructor(dep1: Dep1, dep2: Dep2) {}
      }

      const resolved = subject.resolve(Service);

      expect(resolved).toEqual(new Service(new Dep1(), new Dep2()));
    });

    it('must register services before they can be resolved', () => {
      class Service {}

      expect.assertions(1);
      try {
        subject.resolve(Service);
      } catch (error) {
        expect(error).toEqual(new Error(`Please register ${String(Service)}!`));
      }
    });
  });
});
