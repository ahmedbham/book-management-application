'use client'; // Mark this as a Client Component

    import { useSession, signIn, signOut } from 'next-auth/react';

    export default function AuthButton() {
      // session object is typed by next-auth
      const { data: session, status } = useSession();

      if (status === 'loading') {
        return <button className="px-4 py-2 bg-gray-200 rounded animate-pulse">Loading...</button>;
      }

      if (session) {
        return (
          <div className="flex items-center gap-4">
            {/* Use optional chaining for potentially null user properties */}
            <span className="text-sm">Signed in as {session.user?.email ?? session.user?.name ?? 'User'}</span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        );
      }

      return (
        <button
          onClick={() => signIn('azure-ad')} // Use the provider ID (default is 'azure-ad')
          className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Sign In
        </button>
      );
    }