export enum FilterOperator {
  Equals = 'eq',
  In = 'in',
}

type FieldKey<T> = Extract<keyof T, string>;

type FilterCondition<T, K extends FieldKey<T> = FieldKey<T>> = {
  field: K;
} & (
  | {
      operator: FilterOperator.Equals;
      value: T[K];
    }
  | {
      operator: FilterOperator.In;
      value: T[K][];
    }
);

export type Filter<T> =
  | FilterCondition<T>
  | {
      or: Filter<T>[];
    }
  | {
      and: Filter<T>[];
    };

export interface Query<T> {
  filter: Filter<T>;
}

export interface PaginatedQuery<T> {
  filter?: Filter<T>;
  page?: {
    limit?: number;
    offset?: number;
  };
}
