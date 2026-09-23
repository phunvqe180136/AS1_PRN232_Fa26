import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { ToastProvider } from '@/components/Toast';

export const metadata: Metadata = {
  title: 'TaskMinder — Modern Project & Task Management',
  description: 'Enterprise Task & Project Management platform built for high-performing teams.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-800">
        <ToastProvider>
          <div className="flex min-h-screen">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content Pane */}
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1 p-6 sm:p-8 max-w-[1600px] w-full mx-auto animate-fade-in">
                {children}
              </main>
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
