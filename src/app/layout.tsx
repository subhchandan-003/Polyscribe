import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { AppModeProvider } from "@/lib/app-mode";
import { ErrorBoundary } from "@/components/error-boundary";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PolyScribe: Multilingual AI Clinical Scribe",
  description:
    "An ambient multilingual AI scribe that turns any doctor-patient conversation into structured SOAP notes in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ErrorBoundary>
          <AppModeProvider>
            <AuthProvider>{children}</AuthProvider>
          </AppModeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
