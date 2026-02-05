import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner"
import ConfettiProvider from "@/providers/confetti-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { I18nProviderClient } from "@/locales/client";
import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";


export const metadata: Metadata = {
  title: "EduLearn - Online Learning Platform",
  description: "Discover thousands of online courses from expert instructors. Learn new skills, advance your career, and earn certificates.",
  keywords: ["online learning", "courses", "education", "certificates", "skills", "career development"],
};

export default async function RootLayout({
  children,
  params ,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {

  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
      >
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <I18nProviderClient locale={params.locale}>
              <Navbar />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
              <Toaster />
              <ConfettiProvider />
            </I18nProviderClient>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
