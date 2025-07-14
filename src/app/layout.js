"use client";

import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import './globals.css';




export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>

          {children}
        </ClientProviders>
      </body>
    </html>
  );
}



function ClientProviders({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}