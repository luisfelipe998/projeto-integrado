import { Loan, LoanStatus, LoanToCreate } from "./loan";

export interface LoanRepository {
    getAllLoans(bookId: number, status: LoanStatus): Promise<Loan[]>;
    getLoanById(id: number): Promise<Loan | null>;
    createLoan(loan: LoanToCreate): Promise<number>;
    returnLoan(id: number): Promise<Loan>;
}