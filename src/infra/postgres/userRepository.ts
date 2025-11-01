import { sql } from './client';
import { User } from '../../application/user/user';
import { UserRepository } from '@/application/user/userRepository';
import { Loan, LoanStatus } from '@/application/loan/loan';
import { LoanDB, mapLoansDBToLoans } from './loanRepository';

export interface UserDB {
    id: number;
    name: string;
    email: string;
    cpf: string;
    address: string;
}

export interface LoanWithBookDB {
    id: number;
    user_id: number;
    book_id: number;
    book_title: string;
    book_author: string;
    book_year: number;
    book_isbn: string;
    start_date: string;
    end_date: string;
    return_date: string | null;
    status: LoanStatus;
    late_days: number;
    fine: number;
}

function mapUserDBToUser(userDB: UserDB): User {
  return {
    id: userDB.id,
    name: userDB.name,
    email: userDB.email,
    cpf: userDB.cpf,
    address: userDB.address
  };
}

function mapUsersDBToUsers(usersDB: UserDB[]): User[] {
  return usersDB.map(mapUserDBToUser);
}

export class PostgresUserRepository implements UserRepository {
  async getAllUsers(): Promise<User[]> {
    const result = await sql<UserDB[]>`
            SELECT * FROM users
        `;
    return mapUsersDBToUsers(result);
  }

  async getUserById(id: number): Promise<User | null> {
    const result = await sql<UserDB[]>`
            SELECT * FROM users WHERE id = ${id}
        `;
    return result[0] ? mapUserDBToUser(result[0]) : null;
  }

  async createUser(user: Omit<User, 'id'>): Promise<number> {
    const result = await sql<UserDB[]>`
            INSERT INTO users (name, email, cpf, address)
            VALUES (${user.name}, ${user.email}, ${user.cpf}, ${user.address})
            RETURNING id
        `;
    return result[0].id;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await sql`
            DELETE FROM users WHERE id = ${id}
        `;
    return result.count > 0;
  }

  async getUserLoans(userId: number): Promise<Loan[]> {
    const result = await sql<LoanDB[]>`
            SELECT * from loan_detailed_view WHERE user_id = ${userId}
        `;
    return mapLoansDBToLoans(result);
  }
    
}
