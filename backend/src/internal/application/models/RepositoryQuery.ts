import type { Filter } from './Filter.js';

export type RelationDef = {
  entity: unknown;
  with?: Record<string, RelationDef>;
};

export type EntityOf<R> = R extends { entity: infer E }
  ? E
  : never;

export type WithOf<R> = R extends { with: infer W }
  ? W extends Record<string, RelationDef>
    ? W
    : Record<string, never>
  : Record<string, never>;

export type WithRelations<
  W extends Record<string, RelationDef>,
> = {
  [K in keyof W]?:
    | boolean
    | RepositoryQuery<EntityOf<W[K]>, WithOf<W[K]>>;
};

export interface RepositoryQuery<
  T,
  W extends Record<string, RelationDef> = Record<string, never>,
> {
  filter?: Filter<T>;
  with?: WithRelations<W>;
}

export interface PaginatedRepositoryQuery<
  T,
  W extends Record<string, RelationDef> = Record<string, never>,
> extends RepositoryQuery<T, W> {
  page?: {
    limit?: number;
    offset?: number;
  };
}
