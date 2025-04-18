# Stimpack 💉

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> Simple dependency injection for TypeScript and React

Dependency injection without the framework, and without `reflect-metadata`. Just pure TypeScript.

## Install

```bash
npm install @beetlabs/stimpack
```

## Usage

```ts
import { Injectable } from '@beetlabs/stimpack'

@Injectable()
class Dependency {
  test() {
    console.log('yay')
  }
}

const token = new Symbol();
@Injectable({
  token,
  inject: [Dependency]
})
class Service {
  constructor(
    dependency: Dependency
  ) {}

  method() {
    this.dependency.test() // typesafe
  }
}
```
In React:
```tsx
// App.tsx
import { InjectionProvider } from '@beetlabs/stimpack/react'

<InjectionProvider>
  {/* ... the rest of your app */}
</InjectionProvider>


// SomeComponent.tsx
import { useInjection } from '@beetlabs/stimpack/react'
import { SomeService } from './some-injectable-service'

export const Component = () => {
  const service = useInjection(SomeService) // typesafe!
}
```

## API

### Injectable
```ts
function Injectable(options?: {
  token?: symbol,
  inject?: any[]
})
```
This is where the magic happens. `Injectable` is a `ClassDecorator` which registers a service with the injection container. *Note that for now the `inject` array does need to match the order of the dependencies in the constructor:
```ts
@Injectable({
  inject: [Dep2, Dep1]
})
class Service {
  constructor(
    dep1: Dep1,
    dep2: Dep2
  ) {}

  test() {
    dep1.someMethodOnDep1() // this will fail because we injected Dep2 first
  }
}
```

### Container
```ts
interface Container {
  instance: Container;
  register(service: any, token?: symbol): void;
  resolve<T>(token?: any | symbol): T
}
```
Most of the time you won't need to interact directly with `Container`, but in the case that you are extending this to use with a framework, it's here for you. `Container` is a singleton with a private constructor, so access it with `instance`. The other two methods do what they sound like.

### useInjection
```ts
useInjection<T>(token: any | symbol): T 
```
Exposes `Container#resolve` to React!

[build-img]:https://github.com/beetlabs/stimpack/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/beetlabs/stimpack/actions/workflows/release.yml
[downloads-img]:https://img.shields.io/npm/dt/@beetlabs/stimpack
[downloads-url]:https://www.npmtrends.com/@beetlabs/stimpack
[npm-img]:https://img.shields.io/npm/v/@beetlabs/stimpack
[npm-url]:https://www.npmjs.com/package/@beetlabs/stimpack
[issues-img]:https://img.shields.io/github/issues/beetlabs/stimpack/issues
[issues-url]:https://github.com/beetlabs/stimpack/issues
[codecov-img]:https://codecov.io/gh/beetlabs/stimpack/branch/main/graph/badge.svg
[codecov-url]:https://codecov.io/gh/beetlabs/stimpack
[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/
