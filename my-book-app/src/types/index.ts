export interface Book {
    book_id: number;
    title: string;
    author: string;
    isbn: string;
    publication_year?: number | null;
    genre?: string | null;
    quantity: number;
    created_at: string; // Represent dates as strings for simplicity
    updated_at: string;
}

// Extend next-auth session type if you added custom claims like roles
// This should match the extensions made in `app/api/auth/[...nextauth]/route.ts`
declare module "next-auth" {
    interface Session {
        accessToken?: string; // Added in backend setup example
        user?: {
            id?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            roles?: string[]; // Assuming roles are added here
        }
    }
}