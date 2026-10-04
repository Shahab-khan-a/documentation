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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var h = window.location.href || '';
                  var p = window.location.pathname || '';
                  var s = window.location.search || '';
                  var hash = window.location.hash || '';
                  if (
                    h.indexOf('/.') !== -1 ||
                    hash.indexOf('/.') !== -1 ||
                    p === '/.' || p.endsWith('/.') ||
                    s.indexOf('documentNumber') !== -1 ||
                    s.indexOf('subscriptionNumber') !== -1 ||
                    p.indexOf('document-verification') !== -1
                  ) {
                    document.documentElement.classList.add('tujar-mode');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans bg-[#fbfbfb] text-slate-800">
        <DevIndicatorRemover />
        <FirebaseAnalytics />
        {children}
      </body>
    </html>
  );
}

