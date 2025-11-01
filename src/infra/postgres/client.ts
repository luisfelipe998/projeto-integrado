import postgres from 'postgres';

export const sql = postgres({
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  database: process.env.DATABASE_NAME || 'library',
  username: process.env.DATABASE_USER || 'admin',
  password: process.env.DATABASE_PASSWORD || 'admin',
  ssl: false
});

export async function connect(): Promise<void> {
  await sql`SELECT 1`;
}
