"use client";

import React, { useState, useEffect, useCallback } from "react";

// =========================================================
// CUSTOMIZE YOUR DATA AND BRAND HERE
// =========================================================
const CONFIG = {
  portalTitle: "Chamber Services Portal",
  pageTitle: "Document Verification",
  backUrl: "#",
  verifyAgainUrl: "#",
  downloadUrl: "#",
  chamberName: "Yanbu",
  facilityName: "Al-Anoud Salman Shu'an Establishment",
  facilitySubName: "Al-Qahtani General Contracting",
  unifiedNumber: "7032840279",
  requestNumber: "13255887",
  requestType: "File Opening Request",
  applicantName: "Al-Anoud Salman Shu'an",
  creationDate: "06/09/2026",
  creationTime: "6:12 PM",
  amount: "35 SAR",
  expiryDate: "06/09/2027",
  expiryTime: "6:00 PM",
  commercialRegNo: "7032840279",
  requestStatus: "Approved & Active",
  devLabel: "Development & Operations",
  companyNameAr: "عالم النظم و البرامج",
  companyNameEn: "World of Systems & Software",
  supportPhone: "00966112641362",
  // Loader — local GIF asset for instant zero-latency loading
  loaderGifUrl: "/loader.gif",
  buttonLoaderGifUrl: "/button-loader.gif",
  loaderDurationMs: 10000, // 10 seconds, matching the real site's meta-refresh
  buttonLoaderDurationMs: 4000, // 4 seconds for button click animation
};

const SOCIAL = [
  {
    label: "Skype",
    svg: <path d="M12.069 18.874c-4.023 0-5.82-1.979-5.82-3.464 0-.765.561-1.296 1.333-1.296 1.723 0 1.273 2.477 4.487 2.477 1.641 0 2.55-.895 2.55-1.811 0-.551-.269-1.16-1.354-1.429l-3.576-.895c-2.88-.724-3.403-2.286-3.403-3.751 0-3.047 2.861-4.191 5.549-4.191 2.471 0 5.393 1.373 5.393 3.199 0 .784-.688 1.24-1.453 1.24-1.469 0-1.213-2.039-4.164-2.039-1.469 0-2.292.664-2.292 1.617s1.153 1.258 2.157 1.487l2.637.587c2.891.649 3.624 2.346 3.624 3.944 0 2.476-1.902 4.325-5.668 4.325zm11.931 1.37c-.302 1.686-1.715 2.986-3.411 3.289a4.888 4.888 0 0 1-.88.08 4.79 4.79 0 0 1-2.682-.814l.004.003a8.946 8.946 0 0 1-4.892 1.454C5.374 24.256.9 19.692.9 14.024c0-1.861.517-3.57 1.376-5.079A5.11 5.11 0 0 1 2.1 7.9 4.963 4.963 0 0 1 2 6.744a5.001 5.001 0 0 1 5-4.999c.637 0 1.244.124 1.803.334A9.026 9.026 0 0 1 14 .256c4.939 0 8.941 3.999 8.941 8.933 0 .568-.053 1.123-.153 1.66.328.675.513 1.433.513 2.235a4.956 4.956 0 0 1-.301 1.716v-.004z" />,
  },
  {
    label: "Instagram",
    svg: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />,
  },
  {
    label: "YouTube",
    svg: <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />,
  },
  {
    label: "Twitter",
    svg: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
  },
  {
    label: "Facebook",
    svg: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />,
  },
];

