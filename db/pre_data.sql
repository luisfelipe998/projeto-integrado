-- Usuários
INSERT INTO users (name, email, cpf, address) VALUES
('Alice Silva', 'alice@example.com', '123.456.789-00', 'Rua das Flores, 100, Centro'),
('Bruno Costa', 'bruno@example.com', '987.654.321-00', 'Avenida Brasil, 200, Bairro Alto'),
('Carla Souza', 'carla@example.com', '111.222.333-44', 'Rua da Paz, 150, Centro'),
('Diego Ramos', 'diego@example.com', '555.666.777-88', 'Avenida Central, 99, Bairro Novo');

-- Livros
INSERT INTO books (title, author, year, isbn) VALUES
('Clean Code', 'Robert C. Martin', 2008, '978-0132350884'),
('Design Patterns', 'Erich Gamma', 1994, '978-0201633610'),
('Refactoring', 'Martin Fowler', 1999, '978-0201485677'),
('Domain-Driven Design', 'Eric Evans', 2003, '978-0321125217'),
('The Pragmatic Programmer', 'Andrew Hunt', 1999, '978-0201616224');

-- Empréstimos
INSERT INTO loans (user_id, book_id, start_date, end_date)
VALUES (1, 1, CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '5 days');

INSERT INTO loans (user_id, book_id, start_date, end_date)
VALUES (2, 2, CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE - INTERVAL '5 days');

INSERT INTO loans (user_id, book_id, start_date, end_date)
VALUES (3, 3, CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '7 days');

INSERT INTO loans (user_id, book_id, start_date, end_date, return_date)
VALUES (4, 4, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '2 days');