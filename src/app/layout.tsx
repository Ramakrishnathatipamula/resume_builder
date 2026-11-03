import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerForge — AI Career Intelligence & Resume Platform",
  description: "Production-grade, factual career intelligence and tailored resume platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0b0f19] text-[#f3f4f6]">
        {children}
      </body>
    </html>
  );
}
