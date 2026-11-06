"use client";

import React, { useState } from "react";

export function ModernEnglishPortal() {
  const [searchValue, setSearchValue] = useState("");

  const handleNoOp = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div
      dir="ltr"
      className="min-h-screen bg-slate-900 text-slate-100 selection:bg-blue-500 selection:text-white"
      style={{
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── Top Announcement Banner ─────────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-700 text-white text-xs font-semibold py-2 px-4 text-center tracking-wide">
        <span>Global Document Registry Network v3.4 is now live.</span>
        <button
          type="button"
          onClick={handleNoOp}
          className="ml-3 underline opacity-90 hover:opacity-100 cursor-pointer inline-flex items-center gap-1"
        >
          Read Release Notes
          <svg className="w-3.5 h-3.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ── Navigation Bar ─────────────────────────────────────────── */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">DocuVerify</span>
              <span className="text-blue-400 font-semibold text-xs ml-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                Cloud
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button type="button" onClick={handleNoOp} className="hover:text-white transition-colors cursor-pointer">
              Solutions
            </button>
            <button type="button" onClick={handleNoOp} className="hover:text-white transition-colors cursor-pointer">
              Verification Engine
            </button>
            <button type="button" onClick={handleNoOp} className="hover:text-white transition-colors cursor-pointer">
              Compliance & Security
            </button>
            <button type="button" onClick={handleNoOp} className="hover:text-white transition-colors cursor-pointer">
              API Documentation
            </button>
            <button type="button" onClick={handleNoOp} className="hover:text-white transition-colors cursor-pointer">
              Enterprise
            </button>
          </div>

          {/* Action Buttons (Right) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleNoOp}
              className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={handleNoOp}
              className="text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-600/30 active:scale-95 cursor-pointer"
            >
              Request Access
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        {/* Subtle Ambient Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-blue-400 text-xs font-semibold mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Multi-Chamber Federated Cryptographic Verification</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-tight mb-6">
            Institutional Document Authentication &amp;{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
              Digital Registry Engine
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed mb-10">
            A high-assurance platform engineered for governmental chambers, corporate accreditations, and verifiable
            certificates. Validate public and institutional records across international networks with zero-knowledge
            cryptographic proofs.
          </p>

          {/* Mock Document Lookup / Search Bar */}
          <div className="max-w-2xl mx-auto bg-slate-950/90 border border-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-2xl shadow-blue-950/40 backdrop-blur-md mb-8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Enter Certificate Reference or Serial Number (e.g. DOC-2026-90412)..."
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500"
                />
              </div>
              <button
                type="button"
                onClick={handleNoOp}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-600/30 shrink-0 cursor-pointer"
              >
                Verify Record
              </button>
            </div>
            <div className="flex items-center justify-between px-2 pt-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                256-bit AES cryptographic verification protocol
              </span>
              <span>Encrypted SSL Gateway</span>
            </div>
          </div>

          {/* Call to action secondary buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold">
            <button
              type="button"
              onClick={handleNoOp}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-5 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Explore Documentation
            </button>
            <button
              type="button"
              onClick={handleNoOp}
              className="bg-transparent hover:bg-slate-800/60 text-slate-300 border border-slate-800 px-5 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
            >
              Institutional Pricing
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── Key Performance Metrics ─────────────────────────────────── */}
      <section className="border-y border-slate-800 bg-slate-950/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <div className="text-2xl sm:text-4xl font-extrabold text-white">99.99%</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Uptime Availability</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <div className="text-2xl sm:text-4xl font-extrabold text-blue-400">4.8M+</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Authenticated Records</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <div className="text-2xl sm:text-4xl font-extrabold text-white">&lt; 40ms</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Lookup Latency</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <div className="text-2xl sm:text-4xl font-extrabold text-indigo-400">256-Bit</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">AES Proof Security</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Capabilities Grid ──────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Engineered for High-Assurance Verification
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
            Enterprise-grade infrastructure delivering instant document validation across commercial chambers,
            ministerial records, and corporate registries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Cryptographic Integrity</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Digital documents are sealed with immutable cryptographic signatures, eliminating risks of forgery or
              unauthorized modifications.
            </p>
            <button
              type="button"
              onClick={handleNoOp}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer"
            >
              Learn about encryption
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Federated Registry Sync</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Real-time synchronization across accredited commercial registries, chambers of commerce, and licensed
              notarial authorities.
            </p>
            <button
              type="button"
              onClick={handleNoOp}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer"
            >
              View registry partners
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Automated Audit Trails</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Every verification event produces an immutable, timestamped audit log meeting strict ISO and institutional
              compliance mandates.
            </p>
            <button
              type="button"
              onClick={handleNoOp}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 cursor-pointer"
            >
              Audit standards
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── Institutional Verification Workflow ──────────────────────── */}
      <section className="bg-slate-950/70 border-t border-slate-800 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-md">
              <span className="text-blue-400 font-semibold text-xs tracking-wider uppercase">Verification Lifecycle</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2 mb-4">
                Instant resolution across global nodes
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Our distributed ledger query network enables high-throughput verification queries with sub-second
                turnaround times, zero downtime, and complete cryptographic verifiability.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleNoOp}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-all cursor-pointer"
                >
                  Technical Architecture
                </button>
                <button
                  type="button"
                  onClick={handleNoOp}
                  className="text-slate-300 hover:text-white font-semibold text-xs px-4 py-2.5 rounded-lg border border-slate-800 hover:bg-slate-900 transition-all cursor-pointer"
                >
                  Security Whitepaper
                </button>
              </div>
            </div>

            {/* Workflow Steps Box */}
            <div className="w-full md:w-1/2 space-y-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Cryptographic Certificate Inscription</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Documents are assigned a unique mathematical hash at the moment of chamber certification.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Federated Index Distribution</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    The authenticated reference record is synchronized across authorized multi-node networks.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Universal Real-Time Verification</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Third parties, financial institutions, and courts verify authenticity instantly via the public gateway.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modern Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            {/* Col 1: Brand */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <span className="font-bold text-white text-base">DocuVerify Global</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Leading digital certificate validation and governmental registry integration infrastructure.
              </p>
            </div>

            {/* Col 2: Solutions */}
            <div>
              <h5 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">Platform</h5>
              <ul className="space-y-2">
                <li>
                  <button type="button" onClick={handleNoOp} className="hover:text-white transition-colors cursor-pointer">
                    Registry Gateway
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handleNoOp} className="hover:text-white transition-colors cursor-pointer">
                    Digital Notarization
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handleNoOp} className="hover:text-white transition-colors cursor-pointer">
                    Audit Reports
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Compliance */}
            <div>
              <h5 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">Compliance</h5>
              <ul className="space-y-2">
                <li>
                  <button type="button" onClick={handleNoOp} className="hover:text-white transition-colors cursor-pointer">
                    ISO 27001 Certification
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handleNoOp} className="hover:text-white transition-colors cursor-pointer">
                    SOC 2 Type II
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handleNoOp} className="hover:text-white transition-colors cursor-pointer">
                    Data Privacy Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Support */}
            <div>
              <h5 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">Resources</h5>
              <ul className="space-y-2">
                <li>
                  <button type="button" onClick={handleNoOp} className="hover:text-white transition-colors cursor-pointer">
                    Developer API
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handleNoOp} className="hover:text-white transition-colors cursor-pointer">
                    Network Status
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handleNoOp} className="hover:text-white transition-colors cursor-pointer">
                    Institutional Support
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
            <p>© 2026 DocuVerify Global Network Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <button type="button" onClick={handleNoOp} className="hover:text-slate-400 cursor-pointer">
                Privacy
              </button>
              <button type="button" onClick={handleNoOp} className="hover:text-slate-400 cursor-pointer">
                Terms of Service
              </button>
              <button type="button" onClick={handleNoOp} className="hover:text-slate-400 cursor-pointer">
                Security Disclosure
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ModernEnglishPortal;

