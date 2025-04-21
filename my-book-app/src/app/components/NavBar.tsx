"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import AuthButton from "./AuthButton"; // Assuming AuthButton is in the same directory

export default function NavBar() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.roles?.includes("admin"); // Check if the user object and roles array exist, and if 'admin' is included in roles

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4 items-center">
          <Link href="/" className="hover:text-gray-300 font-bold text-lg">
            BookApp
          </Link>
          {status === "authenticated" && (
            <>
              <Link href="/books" className="hover:text-gray-300">
                Browse Books
              </Link>
              {/* Add Search functionality/link here if needed */}
            </>
          )}
          {isAdmin && (
            <>
              <Link href="/books/add" className="hover:text-gray-300">
                Add Book
              </Link>
              {/* Links for Update/Delete might be on specific book pages or an admin dashboard */}
            </>
          )}
        </div>
        <div>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
