import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import FirebaseAnalytics from "@/components/FirebaseAnalytics";
import DevIndicatorRemover from "@/components/DevIndicatorRemover";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "بوابة خدمات الغرفة - التحقق من الوثائق",
  description: "خدمة إلكترونية للتحقق من صحة الوثائق المصدقة عبر بوابة خدمات الغرفة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={`${cairo.variable} h-full antialiased`}>
      <head>
        <link rel="preload" as="image" href="/loader.gif" type="image/gif" />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans bg-[#fbfbfb] text-slate-800">
        <DevIndicatorRemover />
        <FirebaseAnalytics />
        {children}
      </body>
    </html>
  );
}

