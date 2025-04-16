import express from 'express';
import cors from 'cors';
import { config } from './config';
import bookRoutes from './routes/bookRoutes';
import { globalErrorHandler } from './middleware/errorMiddleware';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient(); // Instantiate Prisma Client

// --- Middleware ---
// Enable CORS (configure origins appropriately for production)
app.use(cors()); // Allow all origins for now, restrict in production
// Parse JSON request bodies
app.use(express.json());
// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Book Management Service is running' });
});

// Mount book routes under /api/books
app.use('/api/books', bookRoutes);

// --- Error Handling ---
// Add the global error handler middleware *after* all routes
app.use(globalErrorHandler);

// --- Server Startup ---
const startServer = async () => {
    try {
        // Optional: Check database connection on startup
        await prisma.$connect();
        console.log('Database connection successful.');

        app.listen(config.port, () => {
            console.log(`Book Management Service listening on port ${config.port}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`Auth configured for Tenant: ${config.auth.tenantId}, Audience: ${config.auth.clientId}`);
        });
    } catch (error) {
        console.error('Failed to start server or connect to database:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing HTTP server and DB connection');
    await prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
     console.log('SIGTERM signal received: closing HTTP server and DB connection');
    await prisma.$disconnect();
    process.exit(0);
});

startServer();