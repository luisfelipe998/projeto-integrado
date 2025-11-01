import { TestDatabase } from './setup';
import { PostgresUserRepository } from '../../src/infra/postgres/userRepository';
import { User } from '../../src/application/user/user';
import postgres from 'postgres';

describe('User Integration Tests', () => {
  let testDb: TestDatabase;
  let userRepository: PostgresUserRepository;
  let originalSql: postgres.Sql;

  beforeAll(async () => {
    testDb = new TestDatabase();
    await testDb.start();
    
    // Mock the sql client to use our test database
    originalSql = require('../../src/infra/postgres/client').sql;
    require('../../src/infra/postgres/client').sql = testDb.getSql();
    
    userRepository = new PostgresUserRepository();
  }, 60000);

  afterAll(async () => {
    // Restore original sql client
    require('../../src/infra/postgres/client').sql = originalSql;
    await testDb.stop();
  }, 30000);

  beforeEach(async () => {
    await testDb.clearDatabase();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const newUser = {
        name: 'João Silva',
        email: 'joao@example.com',
        cpf: '123.456.789-00',
        address: 'Rua das Flores, 123'
      };

      const userId = await userRepository.createUser(newUser);

      expect(userId).toBe(1);
      expect(typeof userId).toBe('number');
    });

    it('should create multiple users with incremental IDs', async () => {
      const user1 = {
        name: 'João Silva',
        email: 'joao@example.com',
        cpf: '123.456.789-00',
        address: 'Rua das Flores, 123'
      };

      const user2 = {
        name: 'Maria Santos',
        email: 'maria@example.com',
        cpf: '987.654.321-00',
        address: 'Avenida Brasil, 456'
      };

      const userId1 = await userRepository.createUser(user1);
      const userId2 = await userRepository.createUser(user2);

      expect(userId1).toBe(1);
      expect(userId2).toBe(2);
    });
  });

  describe('getUserById', () => {
    it('should return user when user exists', async () => {
      const newUser = {
        name: 'João Silva',
        email: 'joao@example.com',
        cpf: '123.456.789-00',
        address: 'Rua das Flores, 123'
      };

      const userId = await userRepository.createUser(newUser);
      const retrievedUser = await userRepository.getUserById(userId);

      expect(retrievedUser).not.toBeNull();
      expect(retrievedUser!.id).toBe(userId);
      expect(retrievedUser!.name).toBe(newUser.name);
      expect(retrievedUser!.email).toBe(newUser.email);
      expect(retrievedUser!.cpf).toBe(newUser.cpf);
      expect(retrievedUser!.address).toBe(newUser.address);
    });

    it('should return null when user does not exist', async () => {
      const retrievedUser = await userRepository.getUserById(999);
      expect(retrievedUser).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('should return empty array when no users exist', async () => {
      const users = await userRepository.getAllUsers();
      expect(users).toEqual([]);
    });

    it('should return all users when users exist', async () => {
      const user1 = {
        name: 'João Silva',
        email: 'joao@example.com',
        cpf: '123.456.789-00',
        address: 'Rua das Flores, 123'
      };

      const user2 = {
        name: 'Maria Santos',
        email: 'maria@example.com',
        cpf: '987.654.321-00',
        address: 'Avenida Brasil, 456'
      };

      await userRepository.createUser(user1);
      await userRepository.createUser(user2);

      const users = await userRepository.getAllUsers();

      expect(users).toHaveLength(2);
      expect(users[0].name).toBe(user1.name);
      expect(users[1].name).toBe(user2.name);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully when user exists', async () => {
      const newUser = {
        name: 'João Silva',
        email: 'joao@example.com',
        cpf: '123.456.789-00',
        address: 'Rua das Flores, 123'
      };

      const userId = await userRepository.createUser(newUser);
      const deleteResult = await userRepository.deleteUser(userId);

      expect(deleteResult).toBe(true);

      const retrievedUser = await userRepository.getUserById(userId);
      expect(retrievedUser).toBeNull();
    });

    it('should return false when trying to delete non-existent user', async () => {
      const deleteResult = await userRepository.deleteUser(999);
      expect(deleteResult).toBe(false);
    });
  });

  describe('getUserLoans', () => {
    it('should return empty array when user has no loans', async () => {
      const newUser = {
        name: 'João Silva',
        email: 'joao@example.com',
        cpf: '123.456.789-00',
        address: 'Rua das Flores, 123'
      };

      const userId = await userRepository.createUser(newUser);
      const loans = await userRepository.getUserLoans(userId);

      expect(loans).toEqual([]);
    });

    it('should return user loans when user has loans', async () => {
      // Create user
      const newUser = {
        name: 'João Silva',
        email: 'joao@example.com',
        cpf: '123.456.789-00',
        address: 'Rua das Flores, 123'
      };
      const userId = await userRepository.createUser(newUser);

      // Create book
      const sql = testDb.getSql();
      const bookResult = await sql`
        INSERT INTO books (title, author, year, isbn)
        VALUES ('Test Book', 'Test Author', 2023, '978-0123456789')
        RETURNING id
      `;
      const bookId = bookResult[0].id;

      // Create loan
      await sql`
        INSERT INTO loans (user_id, book_id, start_date, end_date)
        VALUES (${userId}, ${bookId}, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days')
      `;

      const loans = await userRepository.getUserLoans(userId);

      expect(loans).toHaveLength(1);
      expect(loans[0].userId).toBe(userId);
      expect(loans[0].book.id).toBe(bookId);
    });
  });
});
