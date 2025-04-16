import { Request, Response, NextFunction } from 'express';

// Define a basic error shape
interface ErrorResponse {
    message: string;
    error?: any; // Include error details only in development
}

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled Error:", err); // Log the error for debugging

    const statusCode = err.statusCode || 500; // Use error's status code or default to 500
    const message = err.message || 'Internal Server Error';

    const response: ErrorResponse = { message };

    // Optionally add more error details in development environment
    if (process.env.NODE_ENV === 'development') {
        response.error = { stack: err.stack, details: err };
    }

    res.status(statusCode).json(response);
};