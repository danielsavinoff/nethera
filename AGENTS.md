# Repository Guidelines

## Project Structure & Module Organization
- `backend/` is a NestJS service using hexagonal architecture (dependency rule: outer layers depend inward). Core code lives in `backend/src`: `domain/` for business models/services, `application/` for use cases + ports/interfaces, and `infrastracture/` (note spelling) for adapters and wiring (`in/` HTTP/messaging, `out/` persistence/Bitrix/logging, `bootstrap/` modules). Shared packages are under `backend/libs/common`.
- Database schema and migrations are in `backend/prisma` (`schema.prisma`, `migrations/`).
- `frontend/` is a Nuxt app. Pages live in `frontend/app/pages`, shared UI in `frontend/app/components`, state in `frontend/app/stores`, composables in `frontend/app/composables`, and styles in `frontend/app/assets`.
- Static assets are in `frontend/public`, and localization files are in `frontend/i18n/locales`.

## Build, Test, and Development Commands
- Backend: `npm install` then `npm run start:dev` (watch mode), `npm run build`, `npm run lint`, `npm run test`, `npm run test:e2e`.
- Frontend: `npm install` then `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`.
- Full stack (Docker): `docker compose -f docker-compose.dev.yml up` to bring up Postgres, backend, and frontend in dev mode.

## Coding Style & Naming Conventions
- Backend is TypeScript with ESLint + Prettier. Prettier uses single quotes, trailing commas, and `printWidth: 70` (see `backend/.prettierrc`).
- Frontend uses ESLint via Nuxt. Keep formatting consistent with existing files.
- Naming patterns: `*.module.ts`, `*.service.ts`, `*.controller.ts`, `*.dto.ts`, `*.interface.ts` in backend; client-only Nuxt pages use `.client.vue` suffix in `frontend/app/pages`.

## Testing Guidelines
- Backend tests use Jest. Unit tests live alongside code as `*.spec.ts`; e2e tests live in `backend/test`.
- Run `npm run test` for unit tests and `npm run test:e2e` for e2e. No frontend test runner is configured; add one if you introduce frontend tests.

## Commit & Pull Request Guidelines
- Git history uses short, simple messages (for example “third commit”). Keep commits brief and descriptive; avoid long, multi-line formats unless needed.
- PRs should include a concise summary, testing notes (commands and results), and screenshots or GIFs for UI changes. Link relevant issues if applicable.

## Configuration & Secrets
- Local config is loaded from `.env` (used by Docker and scripts). Do not commit secrets; document required variables in the PR if new ones are added.
