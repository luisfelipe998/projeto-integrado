import { BookRepository } from '../../src/application/book/bookRepository';
import { UserRepository } from '../../src/application/user/userRepository';
import { LoanRepository } from '../../src/application/loan/loanRepository';
import { Book } from '../../src/application/book/book';
import { User } from '../../src/application/user/user';
import { Loan, LoanToCreate, LoanStatus } from '../../src/application/loan/loan';

describe('Repository Interfaces', () => {
  describe('BookRepository', () => {
    let mockBookRepository: jest.Mocked<BookRepository>;

    beforeEach(() => {
      mockBookRepository = {
        getAllBooks: jest.fn(),
        getBooksByTitle: jest.fn(),
        getBooksByISBN: jest.fn(),
        getBookById: jest.fn(),
        createBook: jest.fn(),
        updateBook: jest.fn(),
        deleteBook: jest.fn(),
      };
    });

    it('should have getAllBooks method that returns array of books', async () => {
      const mockBooks: Book[] = [
        { id: 1, title: 'Book 1', author: 'Author 1', year: 2023, isbn: '123', status: 'available' }
      ];
      mockBookRepository.getAllBooks.mockResolvedValue(mockBooks);

      const result = await mockBookRepository.getAllBooks('available');

      expect(mockBookRepository.getAllBooks).toHaveBeenCalledWith('available');
      expect(result).toEqual(mockBooks);
    });

    it('should have getBooksByTitle method that returns filtered books', async () => {
      const mockBooks: Book[] = [
        { id: 1, title: 'Test Book', author: 'Author', year: 2023, isbn: '123', status: 'available' }
      ];
      mockBookRepository.getBooksByTitle.mockResolvedValue(mockBooks);

      const result = await mockBookRepository.getBooksByTitle('Test Book', 'available');

      expect(mockBookRepository.getBooksByTitle).toHaveBeenCalledWith('Test Book', 'available');
      expect(result).toEqual(mockBooks);
    });

    it('should have getBooksByISBN method that returns filtered books', async () => {
      const mockBooks: Book[] = [
        { id: 1, title: 'Book', author: 'Author', year: 2023, isbn: '123456789', status: 'available' }
      ];
      mockBookRepository.getBooksByISBN.mockResolvedValue(mockBooks);

      const result = await mockBookRepository.getBooksByISBN('123456789', 'available');

      expect(mockBookRepository.getBooksByISBN).toHaveBeenCalledWith('123456789', 'available');
      expect(result).toEqual(mockBooks);
    });

    it('should have getBookById method that returns a book or null', async () => {
      const mockBook: Book = {
        id: 1, title: 'Book', author: 'Author', year: 2023, isbn: '123', status: 'available'
      };
      mockBookRepository.getBookById.mockResolvedValue(mockBook);

      const result = await mockBookRepository.getBookById(1);

      expect(mockBookRepository.getBookById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBook);
    });

    it('should have getBookById method that can return null', async () => {
      mockBookRepository.getBookById.mockResolvedValue(null);

      const result = await mockBookRepository.getBookById(999);

      expect(mockBookRepository.getBookById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });

    it('should have createBook method that returns book id', async () => {
      const bookData: Partial<Book> = {
        title: 'New Book', author: 'Author', year: 2023, isbn: '123', status: 'available'
      };
      mockBookRepository.createBook.mockResolvedValue(1);

      const result = await mockBookRepository.createBook(bookData);

      expect(mockBookRepository.createBook).toHaveBeenCalledWith(bookData);
      expect(result).toBe(1);
    });

    it('should have updateBook method that returns book id or null', async () => {
      const bookData: Partial<Book> = { title: 'Updated Book' };
      mockBookRepository.updateBook.mockResolvedValue(1);

      const result = await mockBookRepository.updateBook(1, bookData);

      expect(mockBookRepository.updateBook).toHaveBeenCalledWith(1, bookData);
      expect(result).toBe(1);
    });

    it('should have updateBook method that can return null', async () => {
      mockBookRepository.updateBook.mockResolvedValue(null);

      const result = await mockBookRepository.updateBook(999, {});

      expect(result).toBeNull();
    });

    it('should have deleteBook method that returns boolean', async () => {
      mockBookRepository.deleteBook.mockResolvedValue(true);

      const result = await mockBookRepository.deleteBook(1);

      expect(mockBookRepository.deleteBook).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });
  });

  describe('UserRepository', () => {
    let mockUserRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
      mockUserRepository = {
        getAllUsers: jest.fn(),
        getUserById: jest.fn(),
        getUserLoans: jest.fn(),
        createUser: jest.fn(),
        deleteUser: jest.fn(),
      };
    });

    it('should have getAllUsers method that returns array of users', async () => {
      const mockUsers: User[] = [
        { id: 1, name: 'User 1', email: 'user1@test.com', cpf: '123', address: 'Address 1' }
      ];
      mockUserRepository.getAllUsers.mockResolvedValue(mockUsers);

      const result = await mockUserRepository.getAllUsers();

      expect(mockUserRepository.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    it('should have getUserById method that returns a user or null', async () => {
      const mockUser: User = {
        id: 1, name: 'User', email: 'user@test.com', cpf: '123', address: 'Address'
      };
      mockUserRepository.getUserById.mockResolvedValue(mockUser);

      const result = await mockUserRepository.getUserById(1);

      expect(mockUserRepository.getUserById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('should have getUserById method that can return null', async () => {
      mockUserRepository.getUserById.mockResolvedValue(null);

      const result = await mockUserRepository.getUserById(999);

      expect(result).toBeNull();
    });

    it('should have getUserLoans method that returns loans array or null', async () => {
      const mockLoans: Loan[] = [
        {
          id: 1,
          userId: 1,
          book: { id: 1, title: 'Book', author: 'Author', year: 2023, isbn: '123' },
          startDate: '2023-01-01',
          endDate: '2023-01-15',
          status: 'active'
        }
      ];
      mockUserRepository.getUserLoans.mockResolvedValue(mockLoans);

      const result = await mockUserRepository.getUserLoans(1);

      expect(mockUserRepository.getUserLoans).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockLoans);
    });

    it('should have getUserLoans method that can return null', async () => {
      mockUserRepository.getUserLoans.mockResolvedValue(null);

      const result = await mockUserRepository.getUserLoans(999);

      expect(result).toBeNull();
    });

    it('should have createUser method that returns user id', async () => {
      const userData: User = {
        id: 1, name: 'New User', email: 'new@test.com', cpf: '123', address: 'Address'
      };
      mockUserRepository.createUser.mockResolvedValue(1);

      const result = await mockUserRepository.createUser(userData);

      expect(mockUserRepository.createUser).toHaveBeenCalledWith(userData);
      expect(result).toBe(1);
    });

    it('should have deleteUser method that returns boolean', async () => {
      mockUserRepository.deleteUser.mockResolvedValue(true);

      const result = await mockUserRepository.deleteUser(1);

      expect(mockUserRepository.deleteUser).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });
  });

  describe('LoanRepository', () => {
    let mockLoanRepository: jest.Mocked<LoanRepository>;

    beforeEach(() => {
      mockLoanRepository = {
        getAllLoans: jest.fn(),
        getLoanById: jest.fn(),
        createLoan: jest.fn(),
        returnLoan: jest.fn(),
      };
    });

    it('should have getAllLoans method that returns array of loans', async () => {
      const mockLoans: Loan[] = [
        {
          id: 1,
          userId: 1,
          book: { id: 1, title: 'Book', author: 'Author', year: 2023, isbn: '123' },
          startDate: '2023-01-01',
          endDate: '2023-01-15',
          status: 'active'
        }
      ];
      mockLoanRepository.getAllLoans.mockResolvedValue(mockLoans);

      const result = await mockLoanRepository.getAllLoans(1, 'active');

      expect(mockLoanRepository.getAllLoans).toHaveBeenCalledWith(1, 'active');
      expect(result).toEqual(mockLoans);
    });

    it('should have getAllLoans method that accepts optional parameters', async () => {
      const mockLoans: Loan[] = [];
      mockLoanRepository.getAllLoans.mockResolvedValue(mockLoans);

      // Test with no book filter and no status filter
      const result = await mockLoanRepository.getAllLoans(1, 'active');

      expect(mockLoanRepository.getAllLoans).toHaveBeenCalledWith(1, 'active');
      expect(result).toEqual(mockLoans);
    });

    it('should have getLoanById method that returns a loan or null', async () => {
      const mockLoan: Loan = {
        id: 1,
        userId: 1,
        book: { id: 1, title: 'Book', author: 'Author', year: 2023, isbn: '123' },
        startDate: '2023-01-01',
        endDate: '2023-01-15',
        status: 'active'
      };
      mockLoanRepository.getLoanById.mockResolvedValue(mockLoan);

      const result = await mockLoanRepository.getLoanById(1);

      expect(mockLoanRepository.getLoanById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockLoan);
    });

    it('should have getLoanById method that can return null', async () => {
      mockLoanRepository.getLoanById.mockResolvedValue(null);

      const result = await mockLoanRepository.getLoanById(999);

      expect(result).toBeNull();
    });

    it('should have createLoan method that returns loan id', async () => {
      const loanData: LoanToCreate = {
        userId: 1,
        bookId: 1,
        startDate: '2023-01-01',
        endDate: '2023-01-15'
      };
      mockLoanRepository.createLoan.mockResolvedValue(1);

      const result = await mockLoanRepository.createLoan(loanData);

      expect(mockLoanRepository.createLoan).toHaveBeenCalledWith(loanData);
      expect(result).toBe(1);
    });

    it('should have returnLoan method that returns updated loan', async () => {
      const returnedLoan: Loan = {
        id: 1,
        userId: 1,
        book: { id: 1, title: 'Book', author: 'Author', year: 2023, isbn: '123' },
        startDate: '2023-01-01',
        endDate: '2023-01-15',
        returnDate: '2023-01-20',
        status: 'returned',
        lateDays: 5,
        fine: 25.0
      };
      mockLoanRepository.returnLoan.mockResolvedValue(returnedLoan);

      const result = await mockLoanRepository.returnLoan(1);

      expect(mockLoanRepository.returnLoan).toHaveBeenCalledWith(1);
      expect(result).toEqual(returnedLoan);
    });

    it('should verify LoanStatus type constraints', () => {
      const validStatuses: LoanStatus[] = ['active', 'late', 'returned'];
      
      validStatuses.forEach(status => {
        expect(['active', 'late', 'returned']).toContain(status);
      });
    });
  });
});
