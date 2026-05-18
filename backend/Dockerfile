FROM node:25-alpine AS deps

WORKDIR /usr/src/app

COPY backend/package*.json ./
RUN npm ci --workspaces=false

FROM deps AS dev

WORKDIR /usr/src/app

COPY backend/ .

RUN npx prisma generate

CMD ["npm", "run", "start:dev"]

FROM deps AS build

WORKDIR /usr/src/app

COPY backend/ .

RUN npx prisma generate && npm run build

FROM node:25-alpine AS prod

WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY backend/package*.json ./
RUN npm ci --omit=dev --workspaces=false

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/prisma.config.ts ./prisma.config.ts
COPY --from=build /usr/src/app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma

CMD ["node", "dist/src/cmd/api/Main.js"]
