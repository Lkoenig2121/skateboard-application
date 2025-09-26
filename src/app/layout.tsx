import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkateTube - Skateboarding & Biking Videos",
  description:
    "The ultimate platform for skateboarding and biking video content",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      style={{ margin: 0, padding: 0, backgroundColor: "#0f0f0f" }}
    >
      <body
        className={inter.className}
        style={{ margin: 0, padding: 0, backgroundColor: "#0f0f0f" }}
      >
        {children}
      </body>
    </html>
  );
}
