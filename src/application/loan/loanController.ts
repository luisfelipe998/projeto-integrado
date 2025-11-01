import { Request, Response } from 'express';
import { LoanRepository } from './loanRepository';
import { LoanStatus } from './loan';

export class LoanController {
  constructor(private loanRepository: LoanRepository) {}

  getAllLoans = async (req: Request, res: Response): Promise<any> => {
    try {
      const { bookid, status } = req.query;
      const loans = await this.loanRepository.getAllLoans(
        bookid ? parseInt(bookid as string) : undefined,
                status as LoanStatus
      );
      res.status(200).json(loans);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error retrieving loans', error });
    }
  };

  getLoanById = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const loan = await this.loanRepository.getLoanById(parseInt(id));
      if (!loan) {
        return res.status(404).json({ message: 'Loan not found' });
      }
      res.status(200).json(loan);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error getting loan by id', error });
    }
  };

  createLoan = async (req: Request, res: Response): Promise<any> => {
    try {
      const loan = req.body;
      const loanId = await this.loanRepository.createLoan(loan);
      res.status(201).json({ id: loanId });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error creating loan', error });
    }
  };

  returnLoan = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const returnedLoan = await this.loanRepository.returnLoan(parseInt(id));
      if (!returnedLoan) {
        return res.status(404).json({ message: 'Loan not found' });
      }
      res.status(200).json({ endDate: returnedLoan.endDate, lateDays: returnedLoan.lateDays, fine: returnedLoan.fine });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error updating loan', error });
    }
  };
}
