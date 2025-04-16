-- liquibase formatted sql

-- changeset ahmedbham:1 context:initial_schema failOnError:true
-- comment: Create initial Books and Users tables and supporting functions/triggers

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS '
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
' LANGUAGE plpgsql;

-- Books Table Definition
CREATE TABLE Books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    publication_year SMALLINT,
    genre VARCHAR(100),
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to automatically update updated_at on Books table changes
CREATE TRIGGER set_books_timestamp
BEFORE UPDATE ON Books
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Users Table Definition
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    oidc_subject_id VARCHAR(255) UNIQUE,
    oidc_issuer VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to automatically update updated_at on Users table changes
CREATE TRIGGER set_users_timestamp
BEFORE UPDATE ON Users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Optional: Add indexes for frequently queried columns
CREATE INDEX idx_books_title ON Books (title);
CREATE INDEX idx_books_author ON Books (author);
CREATE INDEX idx_books_genre ON Books (genre);
CREATE INDEX idx_users_email ON Users (email);

-- rollback SQL statements can be added here if needed, e.g.
-- rollback DROP TABLE Books;
-- rollback DROP TABLE Users;
-- rollback DROP FUNCTION trigger_set_timestamp();
-- Note: Rollback statements are optional but recommended for complex changes.

-- changeset anotheruser:2 context:some_feature
-- comment: Add another change here in the future
-- ALTER TABLE Books ADD COLUMN some_new_field VARCHAR(50);