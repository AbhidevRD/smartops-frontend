import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "@/lib/session-context";
import { GoogleOAuthProvider } from '@react-oauth/google';
import FloatingWidgets from "@/components/FloatingWidgets";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SmartOps AI - Project Management & AI Assistant",
  description: "SmartOps AI is a modern project management platform with AI-powered features for teams",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head />
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-theme-text">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <SessionProvider>
            {children}
            <Toaster position="top-center" reverseOrder={false} />
            {/* FloatingWidgets is a 'use client' component — safe to import from Server Component */}
            <FloatingWidgets />
          </SessionProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
