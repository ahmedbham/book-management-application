'use client'; // Needs client-side session, data fetching, form handling

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import BookForm from '@/app/components/BookForm'; // Adjust path
import { Book } from '@/types'; // Adjust path
import apiClient from '@/lib/apiClient'; // Adjust path

export default function EditBookPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const bookId = params?.bookId as string; // Get bookId from route params

    const [book, setBook] = useState<Book | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isAdmin = session?.user?.roles?.includes('admin') ?? false;

    // Redirect if not admin
     useEffect(() => {
        if (status === 'loading') return;
        if (!session || !isAdmin) {
            router.replace('/');
        }
    }, [session, status, isAdmin, router]);

    // Fetch book data
    useEffect(() => {
        if (bookId && isAdmin) { // Only fetch if admin and bookId is available
            setIsLoading(true);
            apiClient<Book>(`/api/books/${bookId}`)
                .then(data => {
                    setBook(data);
                    setError(null);
                })
                .catch(err => {
                    console.error("Error fetching book details:", err);
                    setError(`Failed to load book data: ${err.message}`);
                    setBook(null);
                })
                .finally(() => setIsLoading(false));
        } else if (status === 'authenticated' && !isAdmin) {
             setIsLoading(false); // Stop loading if user is not admin
             setError("Access Denied.");
        }
    }, [bookId, isAdmin, status]); // Depend on isAdmin and status

    const handleEditBook = async (formData: Partial<Omit<Book, 'book_id' | 'created_at' | 'updated_at'>>) => {
        if (!bookId) return;
        try {
            await apiClient(`/api/books/${bookId}`, {
                method: 'PUT',
                body: JSON.stringify(formData),
            });
            alert('Book updated successfully!');
            router.push('/books');
            router.refresh();
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Failed to update book:', error);
                alert(`Error updating book: ${error.message}`);
            } else {
                console.error('Failed to update book: Unknown error');
                alert('Error updating book: Unknown error');
            }
        }
    };

    // Render loading/error states
    if (status === 'loading' || isLoading) {
         return <div className="container p-4 mx-auto text-center">Loading...</div>;
    }
     if (!session || !isAdmin || error) {
         return <div className="container p-4 mx-auto text-center text-red-600">Error: {error || "Access Denied"}</div>;
    }
    if (!book) {
         return <div className="container p-4 mx-auto text-center">Book not found.</div>;
    }


    return (
        <div className="container p-4 mx-auto">
            <h1 className="mb-6 text-3xl font-bold">Edit Book</h1>
            <BookForm onSubmit={handleEditBook} initialData={book} isEditMode={true} />
        </div>
    );
}