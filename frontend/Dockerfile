FROM node:25-alpine AS deps

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

FROM deps AS dev

WORKDIR /usr/src/app

COPY . .

CMD ["npm", "run", "dev"]

FROM deps AS build

WORKDIR /usr/src/app

COPY . .

RUN npm run build

FROM node:25-alpine AS prod

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=build /usr/src/app/.output ./.output

EXPOSE 4000

CMD ["node", ".output/server/index.mjs"]
