'use client'; // Mark this as a Client Component

    import { SessionProvider, SessionProviderProps } from 'next-auth/react';
    import React from 'react'; // Import React for React.ReactNode type

    // Define props type, SessionProviderProps already includes children and session
    interface ProvidersProps extends SessionProviderProps {
        children: React.ReactNode; // Explicitly type children
    }

    export default function Providers({ children, session }: ProvidersProps) {
      // Pass session prop down to SessionProvider
      return (
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      );
    }