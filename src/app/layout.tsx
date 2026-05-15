import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CreditsProvider } from "@/context/CreditsContext";
import { AuthProvider } from "@/context/AuthContext";
import { ResumesProvider } from "@/context/ResumesContext";
import PurchaseModal from "@/components/credits/PurchaseModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CVDesignerAI — Build Professional Resumes with AI",
  description: "Create ATS-optimized, professional resumes in minutes using AI. Choose from premium templates, get AI-powered suggestions, and export to PDF instantly.",
  keywords: "resume builder, AI resume, CV builder, ATS resume, professional resume, CV designer",
  openGraph: {
    title: "CVDesignerAI — Build Professional Resumes with AI",
    description: "Create ATS-optimized, professional resumes in minutes using AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <ResumesProvider>
            <CreditsProvider>
              {children}
              <PurchaseModal />
            </CreditsProvider>
          </ResumesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
