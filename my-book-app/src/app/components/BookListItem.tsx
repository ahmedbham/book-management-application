// Renders a single row in the book table with action buttons.

'use client'; // Needs client-side hooks for session and actions

import Link from 'next/link';
import { Book } from '@/types'; // Adjust path
import DeleteBookButton from './DeleteBookButton'; // Adjust path

interface BookListItemProps {
    book: Book;
    isAdmin: boolean; // Pass admin status down from parent
}

export default function BookListItem({ book, isAdmin }: BookListItemProps) {

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-4 py-2 border-b">{book.title}</td>
            <td className="px-4 py-2 border-b">{book.author}</td>
            <td className="px-4 py-2 border-b">{book.isbn}</td>
            <td className="px-4 py-2 border-b">{book.genre || 'N/A'}</td>
            <td className="px-4 py-2 border-b">{book.quantity}</td>
            <td className="px-4 py-2 border-b">
                <div className="flex items-center space-x-2">
                    {/* View Details Button (Optional - could link title) */}
                    <Link href={`/books/${book.book_id}`} className="text-blue-600 hover:underline">
                        View
                    </Link>
                    {isAdmin && (
                        <>
                            <Link href={`/books/edit/${book.book_id}`} className="text-green-600 hover:underline">
                                Edit
                            </Link>
                            <DeleteBookButton bookId={book.book_id} />
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
}