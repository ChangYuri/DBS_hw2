import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import { Nav } from "@/components/layout/Nav";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-lora",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "My Diary",
  description: "A personal diary app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lora.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        <Nav />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
