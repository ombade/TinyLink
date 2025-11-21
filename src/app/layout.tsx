import type { Metadata } from "next";
import { ToastContainer } from 'react-toastify';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: "TinyLink - AI-Powered URL Shortener",
  description: "Shorten URLs with AI-powered suggestions, automatic categorization, and security scanning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
        <Navbar />
        <main className="min-h-[calc(100vh-64px)]">
          {children}
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
