import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ListingProvider } from '@/contexts/ListingContext';
import { SwapProvider } from '@/contexts/SwapContext';
import { ChatProvider } from '@/contexts/ChatContext';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'ClothSwap - Sustainable Fashion Exchange',
  description: 'Buy, sell, and swap clothes with your community',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ListingProvider>
            <SwapProvider>
              <ChatProvider>
                <Navigation />
                <main className="min-h-screen pt-16">
                  {children}
                </main>
              </ChatProvider>
            </SwapProvider>
          </ListingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
