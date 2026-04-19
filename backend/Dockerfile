FROM node:22-alpine AS deps

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

FROM deps AS dev

WORKDIR /usr/src/app

COPY . .

CMD ["npm", "run", "start:dev"]

FROM deps AS build

WORKDIR /usr/src/app

COPY . .

RUN npm run build

FROM node:22-alpine AS prod

WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma

CMD ["node", "dist/src/cmd/api/Main.js"]
