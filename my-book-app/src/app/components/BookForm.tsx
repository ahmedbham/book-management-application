// Reusable form for adding/editing books.

'use client';

import React, { useState, useEffect } from 'react';
import { Book } from '@/types'; // Adjust path

// Define the type for form data, excluding generated fields
type BookFormData = Partial<Omit<Book, 'book_id' | 'created_at' | 'updated_at'>>;

interface BookFormProps {
    onSubmit: (data: BookFormData) => Promise<void>;
    initialData?: Book | null;
    isEditMode?: boolean;
}

export default function BookForm({ onSubmit, initialData = null, isEditMode = false }: BookFormProps) {
    const [formData, setFormData] = useState<BookFormData>({
        title: '',
        author: '',
        isbn: '',
        publication_year: undefined,
        genre: '',
        quantity: 1,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Pre-fill form if initialData is provided (for editing)
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                author: initialData.author || '',
                isbn: initialData.isbn || '',
                publication_year: initialData.publication_year ?? undefined,
                genre: initialData.genre || '',
                quantity: initialData.quantity || 1,
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // Handle number inputs specifically
        const processedValue = type === 'number' ? (value === '' ? undefined : parseInt(value, 10)) : value;

        setFormData(prev => ({
            ...prev,
            [name]: processedValue,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Build submissionData explicitly to avoid dynamic key issues
        const submissionData: BookFormData = {
            title: formData.title || '',
            author: formData.author || '',
            isbn: formData.isbn || '',
            quantity: formData.quantity ?? 1,
        };
        if (formData.publication_year != null) {
            submissionData.publication_year = formData.publication_year;
        }
        if (formData.genre) {
            submissionData.genre = formData.genre;
        }

        try {
            await onSubmit(submissionData);
        } catch (error) {
            console.error("Submission error caught in form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white border rounded shadow-md">
            <div>
                <label htmlFor="title" className="block mb-1 font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="author" className="block mb-1 font-medium text-gray-700">Author <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="isbn" className="block mb-1 font-medium text-gray-700">ISBN <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    id="isbn"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                    minLength={10} // Basic validation
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="publication_year" className="block mb-1 font-medium text-gray-700">Publication Year</label>
                <input
                    type="number"
                    id="publication_year"
                    name="publication_year"
                    value={formData.publication_year ?? ''} // Handle undefined for input value
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="genre" className="block mb-1 font-medium text-gray-700">Genre</label>
                <input
                    type="text"
                    id="genre"
                    name="genre"
                    value={formData.genre || ''} // Default to empty string if null or undefined
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="quantity" className="block mb-1 font-medium text-gray-700">Quantity <span className="text-red-500">*</span></label>
                <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="0" // Quantity cannot be negative
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Submitting...' : (isEditMode ? 'Update Book' : 'Add Book')}
            </button>
        </form>
    );
}