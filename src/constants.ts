export const DEPENDENCIES = Symbol.for('dependencies');
export type Constructable<T = any> = new (...args: any[]) => T;
export type Token<T = any> = symbol | Constructable<T>;
export type Dependencies = Token[];
