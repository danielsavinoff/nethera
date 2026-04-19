# Engineering Guide

## Backend

### Architecture

- Follow hexagonal architecture.
- Keep dependencies pointing inward.
- `infrastructure -> application -> domain`
- Do not depend on outer layers from inner layers.

### Stack

- NestJS, TypeScript, Prisma, Jest.

### Providers

- Third-party application ports must end with `Provider`.
- Provider fetch methods must start with `fetch`.
- Prefer `fetch`, `fetchMany`, `fetchOrThrow`.
- Fetch methods should usually `query`.
- Query interfaces must be exported.
- Query interfaces must live in the same file as the port.
- Use `Fetch{ModelName}Query` for single-record queries.
- Use `Fetch{ModelName}sQuery` for collection queries.
- Single-record queries usually contain only `filters`.
- Collection queries usually contain `filters` and `page?: { limit?: number; skip?: number }`.
- Provider create methods must be named `create()`.
- For multiple records, use `createMany()`.
- Create methods should accept `input`.
- Name create inputs `Create{text before Provider}Input`.
- For plural inputs, use the plural form.

### External Models

- Models returned from providers must start with `External`.
- Third-party ID fields must use the `external...Id` naming style.
- Third-party ID arrays must use `external...Ids`.
- Examples:
  `externalId`, `externalGroupId`, `externalParentId`.

### Repositories

- Database ports must end with `Repository`.
- Repository read methods must start with `load`.
- Use `save()` for create or update operations.

### Domain Objects

- Domain objects must expose `static hydrate(record: {DomainName}Record)`.
- Domain objects must expose `static create(props)`.
- Constructors must be `private`.
- State must be stored in a private `props` field.
- Domain objects must expose `toRecord(): {DomainName}Record`.

### Exceptions

- Prefer custom named exception classes over generic `Error`.
- Use `throw new ExampleException()`.
- Do not use `throw new Error('random exception')`.
- Exception files must be named `{Name}Exception.ts`.

### Use Cases

- Every use case must define its own command type.
- Every use case must define its own result type.
- Every use case must expose `execute(command)`.
- Result objects should expose `data`.
- Keep the main payload inside `data`.
- Add `pagination` only when needed.
- Pass use case results to presenters.

### Controllers

- Controller method names must start with `handle`.
- Controllers must stay thin.
- Controllers should call a use case and pass the result to a presenter.
- Controllers should map domain and application exceptions to HTTP exceptions.

### Dev Tips

- Build: `cd backend && npm run build`
- Lint: `cd backend && npm run lint`
- Tests: `cd backend && npm run test`
- E2E tests: `cd backend && npm run test:e2e`

## Frontend

### Stack

- Nuxt, TypeScript, Pinia, `@nuxtjs/i18n`.

### Dev Tips

- Dev server: `cd frontend && npm run dev`
- Build: `cd frontend && npm run build`
- API types: `cd frontend && npm run generate:api`
