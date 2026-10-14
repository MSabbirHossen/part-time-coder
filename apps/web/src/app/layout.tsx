import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Part-time Coder — Software Agency & Products',
  description: 'Enterprise client software delivery and proprietary software products.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
