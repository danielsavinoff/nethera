import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, env } from 'prisma/config';
import { expand } from 'dotenv-expand';

const dirname = path.dirname(fileURLToPath(import.meta.url));

expand(
  dotenv.config({ path: path.resolve(dirname, '../.env') }),
);

function getOptionalEnv(name: string) {
  if (process.env[name]) {
    return process.env[name];
  }

  try {
    return env(name);
  } catch {
    return;
  }
}

function getConnectionString() {
  const server = getOptionalEnv('DATABASE_SERVER');
  const user = getOptionalEnv('DATABASE_USER');
  const pass = getOptionalEnv('DATABASE_PASS');
  const host = getOptionalEnv('DATABASE_HOST');
  const port = getOptionalEnv('DATABASE_PORT');
  const db = getOptionalEnv('DATABASE');

  if (!server || !user || !pass || !host || !port || !db) {
    return;
  }

  return `${server}://${user}:${pass}@${host}:${port}/${db}`;
}
console.log(getConnectionString());
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node prisma/seed.js',
  },
  datasource: {
    url: getConnectionString(),
  },
});
