// JWT Validation using JWKS

import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt, { JwtPayload, GetPublicKeyOrSecret } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { config } from '../config';

// Extend Express Request type to include user payload
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload | string; // Adjust based on expected payload structure
        }
    }
}

const client = jwksClient({
    jwksUri: config.auth.jwksUri,
    cache: true, // Enable caching
    rateLimit: true // Enable rate limiting
});

// Function to get the public key from JWKS
const getKey: GetPublicKeyOrSecret = (header, callback) => {
    if (!header.kid) {
        return callback(new Error('Missing kid in token header'));
    }
    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            return callback(err);
        }
        // Provide the public key or certificate
        const signingKey = key?.getPublicKey(); // Handles both RSA and ECDSA keys
        callback(null, signingKey);
    });
};

export const authenticateToken: RequestHandler = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return; // Ensure the function returns void
    }

    jwt.verify(token, getKey, {
        audience: config.auth.clientId, // Validate audience
        issuer: config.auth.issuer,     // Validate issuer
        algorithms: ['RS256']           // Specify expected algorithms
    }, (err, decoded) => {
        if (err) {
            console.error('JWT Verification Error:', err.message);
            if (err.name === 'TokenExpiredError') {
                res.status(401).json({ message: 'Unauthorized: Token expired' });
                return; // Ensure the function returns void
            }
            res.status(403).json({ message: 'Forbidden: Invalid token' });
            return; // Ensure the function returns void
        }

        req.user = decoded;
        next();
    });
};