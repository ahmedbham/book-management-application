import { Request, Response, NextFunction, RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Utility function for error handling
const handleError = (error: any, res: Response, next: NextFunction, customMessage?: string) => {
    console.error(customMessage || "An error occurred:", error);

    if (error.code === 'P2002') {
        return res.status(409).json({ message: "Conflict: Duplicate entry detected." });
    }
    if (error.code === 'P2025') {
        return res.status(404).json({ message: "Resource not found." });
    }

    // Fallback for unexpected errors
    res.status(500).json({ message: "Internal Server Error" });
    next(error);
};

// Utility function for wrapping async functions
const asyncHandler = (fn: RequestHandler): RequestHandler => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((error) => {
            next(error);
        });
    };
};

// GET /api/books - Retrieve all books (with filtering/pagination)
export const getAllBooks: RequestHandler = asyncHandler(async (req, res) => {
    const books = await prisma.book.findMany({
        orderBy: { title: 'asc' },
    });
    res.status(200).json(books);
});

// GET /api/books/:bookId - Retrieve a single book by ID
export const getBookById: RequestHandler = asyncHandler(async (req, res) => {
    const bookId = parseInt(req.params.bookId, 10);
    if (isNaN(bookId)) {
        res.status(400).json({ message: "Invalid book ID" });
        return;
    }

    const book = await prisma.book.findUnique({
        where: { book_id: bookId },
    });
    if (!book) {
        res.status(404).json({ message: `Book with ID ${bookId} not found` });
        return;
    }
    res.status(200).json(book);
});

// POST /api/books - Create a new book (Admin only)
export const createBook: RequestHandler = asyncHandler(async (req, res) => {
    const { title, author, isbn, publication_year, genre, quantity } = req.body;

    if (!title || !author || !isbn) {
        res.status(400).json({ message: "Missing required fields: title, author, or ISBN" });
        return;
    }

    const existingBook = await prisma.book.findUnique({ where: { isbn } });
    if (existingBook) {
        res.status(409).json({ message: `Book with ISBN ${isbn} already exists` });
        return;
    }

    const newBook = await prisma.book.create({
        data: { title, author, isbn, publication_year, genre, quantity },
    });
    res.status(201).json(newBook);
});

// PUT /api/books/:bookId - Update an existing book (Admin only)
export const updateBook: RequestHandler = asyncHandler(async (req, res) => {
    const bookId = parseInt(req.params.bookId, 10);
    if (isNaN(bookId)) {
        res.status(400).json({ message: "Invalid book ID" });
        return;
    }

    const updateData = req.body;
    const updatedBook = await prisma.book.update({
        where: { book_id: bookId },
        data: updateData,
    });
    res.status(200).json(updatedBook);
});

// DELETE /api/books/:bookId - Delete a book (Admin only)
export const deleteBook: RequestHandler = asyncHandler(async (req, res) => {
    const bookId = parseInt(req.params.bookId, 10);
    if (isNaN(bookId)) {
        res.status(400).json({ message: "Invalid book ID" });
        return;
    }

    await prisma.book.delete({
        where: { book_id: bookId },
    });
    res.status(204).send();
});