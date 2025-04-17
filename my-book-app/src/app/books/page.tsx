// Displays the list of books. Uses Server Component for initial fetch.

import Link from 'next/link';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if needed
import BookListItem from '@/app/components/BookListItem'; // Adjust path
import { Book } from '@/types'; // Adjust path

async function getBooks(): Promise<Book[]> {
     // NOTE: Making authenticated API calls from Server Components is complex
     // as getSession() is client-side.
     // Option 1: Make the backend endpoint public (if acceptable).
     // Option 2: Pass token from middleware/server-side session (more involved setup).
     // Option 3: Fetch data client-side in a child component.
     // For simplicity here, we'll assume the GET /api/books endpoint is either
     // public or we fetch client-side in BookListItem. Let's try fetching here
     // assuming the endpoint allows access based on session cookie or similar
     // server-to-server auth if deployed within same infrastructure, OR
     // make it public for read access.
     // **If strict auth is needed for GET list, fetch client-side instead.**

    try {
        // Attempting fetch without explicit token - relies on backend setup
        // or making this specific endpoint less restrictive if appropriate.
        // OR: Use a dedicated internal fetcher if backend is internal.
        // For a real app needing auth here, fetch client-side.
        const books = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/books`, {
             method: 'GET',
             headers: { 'Content-Type': 'application/json' },
             cache: 'no-store', // Don't cache book list on server
        });
         if (!books.ok) {
            throw new Error(`Failed to fetch books: ${books.statusText}`);
        }
        return await books.json();
    } catch (error) {
        console.error("Error fetching books server-side:", error);
        return []; // Return empty array on error
    }
}

export default async function BooksPage() {
    const session = await getServerSession(authOptions); // Get session server-side
    const books = await getBooks();

    const isAdmin = session?.user?.roles?.includes('admin') ?? false;

    return (
        <div className="container p-4 mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Book Catalog</h1>
                {isAdmin && (
                    <Link href="/books/add" className="px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">
                        Add New Book
                    </Link>
                )}
            </div>

            {/* TODO: Add Search/Filter inputs here */}

            {books.length === 0 ? (
                <p className="text-gray-500">No books found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-gray-600 border-b">Title</th>
                                <th className="px-4 py-2 text-left text-gray-600 border-b">Author</th>
                                <th className="px-4 py-2 text-left text-gray-600 border-b">ISBN</th>
                                <th className="px-4 py-2 text-left text-gray-600 border-b">Genre</th>
                                <th className="px-4 py-2 text-left text-gray-600 border-b">Quantity</th>
                                <th className="px-4 py-2 text-left text-gray-600 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <BookListItem key={book.book_id} book={book} isAdmin={isAdmin} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
             {/* TODO: Add Pagination controls here */}
        </div>
    );
}