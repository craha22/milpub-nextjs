import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google"
import NavBar from "@/components/layout/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Milpub AI",
  description: "AI-Powered Military Publication Search",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-zinc-900 text-white`}
      >
        <NavBar />
        {children}
      </body>
    </html>
  );
}
