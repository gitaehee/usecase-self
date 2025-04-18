// src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dairy Tale",
  description: "당신의 하루가 동화가 되는 시간",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#0D0D0D] text-white antialiased`}
      >
        <header className="border-b border-neutral-800 bg-[#0D0D0D] sticky top-0 z-10">
          <nav className="max-w-4xl mx-auto flex justify-between items-center p-4">
            <Link href="/" className="text-xl font-bold text-[#F5F5F5]">
              🧚‍♀️ Dairy Tale
            </Link>
            <div className="space-x-4 text-sm text-gray-300">
              <Link href="/" className="hover:text-white transition">일기 쓰기</Link>
              <Link href="/mypage" className="hover:text-white transition">마이페이지</Link>
            </div>
          </nav>
        </header>
        <main className="pt-8 max-w-4xl mx-auto px-4">{children}</main>
      </body>
    </html>
  );
}
