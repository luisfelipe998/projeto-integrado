import { Request, Response } from 'express';
import { BookController } from '../../src/application/book/bookController';
import { BookRepository } from '../../src/application/book/bookRepository';
import { Book } from '../../src/application/book/book';

// Mock the BookRepository
const mockBookRepository: jest.Mocked<BookRepository> = {
  getAllBooks: jest.fn(),
  getBooksByTitle: jest.fn(),
  getBooksByISBN: jest.fn(),
  getBookById: jest.fn(),
  createBook: jest.fn(),
  updateBook: jest.fn(),
  deleteBook: jest.fn(),
};

describe('BookController', () => {
  let bookController: BookController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    bookController = new BookController(mockBookRepository);
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getAllBooks', () => {
    it('should return 400 when both title and isbn are provided', async () => {
      mockRequest.query = { title: 'Test Book', isbn: '123456789' };

      await bookController.getAllBooks(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Please provide either title or ISBN, not both.'
      });
    });

    it('should get books by title when title is provided', async () => {
      const mockBooks: Book[] = [
        { id: 1, title: 'Test Book', author: 'Test Author', year: 2023, isbn: '123456789', status: 'available' }
      ];
      mockRequest.query = { title: 'Test Book', status: 'available' };
      mockBookRepository.getBooksByTitle.mockResolvedValue(mockBooks);

      await bookController.getAllBooks(mockRequest as Request, mockResponse as Response);

      expect(mockBookRepository.getBooksByTitle).toHaveBeenCalledWith('Test Book', 'available');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockBooks);
    });

    it('should get books by ISBN when isbn is provided', async () => {
      const mockBooks: Book[] = [
        { id: 1, title: 'Test Book', author: 'Test Author', year: 2023, isbn: '123456789', status: 'available' }
      ];
      mockRequest.query = { isbn: '123456789', status: 'available' };
      mockBookRepository.getBooksByISBN.mockResolvedValue(mockBooks);

      await bookController.getAllBooks(mockRequest as Request, mockResponse as Response);

      expect(mockBookRepository.getBooksByISBN).toHaveBeenCalledWith('123456789', 'available');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockBooks);
    });

    it('should get all books when no filters are provided', async () => {
      const mockBooks: Book[] = [
        { id: 1, title: 'Test Book', author: 'Test Author', year: 2023, isbn: '123456789', status: 'available' }
      ];
      mockRequest.query = { status: 'available' };
      mockBookRepository.getAllBooks.mockResolvedValue(mockBooks);

      await bookController.getAllBooks(mockRequest as Request, mockResponse as Response);

      expect(mockBookRepository.getAllBooks).toHaveBeenCalledWith('available');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockBooks);
    });

    it('should handle errors and return 400', async () => {
      const error = new Error('Database error');
      mockRequest.query = {};
      mockBookRepository.getAllBooks.mockRejectedValue(error);

      await bookController.getAllBooks(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error retrieving books',
        error
      });
    });
  });

  describe('getBookById', () => {
    it('should return book when found', async () => {
      const mockBook: Book = {
        id: 1,
        title: 'Test Book',
        author: 'Test Author',
        year: 2023,
        isbn: '123456789',
        status: 'available'
      };
      mockRequest.params = { id: '1' };
      mockBookRepository.getBookById.mockResolvedValue(mockBook);

      await bookController.getBookById(mockRequest as Request, mockResponse as Response);

      expect(mockBookRepository.getBookById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
    });

    it('should return 404 when book not found', async () => {
      mockRequest.params = { id: '1' };
      mockBookRepository.getBookById.mockResolvedValue(null);

      await bookController.getBookById(mockRequest as Request, mockResponse as Response);

      expect(mockBookRepository.getBookById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Book not found' });
    });

    it('should handle errors and return 400', async () => {
      const error = new Error('Database error');
      mockRequest.params = { id: '1' };
      mockBookRepository.getBookById.mockRejectedValue(error);

      await bookController.getBookById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error getting book by id',
        error
      });
    });
  });

  describe('createBook', () => {
    it('should create book and return 201 with id', async () => {
      const bookData = {
        title: 'New Book',
        author: 'New Author',
        year: 2023,
        isbn: '987654321',
        status: 'available'
      };
      mockRequest.body = bookData;
      mockBookRepository.createBook.mockResolvedValue(1);

      await bookController.createBook(mockRequest as Request, mockResponse as Response);

      expect(mockBookRepository.createBook).toHaveBeenCalledWith(bookData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: 1 });
    });

    it('should handle errors and return 400', async () => {
      const error = new Error('Database error');
      mockRequest.body = {};
      mockBookRepository.createBook.mockRejectedValue(error);

      await bookController.createBook(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error creating book',
        error
      });
    });
  });

  describe('updateBook', () => {
    it('should update book and return 200 with id', async () => {
      const bookData = { title: 'Updated Book' };
      mockRequest.params = { id: '1' };
      mockRequest.body = bookData;
      mockBookRepository.updateBook.mockResolvedValue(1);

      await bookController.updateBook(mockRequest as Request, mockResponse as Response);

      expect(mockBookRepository.updateBook).toHaveBeenCalledWith(1, bookData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return 404 when book not found', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { title: 'Updated Book' };
      mockBookRepository.updateBook.mockResolvedValue(null);

      await bookController.updateBook(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Book not found' });
    });

    it('should handle errors and return 400', async () => {
      const error = new Error('Database error');
      mockRequest.params = { id: '1' };
      mockRequest.body = {};
      mockBookRepository.updateBook.mockRejectedValue(error);

      await bookController.updateBook(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error updating book',
        error
      });
    });
  });

  describe('deleteBook', () => {
    it('should delete book and return 204', async () => {
      mockRequest.params = { id: '1' };
      mockBookRepository.deleteBook.mockResolvedValue(true);

      await bookController.deleteBook(mockRequest as Request, mockResponse as Response);

      expect(mockBookRepository.deleteBook).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should return 404 when book not found', async () => {
      mockRequest.params = { id: '1' };
      mockBookRepository.deleteBook.mockResolvedValue(false);

      await bookController.deleteBook(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Book not found' });
    });

    it('should handle errors and return 400', async () => {
      const error = new Error('Database error');
      mockRequest.params = { id: '1' };
      mockBookRepository.deleteBook.mockRejectedValue(error);

      await bookController.deleteBook(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error deleting book',
        error
      });
    });
  });
});
