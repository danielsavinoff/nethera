import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';
import { defineConfig, env } from 'prisma/config';
import { expand } from 'dotenv-expand';

expand(
  dotenv.config({ path: path.resolve(__dirname, '../.env') }),
);

const server = env('DATABASE_SERVER');
const user = env('DATABASE_USER');
const pass = env('DATABASE_PASS');
const host = env('DATABASE_HOST');
const port = env('DATABASE_PORT');
const db = env('DATABASE');

const connectionString = `${server}://${user}:${pass}@${host}:${port}/${db}`;

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node prisma/seed.js',
  },
  datasource: {
    url: connectionString,
  },
});
