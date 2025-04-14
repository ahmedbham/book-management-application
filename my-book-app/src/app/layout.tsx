import './globals.css' // Assuming your global styles including Tailwind
    import type { Metadata } from 'next'
    import { Inter } from 'next/font/google'
    import Providers from './providers' // Import the client component provider
    import React from 'react'; // Import React for React.ReactNode type

    const inter = Inter({ subsets: ['latin'] })

    export const metadata: Metadata = { // Add Metadata type
      title: 'Book Management App',
      description: 'Manage your book collection',
    }

    // Add type for children prop
    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode
    }) {
      // Note: We don't pass the session here directly in App Router layout
      // The SessionProvider will fetch it client-side initially
      return (
        <html lang="en">
          <body className={inter.className}>
            <Providers> {/* Wrap children with the SessionProvider */}
              {/* Add header/navbar outside if needed */}
              <main>{children}</main>
              {/* Add footer outside if needed */}
            </Providers>
          </body>
        </html>
      )
    }
