import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Document Verification Portal",
  description: "Electronic verification service for authenticated documents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#fbfbfb] text-slate-800">
        {children}
      </body>
    </html>
  );
}

