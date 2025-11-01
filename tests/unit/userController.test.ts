import { Request, Response } from 'express';
import { UserController } from '../../src/application/user/userController';
import { UserRepository } from '../../src/application/user/userRepository';
import { User } from '../../src/application/user/user';
import { Loan } from '../../src/application/loan/loan';

// Mock the UserRepository
const mockUserRepository: jest.Mocked<UserRepository> = {
  getAllUsers: jest.fn(),
  getUserById: jest.fn(),
  getUserLoans: jest.fn(),
  createUser: jest.fn(),
  deleteUser: jest.fn(),
};

describe('UserController', () => {
  let userController: UserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    userController = new UserController(mockUserRepository);
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users with status 200', async () => {
      const mockUsers: User[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          cpf: '12345678901',
          address: '123 Main St'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          cpf: '98765432109',
          address: '456 Oak Ave'
        }
      ];
      mockUserRepository.getAllUsers.mockResolvedValue(mockUsers);

      await userController.getAllUsers(mockRequest as Request, mockResponse as Response);

      expect(mockUserRepository.getAllUsers).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors and return 400', async () => {
      const error = new Error('Database error');
      mockUserRepository.getAllUsers.mockRejectedValue(error);

      await userController.getAllUsers(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error retrieving users',
        error
      });
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '12345678901',
        address: '123 Main St'
      };
      mockRequest.params = { id: '1' };
      mockUserRepository.getUserById.mockResolvedValue(mockUser);

      await userController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockUserRepository.getUserById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 when user not found', async () => {
      mockRequest.params = { id: '1' };
      mockUserRepository.getUserById.mockResolvedValue(null);

      await userController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockUserRepository.getUserById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle errors and return 400', async () => {
      const error = new Error('Database error');
      mockRequest.params = { id: '1' };
      mockUserRepository.getUserById.mockRejectedValue(error);

      await userController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error getting user by id',
        error
      });
    });
  });

  describe('getUserLoans', () => {
    it('should return user loans when user exists', async () => {
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
      mockRequest.params = { id: '1' };
      mockUserRepository.getUserLoans.mockResolvedValue(mockLoans);

      await userController.getUserLoans(mockRequest as Request, mockResponse as Response);

      expect(mockUserRepository.getUserLoans).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockLoans);
    });

    it('should return 404 when user not found', async () => {
      mockRequest.params = { id: '1' };
      mockUserRepository.getUserLoans.mockResolvedValue(null);

      await userController.getUserLoans(mockRequest as Request, mockResponse as Response);

      expect(mockUserRepository.getUserLoans).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle errors and return 400', async () => {
      const error = new Error('Database error');
      mockRequest.params = { id: '1' };
      mockUserRepository.getUserLoans.mockRejectedValue(error);

      await userController.getUserLoans(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error getting user loans',
        error
      });
    });
  });

  describe('createUser', () => {
    it('should create user and return 201 with id', async () => {
      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        cpf: '11111111111',
        address: '789 Pine St'
      };
      mockRequest.body = userData;
      mockUserRepository.createUser.mockResolvedValue(1);

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(mockUserRepository.createUser).toHaveBeenCalledWith(userData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: 1 });
    });

    it('should handle errors and return 400', async () => {
      const error = new Error('Database error');
      mockRequest.body = {};
      mockUserRepository.createUser.mockRejectedValue(error);

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error creating user',
        error
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete user and return 204', async () => {
      mockRequest.params = { id: '1' };
      mockUserRepository.deleteUser.mockResolvedValue(true);

      await userController.deleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockUserRepository.deleteUser).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should return 404 when user not found', async () => {
      mockRequest.params = { id: '1' };
      mockUserRepository.deleteUser.mockResolvedValue(false);

      await userController.deleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle errors and return 400', async () => {
      const error = new Error('Database error');
      mockRequest.params = { id: '1' };
      mockUserRepository.deleteUser.mockRejectedValue(error);

      await userController.deleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error deleting user',
        error
      });
    });
  });
});
