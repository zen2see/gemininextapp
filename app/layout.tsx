import React from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-black">
      <body className="h-full bg-black text-gray-300">{children}</body>
    </html>
  );
}