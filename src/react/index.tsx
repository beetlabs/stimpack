import React, { createContext, useContext, PropsWithChildren } from 'react';
import { Constructable, Token } from '../constants';
import { Container as Pack } from '../container';

interface Container {
  register(service: Constructable, token: symbol): void;
  resolve<T>(token: Token<T>): T;
}
type Contract = <T>(token: Token<T>) => T

function defaultValue<T>() { return {} as T; }
const Context = createContext<Contract>(defaultValue)

export function useInjection<T>(token: Token<T>): T {
  return useContext(Context)<T>(token)
}

interface Props {
  container?: Container
}

export function InjectionProvider({ children, container }: PropsWithChildren<Props>) {
  const value = container
    ? container.resolve.bind(container)
    : Pack.instance.resolve.bind(Pack.instance)
  return (
    <Context.Provider
      value={value}
    >
      {children}
    </Context.Provider>
  )
}


