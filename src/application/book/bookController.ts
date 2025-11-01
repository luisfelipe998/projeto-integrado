import { Request, Response } from 'express';
import { BookRepository } from './bookRepository';
import { Book } from './book';

export class BookController {
    constructor(private bookRepository: BookRepository) {}

    getAllBooks = async (req: Request, res: Response): Promise<any> => {
        try {
            const { title, isbn, status } = req.query;
            if (title && isbn) {
                return res.status(400).json({ message: 'Please provide either title or ISBN, not both.' });
            }

            let books: Book[];

            if (title) {
                books = await this.bookRepository.getBooksByTitle(title as string, status as string);
            } else if (isbn) {
                books = await this.bookRepository.getBooksByISBN(isbn as string, status as string);
            } else {
                books = await this.bookRepository.getAllBooks(status as string);
            }

            res.status(200).json(books);
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: 'Error retrieving books', error });
        }
    }

    getBookById = async (req: Request, res: Response): Promise<any> => {
        try {
            const { id } = req.params;
            const book = await this.bookRepository.getBookById(parseInt(id));
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            res.status(200).json(book);
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: 'Error getting book by id', error });
        }
    }

    createBook = async (req: Request, res: Response): Promise<any> => {
        try {
            const book = req.body;
            const bookId = await this.bookRepository.createBook(book);
            res.status(201).json({ id: bookId });
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: 'Error creating book', error });
        }
    }

    updateBook = async (req: Request, res: Response): Promise<any> => {
        try {
            const { id } = req.params;
            const book = req.body;
            const bookId = await this.bookRepository.updateBook(parseInt(id), book);
            if (!bookId) {
                return res.status(404).json({ message: 'Book not found' });
            }
            res.status(200).json({id: bookId });
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: 'Error updating book', error });
        }
    }

    deleteBook = async (req: Request, res: Response): Promise<any> => {
        try {
            const { id } = req.params;
            const bookDeleted = await this.bookRepository.deleteBook(parseInt(id));
            if (!bookDeleted) {
                return res.status(404).json({ message: 'Book not found' });
            }
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: 'Error deleting book', error });
        }
    }
}
