"use client";

import { useEffect } from "react";

export default function DevIndicatorRemover() {
  useEffect(() => {
    // 1. Tell Next.js dev server to disable the on-screen dev indicator
    if (typeof window !== "undefined") {
      fetch("/__nextjs_disable_dev_indicator", { method: "POST" }).catch(() => {});
    }

    // 2. Remove any existing Next.js portal or dev indicator badge and extension attributes
    const cleanupPortals = () => {
      document.querySelectorAll("[bis_skin_checked]").forEach((el) => {
        el.removeAttribute("bis_skin_checked");
      });
      const portals = document.querySelectorAll("nextjs-portal, [data-nextjs-dev-overlay], [data-nextjs-toast]");
      portals.forEach((el) => {
        try {
          (el as HTMLElement).style.setProperty("display", "none", "important");
          (el as HTMLElement).style.setProperty("visibility", "hidden", "important");
          (el as HTMLElement).style.setProperty("opacity", "0", "important");
          (el as HTMLElement).style.setProperty("pointer-events", "none", "important");
          el.remove();
        } catch {
          // ignore
        }
      });
    };

    cleanupPortals();

    // 3. Keep listening with MutationObserver to instantly eliminate it if re-injected
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node instanceof HTMLElement) {
            if (node.hasAttribute("bis_skin_checked")) {
              node.removeAttribute("bis_skin_checked");
            }
            node.querySelectorAll?.("[bis_skin_checked]").forEach((el) => {
              el.removeAttribute("bis_skin_checked");
            });

            const tag = node.tagName.toLowerCase();
            if (
              tag === "nextjs-portal" ||
              node.hasAttribute("data-nextjs-dev-overlay") ||
              node.hasAttribute("data-nextjs-toast")
            ) {
              node.style.setProperty("display", "none", "important");
              node.style.setProperty("visibility", "hidden", "important");
              node.remove();
            }

            const nested = node.querySelectorAll?.("nextjs-portal, [data-nextjs-dev-overlay], [data-nextjs-toast]");
            if (nested && nested.length > 0) {
              nested.forEach((item) => {
                (item as HTMLElement).style.setProperty("display", "none", "important");
                (item as HTMLElement).style.setProperty("visibility", "hidden", "important");
                item.remove();
              });
            }
          }
        }
      }
    });

    try {
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["bis_skin_checked"] });
    } catch {
      // ignore
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
