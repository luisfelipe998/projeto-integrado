import { sql } from './client';
import { Book } from '../../application/book/book';
import { BookRepository } from '../../application/book/bookRepository';

export interface BookDB {
    id: number;
    title: string;
    author: string;
    year: number;
    isbn: string;
    status: string;
}

function mapBookDBToBook(bookDB: BookDB): Book {
  return {
    id: bookDB.id,
    title: bookDB.title,
    author: bookDB.author,
    year: bookDB.year,
    isbn: bookDB.isbn,
    status: bookDB.status
  };
}

function mapBooksDBToBooks(booksDB: BookDB[]): Book[] {
  return booksDB.map(mapBookDBToBook);
}

export class PostgresBookRepository implements BookRepository {
  constructor() {}

  async getAllBooks(status: string): Promise<Book[]> {
    const result = await sql<BookDB[]>`
            SELECT *
            FROM books_status
            WHERE ${status ? sql`status = ${status}` : sql`TRUE`}
        `;
    return mapBooksDBToBooks(result);
  }

  async getBooksByTitle(title: string, status: string): Promise<Book[]> {
    const result = await sql<BookDB[]>`
            SELECT *
            FROM books_status
            WHERE title ILIKE ${'%' + title + '%'}
            AND ${status ? sql`status = ${status}` : sql`TRUE`}
        `;
    return mapBooksDBToBooks(result);
  }

  async getBooksByISBN(isbn: string, status: string): Promise<Book[]> {
    const result = await sql<BookDB[]>`
            SELECT *
            FROM books_status
            WHERE isbn = ${isbn}
            AND ${status ? sql`status = ${status}` : sql`TRUE`}
        `;
    return mapBooksDBToBooks(result);
  }

  async getBookById(id: number): Promise<Book | null> {
    const result = await sql<BookDB[]>`
            SELECT * FROM books_status WHERE id = ${id}
        `;
    return result.length > 0 ? mapBookDBToBook(result[0]) : null;
  }

  async createBook(book: Partial<Book>): Promise<number> {
    const result = await sql<BookDB[]>`
            INSERT INTO books (title, author, year, isbn)
            VALUES (${book.title}, ${book.author}, ${book.year}, ${book.isbn})
            RETURNING id
        `;
    return result[0].id;
  }

  async updateBook(id: number, book: Partial<Book>): Promise<number | null> {
    const existing = await sql<BookDB[]>`
            SELECT * FROM books WHERE id = ${id}
        `;
    
    if (existing.length === 0) {
      return null;
    }
    const current = existing[0];
    
    const updatedTitle = book.title ?? current.title;
    const updatedAuthor = book.author ?? current.author;
    const updatedYear = book.year ?? current.year;
    const updatedIsbn = book.isbn ?? current.isbn;
    
    const result = await sql<{ id: number }[]>`
            UPDATE books
            SET title = ${updatedTitle},
                author = ${updatedAuthor},
                year = ${updatedYear},
                isbn = ${updatedIsbn}
            WHERE id = ${id}
            RETURNING id
        `;
    
    return result.length > 0 ? result[0].id : null;
  }

  async deleteBook(id: number): Promise<boolean> {
    const result = await sql`
            DELETE FROM books WHERE id = ${id}
        `;
    return result.count > 0;
  }
}
