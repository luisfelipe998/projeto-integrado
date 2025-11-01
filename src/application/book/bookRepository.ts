import { Book } from './book';

export interface BookRepository {
    getAllBooks(status: string): Promise<Book[]>;
    getBooksByTitle(title: string, status: string): Promise<Book[]>;
    getBooksByISBN(isbn: string, status: string): Promise<Book[]>;
    getBookById(id: number): Promise<Book | null>;
    createBook(book: Partial<Book>): Promise<number>;
    updateBook(id: number, book: Partial<Book>): Promise<number | null>;
    deleteBook(id: number): Promise<boolean>;
}