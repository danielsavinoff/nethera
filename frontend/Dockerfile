FROM node:25-alpine AS deps

WORKDIR /usr/src/app

COPY frontend/package*.json ./
RUN npm ci

FROM deps AS dev

WORKDIR /usr/src/app

COPY frontend/. .

CMD ["npm", "run", "dev"]

FROM deps AS build

WORKDIR /usr/src/app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY frontend/. .

RUN npm run build

FROM caddy:2-alpine AS prod

COPY deploy/docker/frontend/Caddyfile /etc/caddy/Caddyfile

COPY --from=build /usr/src/app/dist /srv

EXPOSE 4000
