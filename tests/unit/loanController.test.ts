import { Request, Response } from 'express';
import { LoanController } from '../../src/application/loan/loanController';
import { LoanRepository } from '../../src/application/loan/loanRepository';
import { Loan, LoanStatus } from '../../src/application/loan/loan';

// Mock the LoanRepository
const mockLoanRepository: jest.Mocked<LoanRepository> = {
  getAllLoans: jest.fn(),
  getLoanById: jest.fn(),
  createLoan: jest.fn(),
  returnLoan: jest.fn(),
};

describe('LoanController', () => {
  let loanController: LoanController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    loanController = new LoanController(mockLoanRepository);
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getAllLoans', () => {
    it('should return all loans with status 200', async () => {
      const mockLoans: Loan[] = [
        {
          id: 1,
          userId: 1,
          book: { id: 1, title: 'Test Book', author: 'Test Author', year: 2023, isbn: '123456789' },
          startDate: '2023-01-01',
          endDate: '2023-01-15',
          status: 'active'
        }
      ];
      mockRequest.query = {};
      mockLoanRepository.getAllLoans.mockResolvedValue(mockLoans);

      await loanController.getAllLoans(mockRequest as Request, mockResponse as Response);

      expect(mockLoanRepository.getAllLoans).toHaveBeenCalledWith(undefined, undefined);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockLoans);
    });

    it('should filter loans by bookid when provided', async () => {
      const mockLoans: Loan[] = [
        {
          id: 1,
          userId: 1,
          book: { id: 1, title: 'Test Book', author: 'Test Author', year: 2023, isbn: '123456789' },
          startDate: '2023-01-01',
          endDate: '2023-01-15',
          status: 'active'
        }
      ];
      mockRequest.query = { bookid: '1' };
      mockLoanRepository.getAllLoans.mockResolvedValue(mockLoans);

      await loanController.getAllLoans(mockRequest as Request, mockResponse as Response);

      expect(mockLoanRepository.getAllLoans).toHaveBeenCalledWith(1, undefined);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockLoans);
    });

    it('should filter loans by status when provided', async () => {
      const mockLoans: Loan[] = [
        {
          id: 1,
          userId: 1,
          book: { id: 1, title: 'Test Book', author: 'Test Author', year: 2023, isbn: '123456789' },
          startDate: '2023-01-01',
          endDate: '2023-01-15',
          status: 'active'
        }
      ];
      mockRequest.query = { status: 'active' };
      mockLoanRepository.getAllLoans.mockResolvedValue(mockLoans);

      await loanController.getAllLoans(mockRequest as Request, mockResponse as Response);

      expect(mockLoanRepository.getAllLoans).toHaveBeenCalledWith(undefined, 'active');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockLoans);
    });

    it('should filter loans by both bookid and status when provided', async () => {
      const mockLoans: Loan[] = [
        {
          id: 1,
          userId: 1,
          book: { id: 1, title: 'Test Book', author: 'Test Author', year: 2023, isbn: '123456789' },
          startDate: '2023-01-01',
          endDate: '2023-01-15',
          status: 'active'
        }
      ];
      mockRequest.query = { bookid: '1', status: 'active' };
      mockLoanRepository.getAllLoans.mockResolvedValue(mockLoans);

      await loanController.getAllLoans(mockRequest as Request, mockResponse as Response);

      expect(mockLoanRepository.getAllLoans).toHaveBeenCalledWith(1, 'active');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockLoans);
    });

    it('should handle errors and return 400', async () => {
      const error = new Error('Database error');
      mockRequest.query = {};
      mockLoanRepository.getAllLoans.mockRejectedValue(error);

      await loanController.getAllLoans(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error retrieving loans',
        error
      });
    });
  });

  describe('getLoanById', () => {
    it('should return loan when found', async () => {
      const mockLoan: Loan = {
        id: 1,
        userId: 1,
        book: { id: 1, title: 'Test Book', author: 'Test Author', year: 2023, isbn: '123456789' },
        startDate: '2023-01-01',
        endDate: '2023-01-15',
        status: 'active'
      };
      mockRequest.params = { id: '1' };
      mockLoanRepository.getLoanById.mockResolvedValue(mockLoan);

      await loanController.getLoanById(mockRequest as Request, mockResponse as Response);

      expect(mockLoanRepository.getLoanById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockLoan);
    });

    it('should return 404 when loan not found', async () => {
      mockRequest.params = { id: '1' };
      mockLoanRepository.getLoanById.mockResolvedValue(null);

      await loanController.getLoanById(mockRequest as Request, mockResponse as Response);

      expect(mockLoanRepository.getLoanById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Loan not found' });
    });

    it('should handle errors and return 400', async () => {
      const error = new Error('Database error');
      mockRequest.params = { id: '1' };
      mockLoanRepository.getLoanById.mockRejectedValue(error);

      await loanController.getLoanById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error getting loan by id',
        error
      });
    });
  });

  describe('createLoan', () => {
    it('should create loan and return 201 with id', async () => {
      const loanData = {
        userId: 1,
        bookId: 1,
        startDate: '2023-01-01',
        endDate: '2023-01-15'
      };
      mockRequest.body = loanData;
      mockLoanRepository.createLoan.mockResolvedValue(1);

      await loanController.createLoan(mockRequest as Request, mockResponse as Response);

      expect(mockLoanRepository.createLoan).toHaveBeenCalledWith(loanData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: 1 });
    });

    it('should handle errors and return 400', async () => {
      const error = new Error('Database error');
      mockRequest.body = {};
      mockLoanRepository.createLoan.mockRejectedValue(error);

      await loanController.createLoan(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error creating loan',
        error
      });
    });
  });

  describe('returnLoan', () => {
    it('should return loan and return 200 with loan details', async () => {
      const returnedLoan: Loan = {
        id: 1,
        userId: 1,
        book: { id: 1, title: 'Test Book', author: 'Test Author', year: 2023, isbn: '123456789' },
        startDate: '2023-01-01',
        endDate: '2023-01-15',
        returnDate: '2023-01-20',
        status: 'returned',
        lateDays: 5,
        fine: 25.0
      };
      mockRequest.params = { id: '1' };
      mockLoanRepository.returnLoan.mockResolvedValue(returnedLoan);

      await loanController.returnLoan(mockRequest as Request, mockResponse as Response);

      expect(mockLoanRepository.returnLoan).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        endDate: '2023-01-15',
        lateDays: 5,
        fine: 25.0
      });
    });

    it('should return 404 when loan not found', async () => {
      mockRequest.params = { id: '1' };
      mockLoanRepository.returnLoan.mockRejectedValue(new Error('Loan not found'));

      await loanController.returnLoan(mockRequest as Request, mockResponse as Response);

      expect(mockLoanRepository.returnLoan).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error updating loan',
        error: expect.any(Error)
      });
    });

    it('should handle errors and return 400', async () => {
      const error = new Error('Database error');
      mockRequest.params = { id: '1' };
      mockLoanRepository.returnLoan.mockRejectedValue(error);

      await loanController.returnLoan(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error updating loan',
        error
      });
    });
  });
});
