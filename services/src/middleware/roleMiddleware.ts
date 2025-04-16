// Role-based access control

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';

// Assumes roles are present in the JWT payload attached by authMiddleware
// Modify 'roles' property access based on your actual JWT structure from Entra ID
// (e.g., it might be in 'roles', 'groups', or a custom claim)
const getRolesFromPayload = (payload: JwtPayload | string | undefined): string[] => {
    if (typeof payload === 'object' && payload !== null) {
        // Check common locations for roles/groups
        if (Array.isArray(payload.roles)) return payload.roles;
        if (Array.isArray(payload.groups)) return payload.groups; // If using group claims for roles
        // Add checks for other custom claims if necessary
    }
    return []; // Default to no roles if not found or payload is invalid
}

export const requireRole = (requiredRole: string): RequestHandler => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized: User not authenticated' });
            return; // Ensure no further execution
        }

        const userRoles = getRolesFromPayload(req.user);

        if (userRoles.includes(requiredRole)) {
            next(); // User has the required role, proceed
        } else {
            console.warn(`Role check failed: User roles [${userRoles.join(', ')}] required [${requiredRole}] for ${req.method} ${req.originalUrl}`);
            res.status(403).json({ message: `Forbidden: Requires '${requiredRole}' role` });
        }
    };
};