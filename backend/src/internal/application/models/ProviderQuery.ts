import type { FilterOperator } from './Filter.js';

export type Eq<K extends string, V> = {
  field: K;
  operator: FilterOperator.Equals;
  value: V;
};

export type And<T extends readonly unknown[]> = {
  and: T;
};

export type ProviderQuery<TFilter> = {
  filter: TFilter;
};
