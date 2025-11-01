import { sql } from './client';
import { LoanRepository } from '../../application/loan/loanRepository';
import { Loan, LoanStatus, LoanToCreate } from '../../application/loan/loan';

export interface LoanDB {
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

function mapLoanDBToLoan(loanDB: LoanDB): Loan {
    return {
        id: loanDB.id,
        userId: loanDB.user_id,
        book: {
            id: loanDB.book_id,
            title: loanDB.book_title,
            author: loanDB.book_author,
            year: loanDB.book_year,
            isbn: loanDB.book_isbn,
        },
        startDate: loanDB.start_date,
        endDate: loanDB.end_date,
        returnDate: loanDB.return_date,
        status: loanDB.status,
        lateDays: loanDB.late_days,
        fine: loanDB.fine,
    };
}

export function mapLoansDBToLoans(loansDB: LoanDB[]): Loan[] {
    return loansDB.map(mapLoanDBToLoan);
}

export class PostgresLoanRepository implements LoanRepository {
    async getAllLoans(bookId: number, status: LoanStatus): Promise<Loan[]> {
        const result = await sql<LoanDB[]>`
      SELECT * FROM loan_detailed_view
      WHERE ${bookId ? sql`book_id = ${bookId}` : sql`TRUE`}
      AND ${status ? sql`status = ${status}` : sql`TRUE`}
    `;
        return mapLoansDBToLoans(result);
    }

    async getLoanById(id: number): Promise<Loan | null> {
        const result = await sql<LoanDB[]>`
      SELECT * FROM loan_detailed_view WHERE id = ${id}
    `;
        return result.length > 0 ? mapLoanDBToLoan(result[0]) : null;
    }

    async createLoan(loan: LoanToCreate): Promise<number> {
        const result = await sql<LoanDB[]>`
      INSERT INTO loans (user_id, book_id, start_date, end_date)
      VALUES (${loan.userId}, ${loan.bookId}, ${loan.startDate}, ${loan.endDate})
      RETURNING id
    `;
        return result[0].id;
    }

    async returnLoan(id: number): Promise<Loan | null> {
        const loanResult = await sql<LoanDB[]>`
        SELECT * FROM loan_detailed_view
        WHERE id = ${id}
    `;

        if (loanResult.length === 0) {
            return null;
        }

        await sql.unsafe(`
        CALL return_book(${id})
    `);
        return mapLoanDBToLoan(loanResult[0]);
    }

}
