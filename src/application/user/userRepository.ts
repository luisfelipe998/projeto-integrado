import { Loan } from '../loan/loan';
import { User } from './user';

export interface UserRepository {
    getAllUsers(): Promise<User[]>;
    getUserById(id: number): Promise<User | null>;
    getUserLoans(id: number): Promise<Loan[] | null>;
    createUser(user: User): Promise<number>;
    deleteUser(id: number): Promise<boolean>;
}