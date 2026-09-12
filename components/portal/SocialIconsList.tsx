"use client";

import React from "react";
import { SOCIAL_ICONS } from "@/constants/social-links";
import { SocialLinksConfig } from "@/types/portal";

export interface SocialIconsListProps {
  socialLinks?: SocialLinksConfig;
}

export function SocialIconsList({ socialLinks = {} }: SocialIconsListProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {SOCIAL_ICONS.map(({ key, label, svg }) => {
        const href =
          (socialLinks as Record<string, string | undefined>)[key] ||
          `#${label.toLowerCase()}`;
        return (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
            aria-label={label}
            className="no-underline transition-transform hover:scale-110"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="white">
              {svg}
            </svg>
          </a>
        );
      })}
    </div>
  );
}
