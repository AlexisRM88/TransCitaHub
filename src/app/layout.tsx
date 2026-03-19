import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TransCita Hub",
  description: "Comunidad RSP y TransCiende",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ConvexClientProvider>
          <main className="flex-grow">
            {children}
          </main>
          <footer className="w-full text-center py-4 bg-gray-900 border-t border-gray-800 text-gray-400 text-sm mt-auto">
            Desarrollo con ☕ y ❤️ desde Puerto Rico - <a href="https://www.cabuyacreativa.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors">Cabuya Creativa</a>
          </footer>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
