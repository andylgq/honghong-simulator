import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './shared/schema';

let pool: Pool | null = null;
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function loadConnectionString(): string {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Please configure .env.local with a PostgreSQL connection string.');
  }
  return connectionString;
}

function getDb() {
  if (db && pool) return db;

  const connectionString = loadConnectionString();
  pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle pg client', err);
  });

  db = drizzle(pool, { schema });
  return db;
}

function getPool(): Pool {
  getDb();
  return pool!;
}

export { getDb, getPool };
