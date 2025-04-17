// Helper function for making authenticated API calls to the backend.

import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not defined in environment variables.');
}

interface ApiCallOptions extends RequestInit {
    includeAuth?: boolean; // Flag to include Authorization header
}

class ApiError extends Error {
    status: number;
    data?: Record<string, unknown> | string; // Use a more specific type

    constructor(message: string, status: number, data?: Record<string, unknown> | string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
        Object.setPrototypeOf(this, ApiError.prototype); // Ensure proper prototype chain
    }
}

async function apiClient<T>(
    endpoint: string,
    options: ApiCallOptions = {}
): Promise<T> {
    const { includeAuth = true, headers: customHeaders, ...restOptions } = options;
    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...customHeaders,
    };

    // Get session and add Authorization header if requested and available
    if (includeAuth) {
        try {
            const session = await getSession(); // Use client-side getSession
            if (session?.accessToken) {
                (defaultHeaders as Record<string, string>)['Authorization'] = `Bearer ${session.accessToken}`;
            } else {
                console.warn(`API call to ${endpoint} requires auth, but no access token found.`);
                throw new ApiError('Authentication required but no access token found.', 401);
            }
        } catch (error) {
            console.error('Error fetching session:', error);
            throw new ApiError('Failed to retrieve session for authentication.', 500);
        }
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: defaultHeaders,
            ...restOptions,
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                errorData = { message: 'Unable to parse error response.' };
            }
            console.error(`API Error (${response.status}): ${response.statusText}`, errorData);
            throw new ApiError(
                `API request failed with status ${response.status}: ${errorData?.message || response.statusText}`,
                response.status,
                errorData
            );
        }

        if (response.status === 204) {
            return undefined as T; // Or null, depending on expected return type
        }

        return (await response.json()) as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error; // Re-throw known ApiError
        }
        console.error('Unexpected error during API call:', error);
        throw new ApiError('Unexpected error occurred during API call.', 500);
    }
}

export default apiClient;