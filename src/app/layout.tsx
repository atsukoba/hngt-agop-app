import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AGOP AI APP 2024",
  description: "AGOP AI APP 2024",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="title" content={metadata.title as string} />
        <meta name="description" content={metadata.description as string} />
        <script src="https://docs.opencv.org/4.5.5/opencv.js"></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