// ─────────────────────────────────────────────────────────
//  LOADER SCREEN  (exact replica of the real site's flow)
// ─────────────────────────────────────────────────────────
function LoaderScreen({
  onDone,
  durationMs,
  gifUrl = CONFIG.loaderGifUrl,
  restartKey,
}: {
  onDone: () => void;
  durationMs: number;
  gifUrl?: string;
  restartKey?: number | string;
}) {
  const [fadeOut, setFadeOut] = useState(false);
  const gifSrc = restartKey ? `${gifUrl}?t=${restartKey}` : gifUrl;

  useEffect(() => {
    const fadeDuration = 500;
    const activeDuration = Math.max(durationMs - fadeDuration, 500);

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, activeDuration);

    const doneTimer = setTimeout(() => {
      onDone();
    }, durationMs);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone, durationMs]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        transition: "opacity 0.5s ease",
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? "none" : "auto",
        fontFamily: "'Cairo','Segoe UI',Arial,sans-serif",
      }}
    >
      {/* The exact GIF used by the real site — fills full screen height */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={gifSrc}
        src={gifSrc}
        alt="chamber file"
        loading="eager"
        decoding="sync"
        onError={(e) => {
          // Fallback if local file fails
          e.currentTarget.src = "https://lottie.host/73358927-6e0d-453a-9a9f-e0607ae61ad8/9sISJeaK1n.gif";
        }}
        style={{ width: "100%", height: "100vh", objectFit: "contain" }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  VERIFICATION RESULTS PAGE
// ─────────────────────────────────────────────────────────
function ResultsPage({
  revealed,
  onDownload,
  onVerifyAgain,
}: {
  revealed: boolean;
  onDownload: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onVerifyAgain: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const d = CONFIG;

  return (
    <div
      dir="ltr"
      className="min-h-screen bg-white text-[#212529]"
      style={{
        fontFamily: "'Cairo','Segoe UI',Arial,sans-serif",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(10px)",
        pointerEvents: revealed ? "auto" : "none",
      }}
    >
      {/* ══════════════════ HEADER ══════════════════ */}
      <header className="w-full bg-white border-b border-gray-100 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.06,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath d='M40 5 L75 40 L40 75 L5 40 Z' stroke='%23555' stroke-width='1.5' fill='none'/%3E%3Cpath d='M40 20 L60 40 L40 60 L20 40 Z' stroke='%23555' stroke-width='1.5' fill='none'/%3E%3Cpath d='M5 40 L75 40 M40 5 L40 75 M17 17 L63 63 M63 17 L17 63' stroke='%23555' stroke-width='0.8' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: "80px 80px",
          }}
        />
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3 relative z-10">
          <div className="w-[52px] h-[52px] shrink-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/chamber-logo.png"
              alt="Chamber Services Portal Logo"
              width={52}
              height={52}
              className="w-full h-full object-contain select-none"
            />
          </div>
          <span className="font-bold text-[20px]" style={{ color: "#1a3a5c" }}>
            {d.portalTitle}
          </span>
        </div>
      </header>

      {/* ══════════════════ MAIN ══════════════════ */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8">
        {/* Title bar */}
        <div className="flex items-center justify-between pt-6 pb-3">
          <div className="flex items-center gap-1.5">
            <span style={{ display: "inline-block", width: "4px", height: "28px", backgroundColor: "#2878c8", borderRadius: "2px" }} />
            <h1 className="font-bold m-0" style={{ color: "#1c2833", fontSize: "20px" }}>{d.pageTitle}</h1>
          </div>
          <a href={d.backUrl} className="inline-block text-white font-bold text-[14px] rounded px-6 py-[5px] no-underline hover:brightness-110 active:scale-95 transition-all" style={{ backgroundColor: "rgb(110,168,254)", border: "3px solid rgb(110,168,254)" }}>
            Back
          </a>
        </div>

        <hr style={{ borderColor: "#d5d5d5", borderTopWidth: "1px", margin: 0 }} />

        {/* Intro text */}
        <div className="text-center py-5" style={{ color: "#3c4a55", fontSize: "14px", lineHeight: 1.9 }}>
          <p className="m-0">A service that allows verification of documents that have been authenticated</p>
          <p className="m-0">electronically through the Chamber&apos;s e-services portal. To verify</p>
          <p className="m-0">a membership certificate, please enter the reference number</p>
          <p className="m-0">associated with the document.</p>
        </div>

        <hr style={{ borderColor: "#d5d5d5", borderTopWidth: "1px", margin: 0 }} />

        {/* Data fields */}
        <div className="text-center py-6 mx-auto" style={{ maxWidth: "600px", color: "#212529", lineHeight: 2.0 }}>
          <p className="m-0" style={{ fontSize: "14.5px" }}><strong>Chamber Name: </strong><span>{d.chamberName}</span></p>
          <p className="m-0" style={{ fontSize: "14.5px" }}><strong>Facility Name: </strong><span>{d.facilityName}</span></p>
          {d.facilitySubName && <p className="m-0" style={{ fontSize: "14.5px" }}><span>{d.facilitySubName}</span></p>}
          <p className="m-0" style={{ fontSize: "14.5px" }}><strong>Unified Number (700): </strong><span style={{ fontFamily: "monospace" }}>{d.unifiedNumber}</span></p>
          <p className="m-0" style={{ fontSize: "16px" }}><strong>Request Number: </strong><span style={{ fontFamily: "monospace" }}>{d.requestNumber}</span></p>
          <p className="m-0" style={{ fontSize: "14.5px" }}><strong>Request Type: </strong><span>{d.requestType}</span></p>
          <p className="m-0" style={{ fontSize: "14.5px" }}><strong>Applicant Name: </strong><span>{d.applicantName}</span></p>
          <p className="m-0" style={{ fontSize: "14.5px" }}><strong>Creation Date &amp; Time: </strong><span style={{ fontFamily: "monospace" }}>{d.creationDate}</span></p>
          <p className="m-0" style={{ fontSize: "13.5px", color: "#4b5563" }}>{d.creationTime}</p>
          <p className="m-0" style={{ fontSize: "14.5px" }}><strong>Request Amount: </strong><span>{d.amount}</span></p>
          <p className="m-0" style={{ fontSize: "14.5px" }}><strong>Validity Date: </strong><span style={{ fontFamily: "monospace" }}>{d.expiryDate}</span></p>
          <p className="m-0" style={{ fontSize: "13.5px", color: "#4b5563" }}>{d.expiryTime}</p>
          <p className="m-0" style={{ fontSize: "14.5px" }}><strong>Commercial Reg. No.: </strong><span style={{ fontFamily: "monospace" }}>{d.commercialRegNo}</span></p>
          <p className="m-0 pt-2" style={{ fontSize: "15px" }}>
            <strong>Request Status: </strong>
            <strong style={{ color: "rgb(85,219,221)" }}>{d.requestStatus}</strong>
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-4 pb-10 pt-2">
          <button
            type="button"
            onClick={onVerifyAgain}
            className="inline-block text-white font-bold text-[14px] rounded px-6 py-[5px] cursor-pointer hover:brightness-110 active:scale-95 transition-all"
            style={{ backgroundColor: "rgb(110,168,254)", border: "3px solid rgb(110,168,254)" }}
          >
            Verify Again
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="inline-block text-white font-bold text-[14px] rounded px-8 py-[5px] cursor-pointer hover:brightness-110 active:scale-95 transition-all"
            style={{ backgroundColor: "rgb(110,168,254)", border: "3px solid rgb(110,168,254)" }}
          >
            Download
          </button>
        </div>

        <hr style={{ borderColor: "#d5d5d5", borderTopWidth: "1px" }} />
      </main>

      {/* ══════════════════ FOOTER BLUE BANNER ══════════════════ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-12 pt-6">
        <div
          className="relative overflow-hidden rounded-xl"
          style={{ background: "linear-gradient(180deg,#4a9de8 0%,#2e7fd4 35%,#2269c0 70%,#1a54a8 100%)", color: "white" }}
        >
          {/* City skyline backdrop */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: 0.18,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1400 500'%3E%3Cpath fill='%23ffffff' d='M0,500 L0,310 L25,310 L25,280 L45,280 L45,310 L70,310 L70,260 L85,260 L85,240 L110,240 L110,210 L140,210 L140,280 L160,280 L160,240 L175,240 L175,210 L200,210 L200,500 L225,500 L225,250 L245,250 L245,220 L265,220 L265,180 L310,180 L310,220 L340,220 L340,250 L360,250 L360,500 L390,500 L390,200 L415,200 L415,170 L440,170 L440,140 L490,140 L490,170 L510,170 L510,200 L530,200 L530,500 L560,500 L560,260 L580,260 L580,230 L605,230 L605,500 L630,500 L630,210 L655,210 L655,180 L680,180 L680,150 L720,150 L720,180 L745,180 L745,210 L770,210 L770,500 L800,500 L800,270 L820,270 L820,245 L845,245 L845,500 L875,500 L875,190 L900,190 L900,160 L925,160 L925,130 L975,130 L975,160 L1000,160 L1000,190 L1020,190 L1020,500 L1050,500 L1050,250 L1070,250 L1070,220 L1095,220 L1095,500 L1120,500 L1120,200 L1145,200 L1145,170 L1170,170 L1170,200 L1200,200 L1200,240 L1225,240 L1225,500 L1260,500 L1260,220 L1285,220 L1285,500 L1310,500 L1310,260 L1340,260 L1340,300 L1370,300 L1370,500 L1400,500 Z'/%3E%3C/svg%3E")`,
              backgroundPosition: "bottom center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%",
            }}
          />

          <div className="relative z-10 px-7 pt-6 pb-5">
            {/* Row 1: dev label */}
            <div className="flex justify-end mb-1">
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", fontWeight: 400 }}>{d.devLabel}</span>
            </div>

            {/* Row 2: Company + hatched logo */}
            <div className="flex items-center justify-end gap-3 mb-5">
              <div className="text-right leading-snug">
                <div style={{ fontSize: "19px", fontWeight: 700, color: "white" }}>{d.companyNameEn}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", fontWeight: 400 }}>{d.companyNameAr}</div>
              </div>
              <div style={{ width: "56px", height: "56px", border: "2.5px solid rgba(255,255,255,0.7)", borderRadius: "4px", overflow: "hidden", flexShrink: 0, background: "rgba(255,255,255,0.05)" }}>
                <svg viewBox="0 0 56 56" className="w-full h-full">
                  {[-24,-16,-8,0,8,16,24,32,40,48,56,64,72,80].map((o,i) => (
                    <line key={i} x1={o} y1="0" x2={o+56} y2="56" stroke="white" strokeWidth="4" strokeLinecap="round" />
                  ))}
                </svg>
              </div>
            </div>

            {/* Row 3: Support + phone + white oval */}
            <div className="flex justify-end mb-5">
              <div className="flex flex-col items-end gap-1">
                <span style={{ fontSize: "15px", fontWeight: 500, color: "white" }}>For Inquiries &amp; Technical Support</span>
                <a href={`tel:${d.supportPhone}`} className="no-underline hover:underline" style={{ fontSize: "24px", fontWeight: 700, color: "white", fontFamily: "monospace", letterSpacing: "0.5px" }}>{d.supportPhone}</a>
                <div style={{ width: "64px", height: "22px", background: "rgba(255,255,255,0.92)", borderRadius: "30px", marginTop: "4px", boxShadow: "0 2px 6px rgba(0,0,0,0.18)" }} />
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", marginBottom: "16px" }} />

            {/* Row 4: SSL + Social */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-0.5">
                <div style={{ width: "46px", height: "52px" }}>
                  <svg viewBox="0 0 46 52" className="w-full h-full">
                    <path d="M23 2 L42 10 L42 28 C42 39 33 47 23 50 C13 47 4 39 4 28 L4 10 Z" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" />
                    <text x="23" y="27" textAnchor="middle" fill="white" fontSize="11" fontWeight="800" fontFamily="Arial,sans-serif" letterSpacing="0.5">SSL</text>
                  </svg>
                </div>
                <span style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "1.5px", textTransform: "uppercase" }}>SECURED</span>
              </div>

              <div className="flex items-center gap-2.5">
                {SOCIAL.map(({ label, svg }) => (
                  <a key={label} href={`#${label.toLowerCase()}`} aria-label={label} className="no-underline transition-transform hover:scale-110" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.3)" }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="white">{svg}</svg>
                  </a>
                ))}
              </div>
            </div>

            <div className="text-center mt-4" style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)" }}>
              Please use Google Chrome browser
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  ROOT  — loader overlays the pre-rendered results page
// ─────────────────────────────────────────────────────────
export default function DocumentVerificationPage() {
  const [loaded, setLoaded] = useState(false);
  const [buttonLoaderKey, setButtonLoaderKey] = useState<number | null>(null);

  const handleLoaderDone = useCallback(() => {
    setLoaded(true);
  }, []);

  const handleButtonLoaderDone = useCallback(() => {
    setButtonLoaderKey(null);
  }, []);

  const triggerButtonAnimation = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setButtonLoaderKey(Date.now());
  }, []);

  return (
    <>
      {/* Results page: always pre-rendered, but invisible until loader finishes */}
      <ResultsPage
        revealed={loaded}
        onDownload={triggerButtonAnimation}
        onVerifyAgain={triggerButtonAnimation}
      />

      {/* Initial page loader: fixed full-screen white overlay */}
      {!loaded && (
        <LoaderScreen
          onDone={handleLoaderDone}
          durationMs={CONFIG.loaderDurationMs}
        />
      )}

      {/* Button click loader: exact same logo animation for 4 seconds */}
      {buttonLoaderKey !== null && (
        <LoaderScreen
          key={buttonLoaderKey}
          restartKey={buttonLoaderKey}
          gifUrl={CONFIG.buttonLoaderGifUrl}
          onDone={handleButtonLoaderDone}
          durationMs={CONFIG.buttonLoaderDurationMs}
        />
      )}
    </>
  );
}

