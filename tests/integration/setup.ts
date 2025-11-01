import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { readFileSync } from 'fs';
import { join } from 'path';
import postgres from 'postgres';

export class TestDatabase {
  private container: StartedPostgreSqlContainer | null = null;
  private sql: postgres.Sql | null = null;

  async start(): Promise<void> {
    // Start PostgreSQL container
    this.container = await new PostgreSqlContainer('postgres:15')
      .withDatabase('library')
      .withUsername('admin')
      .withPassword('admin')
      .start();

    // Create connection
    const connectionString = this.container.getConnectionUri();
    this.sql = postgres(connectionString);

    // Run initialization script
    await this.initializeDatabase();
  }

  async stop(): Promise<void> {
    if (this.sql) {
      await this.sql.end();
      this.sql = null;
    }
    if (this.container) {
      await this.container.stop();
      this.container = null;
    }
  }

  getConnectionString(): string {
    if (!this.container) {
      throw new Error('Container not started');
    }
    return this.container.getConnectionUri();
  }

  getSql(): postgres.Sql {
    if (!this.sql) {
      throw new Error('Database connection not established');
    }
    return this.sql;
  }

  private async initializeDatabase(): Promise<void> {
    if (!this.sql) {
      throw new Error('Database connection not established');
    }

    // Read and execute the initialization script
    const initScript = readFileSync(join(__dirname, '../../db/init.sql'), 'utf-8');
    
    // Execute the entire script as one transaction
    try {
      await this.sql.unsafe(initScript);
    } catch (error) {
      console.error('Error executing initialization script:', error);
      throw error;
    }
  }

  async clearDatabase(): Promise<void> {
    if (!this.sql) {
      throw new Error('Database connection not established');
    }

    // Clear all data but keep structure
    await this.sql`DELETE FROM loans`;
    await this.sql`DELETE FROM books`;
    await this.sql`DELETE FROM users`;
    
    // Reset sequences
    await this.sql`ALTER SEQUENCE users_id_seq RESTART WITH 1`;
    await this.sql`ALTER SEQUENCE books_id_seq RESTART WITH 1`;
    await this.sql`ALTER SEQUENCE loans_id_seq RESTART WITH 1`;
  }
}
