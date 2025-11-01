import { Book } from '../../src/application/book/book';
import { User } from '../../src/application/user/user';
import { Loan, LoanToCreate, LoanStatus } from '../../src/application/loan/loan';

describe('Domain Models', () => {
  describe('Book', () => {
    it('should create a valid Book object', () => {
      const book: Book = {
        id: 1,
        title: 'Test Book',
        author: 'Test Author',
        year: 2023,
        isbn: '978-0123456789',
        status: 'available'
      };

      expect(book.id).toBe(1);
      expect(book.title).toBe('Test Book');
      expect(book.author).toBe('Test Author');
      expect(book.year).toBe(2023);
      expect(book.isbn).toBe('978-0123456789');
      expect(book.status).toBe('available');
    });

    it('should allow different status values', () => {
      const availableBook: Book = {
        id: 1,
        title: 'Available Book',
        author: 'Author',
        year: 2023,
        isbn: '123456789',
        status: 'available'
      };

      const loanedBook: Book = {
        id: 2,
        title: 'Loaned Book',
        author: 'Author',
        year: 2023,
        isbn: '987654321',
        status: 'loaned'
      };

      expect(availableBook.status).toBe('available');
      expect(loanedBook.status).toBe('loaned');
    });
  });

  describe('User', () => {
    it('should create a valid User object', () => {
      const user: User = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        cpf: '12345678901',
        address: '123 Main Street, City, State'
      };

      expect(user.id).toBe(1);
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john.doe@example.com');
      expect(user.cpf).toBe('12345678901');
      expect(user.address).toBe('123 Main Street, City, State');
    });

    it('should handle different user data', () => {
      const user: User = {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@test.com',
        cpf: '98765432109',
        address: '456 Oak Avenue'
      };

      expect(user.name).toBe('Jane Smith');
      expect(user.email).toBe('jane.smith@test.com');
      expect(user.cpf).toBe('98765432109');
    });
  });

  describe('LoanStatus', () => {
    it('should have valid loan status values', () => {
      const activeStatus: LoanStatus = 'active';
      const lateStatus: LoanStatus = 'late';
      const returnedStatus: LoanStatus = 'returned';

      expect(activeStatus).toBe('active');
      expect(lateStatus).toBe('late');
      expect(returnedStatus).toBe('returned');
    });
  });

  describe('LoanToCreate', () => {
    it('should create a valid LoanToCreate object', () => {
      const loanToCreate: LoanToCreate = {
        userId: 1,
        bookId: 2,
        startDate: '2023-01-01',
        endDate: '2023-01-15'
      };

      expect(loanToCreate.userId).toBe(1);
      expect(loanToCreate.bookId).toBe(2);
      expect(loanToCreate.startDate).toBe('2023-01-01');
      expect(loanToCreate.endDate).toBe('2023-01-15');
    });
  });

  describe('Loan', () => {
    it('should create a valid Loan object with all properties', () => {
      const loan: Loan = {
        id: 1,
        userId: 1,
        book: {
          id: 2,
          title: 'Test Book',
          author: 'Test Author',
          year: 2023,
          isbn: '978-0123456789'
        },
        startDate: '2023-01-01',
        endDate: '2023-01-15',
        returnDate: '2023-01-10',
        status: 'returned',
        lateDays: 0,
        fine: 0
      };

      expect(loan.id).toBe(1);
      expect(loan.userId).toBe(1);
      expect(loan.book.id).toBe(2);
      expect(loan.book.title).toBe('Test Book');
      expect(loan.startDate).toBe('2023-01-01');
      expect(loan.endDate).toBe('2023-01-15');
      expect(loan.returnDate).toBe('2023-01-10');
      expect(loan.status).toBe('returned');
      expect(loan.lateDays).toBe(0);
      expect(loan.fine).toBe(0);
    });

    it('should create a valid Loan object with optional properties undefined', () => {
      const loan: Loan = {
        userId: 1,
        book: {
          id: 2,
          title: 'Test Book',
          author: 'Test Author',
          year: 2023,
          isbn: '978-0123456789'
        },
        startDate: '2023-01-01',
        endDate: '2023-01-15'
      };

      expect(loan.id).toBeUndefined();
      expect(loan.userId).toBe(1);
      expect(loan.book.id).toBe(2);
      expect(loan.startDate).toBe('2023-01-01');
      expect(loan.endDate).toBe('2023-01-15');
      expect(loan.returnDate).toBeUndefined();
      expect(loan.status).toBeUndefined();
      expect(loan.lateDays).toBeUndefined();
      expect(loan.fine).toBeUndefined();
    });

    it('should create a loan with late status and fine', () => {
      const lateLoan: Loan = {
        id: 3,
        userId: 2,
        book: {
          id: 3,
          title: 'Late Book',
          author: 'Author',
          year: 2023,
          isbn: '111222333'
        },
        startDate: '2023-01-01',
        endDate: '2023-01-15',
        returnDate: '2023-01-20',
        status: 'late',
        lateDays: 5,
        fine: 25.00
      };

      expect(lateLoan.status).toBe('late');
      expect(lateLoan.lateDays).toBe(5);
      expect(lateLoan.fine).toBe(25.00);
    });

    it('should verify book object omits status property', () => {
      const loan: Loan = {
        userId: 1,
        book: {
          id: 1,
          title: 'Test Book',
          author: 'Test Author',
          year: 2023,
          isbn: '123456789'
          // Note: status property should not be present in loan.book
        },
        startDate: '2023-01-01',
        endDate: '2023-01-15'
      };

      expect(loan.book).not.toHaveProperty('status');
      expect(loan.book.id).toBe(1);
      expect(loan.book.title).toBe('Test Book');
      expect(loan.book.author).toBe('Test Author');
      expect(loan.book.year).toBe(2023);
      expect(loan.book.isbn).toBe('123456789');
    });
  });
});
