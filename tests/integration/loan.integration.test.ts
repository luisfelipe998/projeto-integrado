import { TestDatabase } from './setup';
import { PostgresLoanRepository } from '../../src/infra/postgres/loanRepository';
import { LoanToCreate } from '../../src/application/loan/loan';
import postgres from 'postgres';

describe('Loan Integration Tests', () => {
  let testDb: TestDatabase;
  let loanRepository: PostgresLoanRepository;
  let originalSql: postgres.Sql;

  beforeAll(async () => {
    testDb = new TestDatabase();
    await testDb.start();
    
    // Mock the sql client to use our test database
    originalSql = require('../../src/infra/postgres/client').sql;
    require('../../src/infra/postgres/client').sql = testDb.getSql();
    
    loanRepository = new PostgresLoanRepository();
  }, 60000);

  afterAll(async () => {
    // Restore original sql client
    require('../../src/infra/postgres/client').sql = originalSql;
    await testDb.stop();
  }, 30000);

  beforeEach(async () => {
    await testDb.clearDatabase();
  });

  describe('createLoan', () => {
    it('should create a new loan successfully', async () => {
      // Create user
      const sql = testDb.getSql();
      const userResult = await sql`
        INSERT INTO users (name, email, cpf, address)
        VALUES ('Test User', 'test@example.com', '123.456.789-00', 'Test Address')
        RETURNING id
      `;
      const userId = userResult[0].id;

      // Create book
      const bookResult = await sql`
        INSERT INTO books (title, author, year, isbn)
        VALUES ('Test Book', 'Test Author', 2023, '978-0123456789')
        RETURNING id
      `;
      const bookId = bookResult[0].id;

      const newLoan: LoanToCreate = {
        userId: userId,
        bookId: bookId,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      const loanId = await loanRepository.createLoan(newLoan);

      expect(loanId).toBe(1);
      expect(typeof loanId).toBe('number');
    });

    it('should create multiple loans with incremental IDs', async () => {
      // Create users
      const sql = testDb.getSql();
      const user1Result = await sql`
        INSERT INTO users (name, email, cpf, address)
        VALUES ('User 1', 'user1@example.com', '123.456.789-00', 'Address 1')
        RETURNING id
      `;
      const user2Result = await sql`
        INSERT INTO users (name, email, cpf, address)
        VALUES ('User 2', 'user2@example.com', '987.654.321-00', 'Address 2')
        RETURNING id
      `;

      // Create books
      const book1Result = await sql`
        INSERT INTO books (title, author, year, isbn)
        VALUES ('Book 1', 'Author 1', 2023, '978-0123456789')
        RETURNING id
      `;
      const book2Result = await sql`
        INSERT INTO books (title, author, year, isbn)
        VALUES ('Book 2', 'Author 2', 2023, '978-9876543210')
        RETURNING id
      `;

      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const loan1: LoanToCreate = {
        userId: user1Result[0].id,
        bookId: book1Result[0].id,
        startDate: today,
        endDate: nextWeek
      };

      const loan2: LoanToCreate = {
        userId: user2Result[0].id,
        bookId: book2Result[0].id,
        startDate: today,
        endDate: nextWeek
      };

      const loanId1 = await loanRepository.createLoan(loan1);
      const loanId2 = await loanRepository.createLoan(loan2);

      expect(loanId1).toBe(1);
      expect(loanId2).toBe(2);
    });
  });

  describe('getLoanById', () => {
    it('should return loan when loan exists', async () => {
      // Create user and book
      const sql = testDb.getSql();
      const userResult = await sql`
        INSERT INTO users (name, email, cpf, address)
        VALUES ('Test User', 'test@example.com', '123.456.789-00', 'Test Address')
        RETURNING id
      `;
      const bookResult = await sql`
        INSERT INTO books (title, author, year, isbn)
        VALUES ('Test Book', 'Test Author', 2023, '978-0123456789')
        RETURNING id
      `;

      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const newLoan: LoanToCreate = {
        userId: userResult[0].id,
        bookId: bookResult[0].id,
        startDate: today,
        endDate: nextWeek
      };

      const loanId = await loanRepository.createLoan(newLoan);
      const retrievedLoan = await loanRepository.getLoanById(loanId);

      expect(retrievedLoan).not.toBeNull();
      expect(retrievedLoan!.id).toBe(loanId);
      expect(retrievedLoan!.userId).toBe(newLoan.userId);
      expect(retrievedLoan!.book.id).toBe(newLoan.bookId);
      expect(retrievedLoan!.book.title).toBe('Test Book');
      expect(retrievedLoan!.returnDate).toBeNull();
      expect(retrievedLoan!.status).toBe('active');
    });

    it('should return null when loan does not exist', async () => {
      const retrievedLoan = await loanRepository.getLoanById(999);
      expect(retrievedLoan).toBeNull();
    });
  });

  describe('getAllLoans', () => {
    it('should return empty array when no loans exist', async () => {
      const loans = await loanRepository.getAllLoans(0, null as any);
      expect(loans).toEqual([]);
    });

    it('should return all loans when loans exist', async () => {
      // Create users and books
      const sql = testDb.getSql();
      const user1Result = await sql`
        INSERT INTO users (name, email, cpf, address)
        VALUES ('User 1', 'user1@example.com', '123.456.789-00', 'Address 1')
        RETURNING id
      `;
      const user2Result = await sql`
        INSERT INTO users (name, email, cpf, address)
        VALUES ('User 2', 'user2@example.com', '987.654.321-00', 'Address 2')
        RETURNING id
      `;
      const book1Result = await sql`
        INSERT INTO books (title, author, year, isbn)
        VALUES ('Book 1', 'Author 1', 2023, '978-0123456789')
        RETURNING id
      `;
      const book2Result = await sql`
        INSERT INTO books (title, author, year, isbn)
        VALUES ('Book 2', 'Author 2', 2023, '978-9876543210')
        RETURNING id
      `;

      const loan1: LoanToCreate = {
        userId: user1Result[0].id,
        bookId: book1Result[0].id,
        startDate: '2023-01-01',
        endDate: '2023-01-08'
      };

      const loan2: LoanToCreate = {
        userId: user2Result[0].id,
        bookId: book2Result[0].id,
        startDate: '2023-01-02',
        endDate: '2023-01-09'
      };

      await loanRepository.createLoan(loan1);
      await loanRepository.createLoan(loan2);

      const loans = await loanRepository.getAllLoans(0, null as any);

      expect(loans).toHaveLength(2);
      expect(loans[0].book.title).toBe('Book 1');
      expect(loans[1].book.title).toBe('Book 2');
    });

    it('should filter loans by book ID', async () => {
      // Create users and books
      const sql = testDb.getSql();
      const user1Result = await sql`
        INSERT INTO users (name, email, cpf, address)
        VALUES ('User 1', 'user1@example.com', '123.456.789-00', 'Address 1')
        RETURNING id
      `;
      const user2Result = await sql`
        INSERT INTO users (name, email, cpf, address)
        VALUES ('User 2', 'user2@example.com', '987.654.321-00', 'Address 2')
        RETURNING id
      `;
      const book1Result = await sql`
        INSERT INTO books (title, author, year, isbn)
        VALUES ('Book 1', 'Author 1', 2023, '978-0123456789')
        RETURNING id
      `;
      const book2Result = await sql`
        INSERT INTO books (title, author, year, isbn)
        VALUES ('Book 2', 'Author 2', 2023, '978-9876543210')
        RETURNING id
      `;

      const loan1: LoanToCreate = {
        userId: user1Result[0].id,
        bookId: book1Result[0].id,
        startDate: '2023-01-01',
        endDate: '2023-01-08'
      };

      const loan2: LoanToCreate = {
        userId: user2Result[0].id,
        bookId: book2Result[0].id,
        startDate: '2023-01-02',
        endDate: '2023-01-09'
      };

      await loanRepository.createLoan(loan1);
      await loanRepository.createLoan(loan2);

      const book1Loans = await loanRepository.getAllLoans(book1Result[0].id, null as any);
      const book2Loans = await loanRepository.getAllLoans(book2Result[0].id, null as any);

      expect(book1Loans).toHaveLength(1);
      expect(book1Loans[0].book.title).toBe('Book 1');
      expect(book2Loans).toHaveLength(1);
      expect(book2Loans[0].book.title).toBe('Book 2');
    });

    it('should filter loans by status', async () => {
      // Create user and book
      const sql = testDb.getSql();
      const userResult = await sql`
        INSERT INTO users (name, email, cpf, address)
        VALUES ('Test User', 'test@example.com', '123.456.789-00', 'Test Address')
        RETURNING id
      `;
      const bookResult = await sql`
        INSERT INTO books (title, author, year, isbn)
        VALUES ('Test Book', 'Test Author', 2023, '978-0123456789')
        RETURNING id
      `;

      const activeLoan: LoanToCreate = {
        userId: userResult[0].id,
        bookId: bookResult[0].id,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      await loanRepository.createLoan(activeLoan);

      const activeLoans = await loanRepository.getAllLoans(0, 'active');
      const returnedLoans = await loanRepository.getAllLoans(0, 'returned');

      expect(activeLoans).toHaveLength(1);
      expect(returnedLoans).toHaveLength(0);
    });
  });

  describe('returnLoan', () => {
    it('should return loan successfully when loan exists and is active', async () => {
      // Create user and book
      const sql = testDb.getSql();
      const userResult = await sql`
        INSERT INTO users (name, email, cpf, address)
        VALUES ('Test User', 'test@example.com', '123.456.789-00', 'Test Address')
        RETURNING id
      `;
      const bookResult = await sql`
        INSERT INTO books (title, author, year, isbn)
        VALUES ('Test Book', 'Test Author', 2023, '978-0123456789')
        RETURNING id
      `;

      const newLoan: LoanToCreate = {
        userId: userResult[0].id,
        bookId: bookResult[0].id,
        startDate: '2023-01-01',
        endDate: '2023-01-08'
      };

      const loanId = await loanRepository.createLoan(newLoan);
      const returnedLoan = await loanRepository.returnLoan(loanId);

      expect(returnedLoan).not.toBeNull();
      expect(returnedLoan!.id).toBe(loanId);

      // Verify the loan was actually returned in the database
      const updatedLoan = await loanRepository.getLoanById(loanId);
      expect(updatedLoan!.returnDate).not.toBeNull();
      expect(updatedLoan!.status).toBe('returned');
    });

    it('should return null when trying to return non-existent loan', async () => {
      const result = await loanRepository.returnLoan(999);
      expect(result).toBeNull();
    });
  });

  describe('loan business rules integration', () => {
    it('should prevent creating loan for already rented book', async () => {
      // Create users and book
      const sql = testDb.getSql();
      const user1Result = await sql`
        INSERT INTO users (name, email, cpf, address)
        VALUES ('User 1', 'user1@example.com', '123.456.789-00', 'Address 1')
        RETURNING id
      `;
      const user2Result = await sql`
        INSERT INTO users (name, email, cpf, address)
        VALUES ('User 2', 'user2@example.com', '987.654.321-00', 'Address 2')
        RETURNING id
      `;
      const bookResult = await sql`
        INSERT INTO books (title, author, year, isbn)
        VALUES ('Test Book', 'Test Author', 2023, '978-0123456789')
        RETURNING id
      `;

      // Create first loan
      const loan1: LoanToCreate = {
        userId: user1Result[0].id,
        bookId: bookResult[0].id,
        startDate: '2023-01-01',
        endDate: '2023-01-08'
      };
      await loanRepository.createLoan(loan1);

      // Try to create second loan for same book
      const loan2: LoanToCreate = {
        userId: user2Result[0].id,
        bookId: bookResult[0].id,
        startDate: '2023-01-02',
        endDate: '2023-01-09'
      };

      await expect(loanRepository.createLoan(loan2)).rejects.toThrow();
    });

    it('should allow creating loan for book after it is returned', async () => {
      // Create users and book
      const sql = testDb.getSql();
      const user1Result = await sql`
        INSERT INTO users (name, email, cpf, address)
        VALUES ('User 1', 'user1@example.com', '123.456.789-00', 'Address 1')
        RETURNING id
      `;
      const user2Result = await sql`
        INSERT INTO users (name, email, cpf, address)
        VALUES ('User 2', 'user2@example.com', '987.654.321-00', 'Address 2')
        RETURNING id
      `;
      const bookResult = await sql`
        INSERT INTO books (title, author, year, isbn)
        VALUES ('Test Book', 'Test Author', 2023, '978-0123456789')
        RETURNING id
      `;

      // Create first loan
      const loan1: LoanToCreate = {
        userId: user1Result[0].id,
        bookId: bookResult[0].id,
        startDate: '2023-01-01',
        endDate: '2023-01-08'
      };
      const loanId1 = await loanRepository.createLoan(loan1);

      // Return first loan
      await loanRepository.returnLoan(loanId1);

      // Create second loan for same book (should succeed)
      const loan2: LoanToCreate = {
        userId: user2Result[0].id,
        bookId: bookResult[0].id,
        startDate: '2023-01-10',
        endDate: '2023-01-17'
      };

      const loanId2 = await loanRepository.createLoan(loan2);
      expect(loanId2).toBe(2);
    });
  });
});
