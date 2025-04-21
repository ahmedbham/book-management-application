// Page with form for adding a new book (Admin only).

'use client'; // Needs client-side session check and form handling

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import BookForm from '@/app/components/BookForm'; // Adjust path
import { Book } from '@/types'; // Adjust path
import apiClient from '@/lib/apiClient'; // Adjust path
import { useEffect } from 'react';

export default function AddBookPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // const isAdmin = session?.user?.roles?.includes('admin') ?? false;
    const isAdmin = true; // For testing, set to true. Replace with actual admin check.
    // Redirect if not admin or loading/unauthenticated
    useEffect(() => {
        if (status === 'loading') return; // Wait for session load
        if (!session || !isAdmin) {
            router.replace('/'); // Redirect to home or an unauthorized page
        }
    }, [session, status, isAdmin, router]);

    const handleAddBook = async (formData: Partial<Omit<Book, 'book_id' | 'created_at' | 'updated_at'>>) => {
        try {
            await apiClient('/api/books', {
                method: 'POST',
                body: JSON.stringify(formData),
                // Auth header added by apiClient
            });
            alert('Book added successfully!'); // Replace with better notification
            router.push('/books'); // Redirect to book list
            router.refresh(); // Refresh server components on the target page
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Failed to add book:', error);
                alert(`Error adding book: ${error.message}`);
            } else {
                console.error('Failed to add book: Unknown error');
                alert('Error adding book: Unknown error');
            }
        }
    };

    // Render loading or null while checking session/redirecting
    if (status === 'loading' || !session || !isAdmin) {
        return <div className="container p-4 mx-auto text-center">Loading or Redirecting...</div>; // Or a proper loading spinner
    }

    return (
        <div className="container p-4 mx-auto">
            <h1 className="mb-6 text-3xl font-bold">Add New Book</h1>
            <BookForm onSubmit={handleAddBook} />
        </div>
    );
}