// Displays details for a single book.

import { Book } from '@/types'; // Adjust path

import Link from 'next/link';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path

// Fetch data server-side for the detail page
async function getBookDetails(bookId: string): Promise<Book | null> {
    // See note in BooksPage about server-side authenticated fetches.
    // Assuming GET /api/books/:id is accessible or fetching client-side is preferred.
    try {
         const book = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/books/${bookId}`, {
             method: 'GET',
             headers: { 'Content-Type': 'application/json' },
             cache: 'no-store', // Don't cache book details on server
        });
         if (book.status === 404) return null;
         if (!book.ok) {
            throw new Error(`Failed to fetch book ${bookId}: ${book.statusText}`);
        }
        return await book.json();
    } catch (error) {
        console.error(`Error fetching book ${bookId} server-side:`, error);
        return null; // Return null on error
    }
}

interface BookDetailPageProps {
    params: { bookId: string };
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
    const { bookId } = params;
    const book = await getBookDetails(bookId);
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.roles?.includes('admin') ?? false;


    if (!book) {
        return <div className="container p-4 mx-auto text-center">Book not found.</div>;
    }

    return (
        <div className="container p-4 mx-auto">
            <Link href="/books" className="mb-4 text-blue-600 hover:underline">&larr; Back to Catalog</Link>
            <div className="p-6 mt-4 bg-white border rounded shadow">
                <h1 className="mb-4 text-3xl font-bold">{book.title}</h1>
                <p className="mb-2 text-xl text-gray-700">by {book.author}</p>
                <div className="mt-4 space-y-2">
                    <p><strong>ISBN:</strong> {book.isbn}</p>
                    <p><strong>Publication Year:</strong> {book.publication_year || 'N/A'}</p>
                    <p><strong>Genre:</strong> {book.genre || 'N/A'}</p>
                    <p><strong>Quantity Available:</strong> {book.quantity}</p>
                    <p><strong>Added On:</strong> {new Date(book.created_at).toLocaleDateString()}</p>
                    <p><strong>Last Updated:</strong> {new Date(book.updated_at).toLocaleDateString()}</p>
                </div>
                 {isAdmin && (
                     <div className="mt-6">
                        <Link href={`/books/edit/${book.book_id}`} className="px-4 py-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700">
                            Edit Book
                        </Link>
                        {/* Consider adding delete button here too */}
                    </div>
                 )}
            </div>
        </div>
    );
}