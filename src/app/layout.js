import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FacultyProvider } from "@/context/facultyContext";
import AuthHeader from "@/components/AuthHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "IICS Faculty Portal",
  description:
    "Indian Institute of Computer Science - Faculty Management System",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <FacultyProvider>
      <html lang="en" className="scroll-smooth">
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-linear-to-b from-white to-gray-50 text-gray-900 antialiased`}
        >
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
            <div className=" mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
              {/* Branding */}
              <div className="flex items-center gap-10">
                <div className="flex flex-col">
                  <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    IICS
                  </h1>
                  <span className="text-[11px] uppercase tracking-[0.25em] text-gray-400 font-semibold">
                    Faculty Portal
                  </span>
                </div>
              </div>

              {/* Auth Section */}
              <AuthHeader />
            </div>
          </header>

          {/* Page Content */}
          <main className="min-h-[calc(100vh-80px)]">{children}</main>
        </body>
      </html>
      </FacultyProvider>
    </ClerkProvider>
  );
}
