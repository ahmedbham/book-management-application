'use client'; // Needs to be a client component to use useSession

import { useSession } from 'next-auth/react';
// import { redirect } from 'next/navigation'; // Use for redirection in App Router client components if needed

// Define custom session type if you extended it in authOptions
interface CustomSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    roles?: string[]; // Example: Add roles if you included them
  };
  // Add other properties like accessToken if needed
  accessToken?: string;
}

export default function ProtectedPage() {
  // Provide the custom session type to useSession if needed
  const { data: session, status } = useSession({
    required: true, // Redirects unauthenticated users to sign-in page
    onUnauthenticated() {
       // Optional: Custom logic before redirect (e.g., show a message)
       // Or use redirect('/api/auth/signin?callbackUrl=/protected');
       // Note: `required: true` handles basic redirection automatically.
    }
  });

  // Cast session to your custom type if necessary for accessing extended properties
  const customSession = session as CustomSession | null;

  // Status can be 'loading', 'authenticated', 'unauthenticated'
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  // If session exists (status is 'authenticated'), render the protected content
  return (
    <div>
      <h2>Protected Area</h2>
      <p>Welcome, {customSession?.user?.name}! You can see this because you are signed in.</p>
      {/* Add admin-only content check example */}
      {/* {customSession?.user?.roles?.includes('admin') && (
        <div>Admin specific controls here...</div>
      )} */}
    </div>
  );
}