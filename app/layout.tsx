import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rozgaar AI',
  description: 'AI-powered job search platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {children}
      </body>
    </html>
  );
}
