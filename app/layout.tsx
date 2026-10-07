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
                    var shouldFilter = function(args) {
                      var str = '';
                      for (var i = 0; i < args.length; i++) {
                        try {
                          str += ' ' + (typeof args[i] === 'object' ? (args[i] && (args[i].message || args[i].stack || JSON.stringify(args[i]))) : String(args[i] || ''));
                        } catch (_) {
                          str += ' ' + String(args[i] || '');
                        }
                      }
                      var s = str.toLowerCase();
                      return (
                        s.indexOf('bis_skin_checked') !== -1 ||
                        s.indexOf('hydrat') !== -1 ||
                        s.indexOf('browser extension') !== -1 ||
                        s.indexOf('didn\'t match the client') !== -1 ||
                        s.indexOf('won\'t be patched up') !== -1 ||
                        s.indexOf('hydration-mismatch') !== -1 ||
                        s.indexOf('content.js') !== -1 ||
                        s.indexOf('unexpected end of json input') !== -1 ||
                        s.indexOf('m_id') !== -1
                      );
                    };

                    try {
                      Object.defineProperty(console, 'error', {
                        configurable: true,
                        enumerable: true,
                        get: function() {
                          return function() {
                            var args = Array.prototype.slice.call(arguments);
                            if (shouldFilter(args)) return;
                            return origError.apply(console, args);
                          };
                        },
                        set: function(fn) {
                          origError = fn;
                        }
                      });
                    } catch (_) {
                      console.error = function() {
                        var args = Array.prototype.slice.call(arguments);
                        if (shouldFilter(args)) return;
                        return origError.apply(console, args);
                      };
                    }

                    var origWarn = console.warn;
                    console.warn = function() {
                      var args = Array.prototype.slice.call(arguments);
                      if (shouldFilter(args)) return;
                      return origWarn.apply(console, args);
                    };
                  }

                  // 4. Live MutationObserver to strip Bitdefender bis_skin_checked attributes continuously before/during hydration
                  try {
                    var mo = new MutationObserver(function(muts) {
                      for (var i = 0; i < muts.length; i++) {
                        var m = muts[i];
                        if (m.type === 'attributes' && m.attributeName === 'bis_skin_checked' && m.target && m.target.removeAttribute) {
                          m.target.removeAttribute('bis_skin_checked');
                        }
                        if (m.addedNodes) {
                          for (var j = 0; j < m.addedNodes.length; j++) {
                            var n = m.addedNodes[j];
                            if (n && n.nodeType === 1) {
                              if (n.hasAttribute && n.hasAttribute('bis_skin_checked')) {
                                n.removeAttribute('bis_skin_checked');
                              }
                              if (n.querySelectorAll) {
                                var all = n.querySelectorAll('[bis_skin_checked]');
                                for (var k = 0; k < all.length; k++) {
                                  all[k].removeAttribute('bis_skin_checked');
                                }
                              }
                            }
                          }
                        }
                      }
                    });
                    mo.observe(document.documentElement, {
                      attributes: true,
                      attributeFilter: ['bis_skin_checked'],
                      childList: true,
                      subtree: true
                    });
                  } catch (_) {}

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

