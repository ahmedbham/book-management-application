'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient'; // Adjust path
import DeleteConfirmationModal from './DeleteConfirmationModal'; // Adjust path

interface DeleteBookButtonProps {
    bookId: number;
    bookTitle?: string; // Optional title for modal
}

export default function DeleteBookButton({ bookId, bookTitle }: DeleteBookButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
            await apiClient(`/api/books/${bookId}`, {
                method: 'DELETE',
            });
            setIsModalOpen(false);
            alert('Book deleted successfully!'); // Replace with better notification
            // Refresh the page or parent component state to reflect deletion
            router.refresh(); // Re-fetches data for Server Components on the current route
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Failed to delete book:', error);
                alert(`Error deleting book: ${error.message}`); // Replace with better notification
            } else {
                console.error('Failed to delete book: Unknown error');
                alert('Error deleting book: Unknown error'); // Replace with better notification
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDeleting}
                aria-label={`Delete book ${bookTitle || bookId}`}
            >
                Delete
            </button>
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                bookTitle={bookTitle}
                isDeleting={isDeleting}
            />
        </>
    );
}