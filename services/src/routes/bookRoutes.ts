// Defines routes for /api/books

import express from 'express';
import * as bookController from '../controllers/bookController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import { validateRequest, createBookSchema, updateBookSchema, bookIdParamSchema } from '../middleware/validationMiddleware';

const router = express.Router();

// Apply authentication middleware to all book routes
router.use(authenticateToken);

// Define routes and apply authorization/validation where needed

// GET /api/books - Requires user role (implicitly, as authenticateToken runs)
router.get('/', bookController.getAllBooks);

// GET /api/books/:bookId - Requires user role
router.get(
    '/:bookId',
    validateRequest(bookIdParamSchema), // Validate the bookId param
    bookController.getBookById
);

// POST /api/books - Requires admin role and validation
router.post(
    '/',
    requireRole('admin'), // Only admins can create
    validateRequest(createBookSchema), // Validate request body
    bookController.createBook
);

// PUT /api/books/:bookId - Requires admin role and validation
router.put(
    '/:bookId',
    requireRole('admin'), // Only admins can update
    validateRequest(updateBookSchema), // Validate params and body
    bookController.updateBook
);

// DELETE /api/books/:bookId - Requires admin role and validation
router.delete(
    '/:bookId',
    requireRole('admin'), // Only admins can delete
    validateRequest(bookIdParamSchema), // Validate the bookId param
    bookController.deleteBook
);

export default router;