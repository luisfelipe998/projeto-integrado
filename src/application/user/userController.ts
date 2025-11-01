import { Request, Response } from 'express';
import { UserRepository } from './userRepository';

export class UserController {
  constructor(private userRepository: UserRepository) {}

  getAllUsers = async (_: Request, res: Response): Promise<any> => {
    try {
      const users = await this.userRepository.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error retrieving users', error });
    }
  };

  getUserById = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const user = await this.userRepository.getUserById(parseInt(id));
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error getting user by id', error });
    }
  };

  getUserLoans = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const loans = await this.userRepository.getUserLoans(parseInt(id));
      if (!loans) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(loans);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error getting user loans', error });
    }
  };

  createUser = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = req.body;
      const userId = await this.userRepository.createUser(user);
      res.status(201).json({ id: userId });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error creating user', error });
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const userDeleted = await this.userRepository.deleteUser(parseInt(id));
      if (!userDeleted) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error deleting user', error });
    }
  };
}
