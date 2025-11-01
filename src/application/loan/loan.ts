import { Book } from "../book/book";

export type LoanStatus = 'active' | 'late' | 'returned';

export interface LoanToCreate {
  userId: number;
  bookId: number;
  startDate: string;
  endDate: string;
}

export interface Loan {
  id?: number;
  userId: number;
  book: Omit<Book, 'status'>;
  startDate: string;
  endDate: string;
  returnDate?: string;
  status?: LoanStatus;
  lateDays?: number;
  fine?: number;
}