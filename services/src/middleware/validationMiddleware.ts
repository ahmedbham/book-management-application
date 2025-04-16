// Input validation using Zod

import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

// Define Zod schemas for request bodies / params

// Schema for creating a book (adjust nullability based on requirements)
export const createBookSchema = z.object({
    body: z.object({
        title: z.string({ required_error: 'Title is required' }).min(1, 'Title cannot be empty'),
        author: z.string({ required_error: 'Author is required' }).min(1, 'Author cannot be empty'),
        isbn: z.string({ required_error: 'ISBN is required' }).min(10, 'ISBN must be at least 10 characters'), // Basic length check
        publication_year: z.number().int().positive().optional().nullable(),
        genre: z.string().optional().nullable(),
        quantity: z.number().int().positive().optional().default(1)
    })
});

// Schema for updating a book (all fields optional)
export const updateBookSchema = z.object({
     params: z.object({
        bookId: z.string().refine((val) => !isNaN(parseInt(val, 10)), { message: "Book ID must be a number" })
    }),
    body: z.object({
        title: z.string().min(1, 'Title cannot be empty').optional(),
        author: z.string().min(1, 'Author cannot be empty').optional(),
        isbn: z.string().min(10, 'ISBN must be at least 10 characters').optional(),
        publication_year: z.number().int().positive().optional().nullable(),
        genre: z.string().optional().nullable(),
        quantity: z.number().int().positive().optional()
    }).partial().refine(data => Object.keys(data).length > 0, { // Ensure at least one field is being updated
        message: "Request body must contain at least one field to update",
    })
});

// Schema for book ID parameter
export const bookIdParamSchema = z.object({
    params: z.object({
        bookId: z.string().refine((val) => !isNaN(parseInt(val, 10)), { message: "Book ID must be a number" })
    })
});


// Validation middleware function
export const validateRequest = (schema: z.AnyZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Format Zod errors for a user-friendly response
                const errors = error.errors.map(e => ({ path: e.path.join('.'), message: e.message }));
                res.status(400).json({ message: 'Validation failed', errors });
            } else {
                // Handle unexpected errors
                res.status(500).json({ message: 'Internal Server Error during validation' });
            }
        }
    };
};