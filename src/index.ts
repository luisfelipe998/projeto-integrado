import express, { NextFunction, Request, Response } from 'express';
import { UserController } from "./application/user/userController";
import { BookController } from './application/book/bookController';
import { LoanController } from './application/loan/loanController';
import { PostgresUserRepository } from './infra/postgres/userRepository';
import { PostgresBookRepository } from './infra/postgres/bookRepository';
import { PostgresLoanRepository } from './infra/postgres/loanRepository';
import { connect } from './infra/postgres/client';


const app = express();
const PORT = process.env.PORT || 3000;

const userRepository = new PostgresUserRepository();
const userController = new UserController(userRepository);

const bookRepository = new PostgresBookRepository();
const bookController = new BookController(bookRepository);

const loanRepository = new PostgresLoanRepository();
const loanController = new LoanController(loanRepository);

app.use(express.json());

app.get('/healthz', (_, res) => {
    res.status(200).json({ message: 'Server is healthy' });
});

app.get('/users', userController.getAllUsers);
app.get('/users/:id', userController.getUserById);
app.get('/users/:id/loans', userController.getUserLoans);
app.post('/users', userController.createUser);
app.delete('/users/:id', userController.deleteUser);

app.get('/books', bookController.getAllBooks);
app.get('/books/:id', bookController.getBookById);
app.post('/books', bookController.createBook);
app.put('/books/:id', bookController.updateBook);
app.delete('/books/:id', bookController.deleteBook);

app.get('/loans', loanController.getAllLoans);
app.get('/loans/:id', loanController.getLoanById);
app.post('/loans', loanController.createLoan);
app.put('/loans/:id/return', loanController.returnLoan);

app.use((err: any, req: Request, res: Response, next: NextFunction) => errorHandler(err, req, res, next));

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error('Error:', err);
  
    const message = err.message || 'Internal Server Error';
    res.status(500).json({
      error: {
        message,
        code: err.code || 'INTERNAL_SERVER_ERROR',
      },
    });
  }

const connectWithRetry = async (delay = 2000): Promise<void> => {
    try {
        await connect();
        console.log('Database connection successful');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(`Database connection failed. Retrying in ${delay / 1000} seconds...`);
        setTimeout(() => connectWithRetry(delay), delay);
    }
};

connectWithRetry();
