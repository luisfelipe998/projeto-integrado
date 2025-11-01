import { TestDatabase } from './setup';
import { PostgresBookRepository } from '../../src/infra/postgres/bookRepository';
import { Book } from '../../src/application/book/book';
import postgres from 'postgres';

describe('Book Integration Tests', () => {
  let testDb: TestDatabase;
  let bookRepository: PostgresBookRepository;
  let originalSql: postgres.Sql;

  beforeAll(async () => {
    testDb = new TestDatabase();
    await testDb.start();
    
    // Mock the sql client to use our test database
    originalSql = require('../../src/infra/postgres/client').sql;
    require('../../src/infra/postgres/client').sql = testDb.getSql();
    
    bookRepository = new PostgresBookRepository();
  }, 60000);

  afterAll(async () => {
    // Restore original sql client
    require('../../src/infra/postgres/client').sql = originalSql;
    await testDb.stop();
  }, 30000);

  beforeEach(async () => {
    await testDb.clearDatabase();
  });

  describe('createBook', () => {
    it('should create a new book successfully', async () => {
      const newBook = {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        year: 2008,
        isbn: '978-0132350884'
      };

      const bookId = await bookRepository.createBook(newBook);

      expect(bookId).toBe(1);
      expect(typeof bookId).toBe('number');
    });

    it('should create multiple books with incremental IDs', async () => {
      const book1 = {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        year: 2008,
        isbn: '978-0132350884'
      };

      const book2 = {
        title: 'Design Patterns',
        author: 'Erich Gamma',
        year: 1994,
        isbn: '978-0201633610'
      };

      const bookId1 = await bookRepository.createBook(book1);
      const bookId2 = await bookRepository.createBook(book2);

      expect(bookId1).toBe(1);
      expect(bookId2).toBe(2);
    });
  });

  describe('getBookById', () => {
    it('should return book when book exists', async () => {
      const newBook = {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        year: 2008,
        isbn: '978-0132350884'
      };

      const bookId = await bookRepository.createBook(newBook);
      const retrievedBook = await bookRepository.getBookById(bookId);

      expect(retrievedBook).not.toBeNull();
      expect(retrievedBook!.id).toBe(bookId);
      expect(retrievedBook!.title).toBe(newBook.title);
      expect(retrievedBook!.author).toBe(newBook.author);
      expect(retrievedBook!.year).toBe(newBook.year);
      expect(retrievedBook!.isbn).toBe(newBook.isbn);
      expect(retrievedBook!.status).toBe('available');
    });

    it('should return null when book does not exist', async () => {
      const retrievedBook = await bookRepository.getBookById(999);
      expect(retrievedBook).toBeNull();
    });
  });

  describe('getAllBooks', () => {
    it('should return empty array when no books exist', async () => {
      const books = await bookRepository.getAllBooks('');
      expect(books).toEqual([]);
    });

    it('should return all books when books exist', async () => {
      const book1 = {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        year: 2008,
        isbn: '978-0132350884'
      };

      const book2 = {
        title: 'Design Patterns',
        author: 'Erich Gamma',
        year: 1994,
        isbn: '978-0201633610'
      };

      await bookRepository.createBook(book1);
      await bookRepository.createBook(book2);

      const books = await bookRepository.getAllBooks('');

      expect(books).toHaveLength(2);
      expect(books[0].title).toBe(book1.title);
      expect(books[1].title).toBe(book2.title);
      expect(books[0].status).toBe('available');
      expect(books[1].status).toBe('available');
    });

    it('should filter books by status', async () => {
      const book1 = {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        year: 2008,
        isbn: '978-0132350884'
      };

      await bookRepository.createBook(book1);

      const availableBooks = await bookRepository.getAllBooks('available');
      const rentedBooks = await bookRepository.getAllBooks('rented');

      expect(availableBooks).toHaveLength(1);
      expect(rentedBooks).toHaveLength(0);
    });
  });

  describe('getBooksByTitle', () => {
    it('should return books matching title', async () => {
      const book1 = {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        year: 2008,
        isbn: '978-0132350884'
      };

      const book2 = {
        title: 'Design Patterns',
        author: 'Erich Gamma',
        year: 1994,
        isbn: '978-0201633610'
      };

      await bookRepository.createBook(book1);
      await bookRepository.createBook(book2);

      const cleanBooks = await bookRepository.getBooksByTitle('Clean', '');
      const designBooks = await bookRepository.getBooksByTitle('Design', '');

      expect(cleanBooks).toHaveLength(1);
      expect(cleanBooks[0].title).toBe('Clean Code');
      expect(designBooks).toHaveLength(1);
      expect(designBooks[0].title).toBe('Design Patterns');
    });

    it('should return empty array when no books match title', async () => {
      const books = await bookRepository.getBooksByTitle('Nonexistent', '');
      expect(books).toEqual([]);
    });
  });

  describe('getBooksByISBN', () => {
    it('should return books matching ISBN', async () => {
      const book1 = {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        year: 2008,
        isbn: '978-0132350884'
      };

      await bookRepository.createBook(book1);

      const books = await bookRepository.getBooksByISBN('978-0132350884', '');

      expect(books).toHaveLength(1);
      expect(books[0].isbn).toBe('978-0132350884');
    });

    it('should return empty array when no books match ISBN', async () => {
      const books = await bookRepository.getBooksByISBN('999-9999999999', '');
      expect(books).toEqual([]);
    });
  });

  describe('updateBook', () => {
    it('should update book successfully when book exists', async () => {
      const newBook = {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        year: 2008,
        isbn: '978-0132350884'
      };

      const bookId = await bookRepository.createBook(newBook);
      
      const updateData = {
        title: 'Clean Code - Updated',
        year: 2009
      };

      const updatedId = await bookRepository.updateBook(bookId, updateData);

      expect(updatedId).toBe(bookId);

      const retrievedBook = await bookRepository.getBookById(bookId);
      expect(retrievedBook!.title).toBe('Clean Code - Updated');
      expect(retrievedBook!.year).toBe(2009);
      expect(retrievedBook!.author).toBe('Robert C. Martin'); // Should remain unchanged
      expect(retrievedBook!.isbn).toBe('978-0132350884'); // Should remain unchanged
    });

    it('should return null when trying to update non-existent book', async () => {
      const updateData = {
        title: 'Updated Title'
      };

      const result = await bookRepository.updateBook(999, updateData);
      expect(result).toBeNull();
    });
  });

  describe('deleteBook', () => {
    it('should delete book successfully when book exists', async () => {
      const newBook = {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        year: 2008,
        isbn: '978-0132350884'
      };

      const bookId = await bookRepository.createBook(newBook);
      const deleteResult = await bookRepository.deleteBook(bookId);

      expect(deleteResult).toBe(true);

      const retrievedBook = await bookRepository.getBookById(bookId);
      expect(retrievedBook).toBeNull();
    });

    it('should return false when trying to delete non-existent book', async () => {
      const deleteResult = await bookRepository.deleteBook(999);
      expect(deleteResult).toBe(false);
    });
  });

  describe('book status integration', () => {
    it('should show book as rented when it has an active loan', async () => {
      // Create user
      const sql = testDb.getSql();
      const userResult = await sql`
        INSERT INTO users (name, email, cpf, address)
        VALUES ('Test User', 'test@example.com', '123.456.789-00', 'Test Address')
        RETURNING id
      `;
      const userId = userResult[0].id;

      // Create book
      const newBook = {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        year: 2008,
        isbn: '978-0132350884'
      };
      const bookId = await bookRepository.createBook(newBook);

      // Create active loan
      await sql`
        INSERT INTO loans (user_id, book_id, start_date, end_date)
        VALUES (${userId}, ${bookId}, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days')
      `;

      const retrievedBook = await bookRepository.getBookById(bookId);
      expect(retrievedBook!.status).toBe('rented');
    });

    it('should show book as available when loan is returned', async () => {
      // Create user
      const sql = testDb.getSql();
      const userResult = await sql`
        INSERT INTO users (name, email, cpf, address)
        VALUES ('Test User', 'test@example.com', '123.456.789-00', 'Test Address')
        RETURNING id
      `;
      const userId = userResult[0].id;

      // Create book
      const newBook = {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        year: 2008,
        isbn: '978-0132350884'
      };
      const bookId = await bookRepository.createBook(newBook);

      // Create returned loan
      await sql`
        INSERT INTO loans (user_id, book_id, start_date, end_date, return_date)
        VALUES (${userId}, ${bookId}, CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE, CURRENT_DATE)
      `;

      const retrievedBook = await bookRepository.getBookById(bookId);
      expect(retrievedBook!.status).toBe('available');
    });
  });
});
