-- ===============================================
-- TABLES
-- ===============================================

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
    cpf VARCHAR(14) UNIQUE NOT NULL CHECK (
        cpf ~ '^\d{3}\.\d{3}\.\d{3}-\d{2}$' OR cpf ~ '^\d{11}$'
    ),
    address VARCHAR(500) NOT NULL
);


DROP TABLE IF EXISTS books CASCADE;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL CHECK (LENGTH(TRIM(title)) > 0),
    author VARCHAR(255) NOT NULL CHECK (LENGTH(TRIM(author)) > 0),
    year INTEGER NOT NULL CHECK (year >= 1000 AND year <= EXTRACT(YEAR FROM CURRENT_DATE)),
    isbn VARCHAR(20) NOT NULL CHECK (
        isbn ~ '^[0-9\-]{10,20}$'
    )
);


DROP TABLE IF EXISTS loans CASCADE;

CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    return_date DATE,
    CONSTRAINT chk_dates CHECK (end_date > start_date),
    CONSTRAINT chk_return_date CHECK (
        return_date IS NULL OR return_date >= start_date
    )
);

-- ===============================================
-- VIEWS
-- ===============================================

CREATE OR REPLACE VIEW books_status AS
SELECT
    b.*,
    CASE
        WHEN EXISTS (
            SELECT 1 FROM loans l
            WHERE l.book_id = b.id AND l.return_date IS NULL AND CURRENT_DATE > l.end_date
        ) THEN 'late'
        WHEN EXISTS (
            SELECT 1 FROM loans l
            WHERE l.book_id = b.id AND l.return_date IS NULL
        ) THEN 'rented'
        ELSE 'available'
    END AS status
FROM books b;


CREATE OR REPLACE VIEW loan_detailed_view AS
SELECT 
    l.id,
    l.user_id AS user_id,
    b.id AS book_id,
    b.title AS book_title,
    b.author AS book_author,
    b.year AS book_year,
    b.isbn AS book_isbn,
    l.start_date,
    l.end_date,
    l.return_date,
    CASE
        WHEN l.return_date IS NOT NULL THEN 'returned'
        WHEN CURRENT_DATE > l.end_date THEN 'late'
        ELSE 'active'
    END AS status,
    CASE
        WHEN l.return_date IS NOT NULL THEN GREATEST(0, l.return_date - l.end_date)
        WHEN CURRENT_DATE > l.end_date THEN GREATEST(0, CURRENT_DATE - l.end_date)
        ELSE 0
    END AS late_days,
    CASE
        WHEN l.return_date IS NOT NULL THEN 0
        WHEN CURRENT_DATE > l.end_date THEN GREATEST(0, CURRENT_DATE - l.end_date) * 1.00
        ELSE 0
    END AS fine
FROM loans l
JOIN books b ON l.book_id = b.id;


-- ===============================================
-- FUNCTIONS E TRIGGERS
-- ===============================================

CREATE OR REPLACE FUNCTION prevent_delete_book_with_active_loans()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM loans
        WHERE book_id = OLD.id
          AND return_date IS NULL
    ) THEN
        RAISE EXCEPTION 'Cannot delete book with active or late loans'
        USING ERRCODE = 'B0001';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_delete_book
BEFORE DELETE ON books
FOR EACH ROW
EXECUTE FUNCTION prevent_delete_book_with_active_loans();


CREATE OR REPLACE FUNCTION prevent_delete_user_with_active_loans()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM loans
        WHERE user_id = OLD.id
          AND return_date IS NULL
    ) THEN
        RAISE EXCEPTION 'Cannot delete user with active or late loans'
        USING ERRCODE = 'U0001';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_delete_user
BEFORE DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION prevent_delete_user_with_active_loans();


CREATE OR REPLACE FUNCTION validate_loan_before_insert()
RETURNS TRIGGER AS $$
DECLARE
    book_is_rented BOOLEAN;
    user_has_late_loans BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM loans
        WHERE book_id = NEW.book_id
          AND return_date IS NULL
    ) INTO book_is_rented;

    IF book_is_rented THEN
        RAISE EXCEPTION 'Cannot create loan: Book is not available'
        USING ERRCODE = 'L0001';
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM loans
        WHERE user_id = NEW.user_id
          AND return_date IS NULL
          AND end_date < CURRENT_DATE
    ) INTO user_has_late_loans;

    IF user_has_late_loans THEN
        RAISE EXCEPTION 'Cannot create loan: User has late loans'
        USING ERRCODE = 'L0002';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_loan_before_insert
BEFORE INSERT ON loans
FOR EACH ROW
EXECUTE FUNCTION validate_loan_before_insert();


-- ================================================
-- PROCEDURES
-- ================================================

CREATE OR REPLACE PROCEDURE return_book(p_loan_id INTEGER)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM loans
        WHERE id = p_loan_id AND return_date IS NULL
    ) THEN
        RAISE EXCEPTION 'Loan not found or already returned'
        USING ERRCODE = 'L0003';
    END IF;

    UPDATE loans
    SET return_date = CURRENT_DATE
    WHERE id = p_loan_id;
END;
$$;


-- ===============================================
-- PRE-POPULATE DATA
-- ===============================================

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