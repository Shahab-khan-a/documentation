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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // 0. Neutralize bis_skin_checked injection from Bitdefender/Chrome extensions before React hydration
                  if (typeof Element !== 'undefined' && Element.prototype) {
                    var origSetAttr = Element.prototype.setAttribute;
                    Element.prototype.setAttribute = function(name, value) {
                      if (name === 'bis_skin_checked') return;
                      return origSetAttr.apply(this, arguments);
                    };
                  }

                  // 1. Suppress noisy third-party browser extension unhandled rejections (e.g. content.js JSON.parse, Urban VPN 200.js M_ID)
                  window.addEventListener('unhandledrejection', function(event) {
                    try {
                      var reason = event.reason;
                      var msg = (reason && (reason.message || String(reason))) || '';
                      var stack = (reason && reason.stack) || '';
                      if (
                        msg.indexOf('M_ID') !== -1 ||
                        msg.indexOf('Unexpected end of JSON input') !== -1 ||
                        msg.indexOf('JSON.parse') !== -1 ||
                        stack.indexOf('content.js') !== -1 ||
                        stack.indexOf('200.js') !== -1 ||
                        stack.indexOf('onGetInitConfig') !== -1 ||
                        stack.indexOf('chrome-extension://') !== -1 ||
                        stack.indexOf('moz-extension://') !== -1 ||
                        msg.indexOf('extension') !== -1
                      ) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                      }
                    } catch (_) {}
                  }, true);

                  // 2. Suppress extension runtime errors (e.g. content.js uncaught errors)
                  window.addEventListener('error', function(event) {
                    try {
                      var fn = event.filename || '';
                      var msg = event.message || '';
                      if (
                        fn.indexOf('content.js') !== -1 ||
                        fn.indexOf('200.js') !== -1 ||
                        fn.indexOf('chrome-extension://') !== -1 ||
                        msg.indexOf('Unexpected end of JSON input') !== -1 ||
                        msg.indexOf('M_ID') !== -1
                      ) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                      }
                    } catch (_) {}
                  }, true);

                  // 3. Suppress browser extension hydration mismatch noise (e.g. Bitdefender bis_skin_checked attribute injection)
                  if (typeof console !== 'undefined') {
                    var origError = console.error;
                    console.error = function() {
                      var args = Array.prototype.slice.call(arguments);
                      var str = args.map(function(a) { return String(a || ''); }).join(' ');
                      if (
                        str.indexOf('bis_skin_checked') !== -1 ||
                        (str.indexOf('hydration') !== -1 && (str.indexOf('extension') !== -1 || str.indexOf('attributes') !== -1)) ||
                        str.indexOf('content.js') !== -1 ||
                        str.indexOf('Unexpected end of JSON input') !== -1 ||
                        str.indexOf('M_ID') !== -1
                      ) {
                        return;
                      }
                      origError.apply(console, args);
                    };

                    var origWarn = console.warn;
                    console.warn = function() {
                      var args = Array.prototype.slice.call(arguments);
                      var str = args.map(function(a) { return String(a || ''); }).join(' ');
                      if (
                        str.indexOf('bis_skin_checked') !== -1 ||
                        str.indexOf('preloaded using link preload but not used') !== -1
                      ) {
                        return;
                      }
                      origWarn.apply(console, args);
                    };
                  }

                  // 4. Strip Bitdefender bis_skin_checked attributes before/during hydration
                  var cleanBis = function() {
                    try {
                      var els = document.querySelectorAll('[bis_skin_checked]');
                      for (var i = 0; i < els.length; i++) {
                        els[i].removeAttribute('bis_skin_checked');
                      }
                    } catch (_) {}
                  };
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', cleanBis);
                  } else {
                    cleanBis();
                  }

                  // 5. Global Admin Route Interceptor (Instantly redirect to /admin if /admin or #admin is typed in URL)
                  var fullHref = (window.location.href || '').toLowerCase();
                  var pathName = (window.location.pathname || '').toLowerCase();
                  var searchPart = (window.location.search || '').toLowerCase();
                  var hashPart = (window.location.hash || '').toLowerCase();

                  if (
                    pathName !== '/admin' &&
                    (
                      pathName.endsWith('/admin') ||
                      pathName.endsWith('/admin/') ||
                      pathName.indexOf('/admin') !== -1 ||
                      hashPart.indexOf('admin') !== -1 ||
                      searchPart.indexOf('/admin') !== -1 ||
                      searchPart.indexOf('admin') !== -1 ||
                      fullHref.endsWith('/admin') ||
                      fullHref.endsWith('/admin/') ||
                      fullHref.indexOf('/admin') !== -1
                    )
                  ) {
                    window.location.href = '/admin';
                    return;
                  }

                  // 6. Tujar route detection
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

