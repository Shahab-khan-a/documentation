"use client";

import React, { useState } from "react";

interface RacingCar {
  id: string;
  name: string;
  team: string;
  number: number;
  engine: string;
  horsepower: string;
  acceleration: string;
  topSpeed: string;
  lapTime: string;
  image: string;
  color: string;
  accentColor: string;
  badge: string;
}

const RACING_CARS: RacingCar[] = [
  {
    id: "car-1",
    name: "Apex Venom F1-GT",
    team: "Redline Racing Factory",
    number: 1,
    engine: "4.0L Twin-Turbo V8 Hybrid",
    horsepower: "1,150 HP",
    acceleration: "0-100 in 2.1s",
    topSpeed: "368 km/h",
    lapTime: "1:17.382",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
    color: "from-red-600 via-rose-600 to-amber-600",
    accentColor: "border-red-500 text-red-400 bg-red-500/10",
    badge: "P1 LEADER",
  },
  {
    id: "car-2",
    name: "Scuderia Monza V12 Hypercar",
    team: "Monza Corse Italia",
    number: 16,
    engine: "6.5L Naturally Aspirated V12",
    horsepower: "1,080 HP",
    acceleration: "0-100 in 2.3s",
    topSpeed: "362 km/h",
    lapTime: "1:17.625",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
    color: "from-rose-600 via-red-700 to-red-900",
    accentColor: "border-rose-500 text-rose-400 bg-rose-500/10",
    badge: "P2 +0.243s",
  },
  {
    id: "car-3",
    name: "Porsche 963 GT3 Endurance",
    team: "Stuttgart Speed Works",
    number: 99,
    engine: "4.6L Twin-Turbo V8",
    horsepower: "980 HP",
    acceleration: "0-100 in 2.4s",
    topSpeed: "354 km/h",
    lapTime: "1:18.110",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    color: "from-amber-500 via-yellow-600 to-emerald-600",
    accentColor: "border-amber-500 text-amber-400 bg-amber-500/10",
    badge: "P3 +0.728s",
  },
  {
    id: "car-4",
    name: "McLaren Solus Phantom Apex",
    team: "Woking Aero Performance",
    number: 44,
    engine: "5.2L V10 Single-Seater Track",
    horsepower: "840 HP",
    acceleration: "0-100 in 2.5s",
    topSpeed: "348 km/h",
    lapTime: "1:18.490",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
    color: "from-orange-500 via-amber-600 to-blue-600",
    accentColor: "border-orange-500 text-orange-400 bg-orange-500/10",
    badge: "P4 +1.108s",
  },
];

const LEADERBOARD = [
  { pos: 1, no: "01", driver: "Max Verstappen", car: "Apex Venom F1-GT", gap: "LEADER", tire: "SOFT", sector: "24.18s", points: "25 PTS", status: "FASTEST LAP" },
  { pos: 2, no: "16", driver: "Charles Leclerc", car: "Scuderia Monza V12", gap: "+0.243s", tire: "SOFT", sector: "24.22s", points: "18 PTS", status: "IN DRS RANGE" },
  { pos: 3, no: "99", driver: "Lando Norris", car: "Porsche 963 GT3", gap: "+0.728s", tire: "MEDIUM", sector: "24.41s", points: "15 PTS", status: "CHASING P2" },
  { pos: 4, no: "44", driver: "Lewis Hamilton", car: "McLaren Solus Phantom", gap: "+1.108s", tire: "MEDIUM", sector: "24.58s", points: "12 PTS", status: "STABLE" },
  { pos: 5, no: "55", driver: "Carlos Sainz", car: "Aston Martin Valkyrie GT", gap: "+2.415s", tire: "HARD", sector: "24.89s", points: "10 PTS", status: "PIT WINDOW" },
  { pos: 6, no: "63", driver: "George Russell", car: "Mercedes AMG One Sprint", gap: "+3.180s", tire: "HARD", sector: "25.04s", points: "8 PTS", status: "STABLE" },
];

const CIRCUITS = [
  { name: "Yas Marina Grand Prix Circuit", country: "Abu Dhabi, UAE", length: "5.281 km", laps: 58, record: "1:26.103", date: "FINAL ROUND • LIVE", status: "LIVE NOW" },
  { name: "Monza Autodromo Nazionale", country: "Monza, Italy", length: "5.793 km", laps: 53, record: "1:21.046", date: "COMPLETED", status: "ROUND 06" },
  { name: "Circuit de Spa-Francorchamps", country: "Stavelot, Belgium", length: "7.004 km", laps: 44, record: "1:46.286", date: "COMPLETED", status: "ROUND 05" },
  { name: "Silverstone International Circuit", country: "Silverstone, UK", length: "5.891 km", laps: 52, record: "1:27.097", date: "UPCOMING", status: "NEXT STAGE" },
];

export function ModernEnglishPortal() {
  const [activeCarTab, setActiveCarTab] = useState<string>("car-1");
  const [telemetryMode, setTelemetryMode] = useState<"quali" | "race" | "aero">("quali");

  const handleNoOp = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const selectedCar = RACING_CARS.find((c) => c.id === activeCarTab) || RACING_CARS[0];

  return (
    <div
      dir="ltr"
      className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-red-600 selection:text-white overflow-x-hidden"
      style={{
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── Top Racing Broadcast Banner ─────────────────────────────── */}
      <div className="bg-gradient-to-r from-red-700 via-neutral-900 to-red-800 text-white text-xs font-black py-2.5 px-4 tracking-widest uppercase border-b border-red-600/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="text-red-300 font-extrabold">LIVE BROADCAST:</span>
            <span>WORLD GT & HYPERCAR RACING CHAMPIONSHIP 2026 • ROUND 07 (LAP 48/58)</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] font-bold text-slate-300">
            <span>TRACK: DRY (39°C)</span>
            <span>•</span>
            <span>AIR: 28°C</span>
            <span>•</span>
            <span className="text-yellow-400">SAFETY CAR: CLEAR</span>
          </div>
        </div>
      </div>

      {/* ── Header / Navigation Bar ─────────────────────────────────── */}
      <nav className="border-b border-slate-800/80 bg-[#0a0d14]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Racing Brand */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30 border border-white/20">
              <span className="text-xl">🏁</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-wider text-white uppercase italic">
                  VELOCITY<span className="text-red-500">GT</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                  GRAND PRIX
                </span>
              </div>
              <p className="text-[10px] tracking-wider font-semibold text-slate-400 uppercase">
                World Championship Series
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-300">
            <button type="button" onClick={handleNoOp} className="hover:text-red-400 transition-colors cursor-pointer">
              Race Grid
            </button>
            <button type="button" onClick={handleNoOp} className="hover:text-red-400 transition-colors cursor-pointer">
              Hypercars & Fleet
            </button>
            <button type="button" onClick={handleNoOp} className="hover:text-red-400 transition-colors cursor-pointer">
              Live Telemetry
            </button>
            <button type="button" onClick={handleNoOp} className="hover:text-red-400 transition-colors cursor-pointer">
              Circuits
            </button>
            <button type="button" onClick={handleNoOp} className="hover:text-red-400 transition-colors cursor-pointer">
              Standings
            </button>
            <button type="button" onClick={handleNoOp} className="hover:text-red-400 transition-colors cursor-pointer">
              Paddock Club
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleNoOp}
              className="hidden sm:inline-flex text-xs font-black uppercase tracking-wider text-slate-300 hover:text-white px-3 py-2 transition-colors cursor-pointer"
            >
              Driver Portal
            </button>
            <button
              type="button"
              onClick={handleNoOp}
              className="text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-red-600/30 active:scale-95 cursor-pointer flex items-center gap-2 border border-red-400/30"
            >
              <span>Watch Live Race</span>
              <span>🏎️</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section: High-Octane Car Racing Action ─────────────── */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
        {/* Dynamic Glows & Speed Lines */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-red-600/15 via-rose-600/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Hero Title & Speed Numbers */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-black uppercase tracking-widest shadow-inner">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>350+ KM/H PURE ADRENALINE RACING</span>
              </div>

              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black uppercase tracking-tight text-white leading-none italic">
                BORN FOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">SPEED.</span>
                <br />
                DRIVEN BY <span className="underline decoration-red-600 decoration-4">POWER.</span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Experience the pinnacle of international motorsport. Witness four championship hypercars 
                battling wheel-to-wheel on legendary asphalt circuits with cutting-edge aerodynamic engineering and 1,000+ horsepower engines.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleNoOp}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-red-600/30 cursor-pointer active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Explore Race Fleet</span>
                  <span className="text-base">→</span>
                </button>
                <button
                  type="button"
                  onClick={handleNoOp}
                  className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-black text-xs sm:text-sm uppercase tracking-wider cursor-pointer active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Live Pit Telemetry</span>
                  <span className="text-red-400">⚡</span>
                </button>
              </div>

              {/* Real-Time Live Telemetry HUD */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto lg:mx-0">
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Top Velocity</div>
                  <div className="text-2xl font-black text-white italic">368 <span className="text-xs text-red-400 font-bold">KM/H</span></div>
                  <div className="text-[10px] text-emerald-400 font-semibold">Speed Record</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Peak Output</div>
                  <div className="text-2xl font-black text-white italic">1,150 <span className="text-xs text-red-400 font-bold">HP</span></div>
                  <div className="text-[10px] text-slate-400 font-semibold">Twin-Turbo V8</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Acceleration</div>
                  <div className="text-2xl font-black text-white italic">2.1 <span className="text-xs text-red-400 font-bold">SEC</span></div>
                  <div className="text-[10px] text-emerald-400 font-semibold">0 to 100 km/h</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Current Lap</div>
                  <div className="text-2xl font-black text-white italic">48 <span className="text-xs text-red-400 font-bold">/ 58</span></div>
                  <div className="text-[10px] text-amber-400 font-semibold">Yas Marina Circuit</div>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Racing Car Live Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-red-500/30 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl shadow-red-950/40">
                {/* Hero Car Image with Track Overlay */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-black">
                  <img
                    src={selectedCar.image}
                    alt={selectedCar.name}
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Position Badge Overlay */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-red-600 text-white font-black text-xs uppercase tracking-widest shadow-md">
                      #{selectedCar.number} {selectedCar.badge}
                    </span>
                  </div>

                  {/* RPM & Speed HUD Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <div>
                      <div className="text-xs font-bold text-red-400 uppercase tracking-wider">{selectedCar.team}</div>
                      <div className="text-xl font-black italic">{selectedCar.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Best Lap</div>
                      <div className="text-lg font-black text-amber-400 italic">{selectedCar.lapTime}</div>
                    </div>
                  </div>
                </div>

                {/* Car Quick Spec Bar */}
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Horsepower</div>
                      <div className="text-sm font-black text-white">{selectedCar.horsepower}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">0-100 KM/H</div>
                      <div className="text-sm font-black text-white">{selectedCar.acceleration}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Max Speed</div>
                      <div className="text-sm font-black text-red-400">{selectedCar.topSpeed}</div>
                    </div>
                  </div>

                  {/* Car Switcher Pills */}
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                      Select Car To Inspect:
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {RACING_CARS.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setActiveCarTab(c.id)}
                          className={`py-2 px-1 text-center rounded-xl text-[11px] font-black uppercase transition-all cursor-pointer border ${
                            activeCarTab === c.id
                              ? "bg-red-600 text-white border-red-400 shadow-md shadow-red-600/30 scale-102"
                              : "bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800"
                          }`}
                        >
                          #{c.number}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Multiple Racing Cars: The Supercar Grid ─────────────────── */}
      <section className="py-16 bg-[#0a0d14] border-t border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-red-500 font-black text-xs uppercase tracking-widest mb-1.5 flex items-center gap-2">
                <span>🏁</span>
                <span>CHAMPIONSHIP RACING FLEET</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase italic text-white tracking-tight">
                THE MULTI-CAR GRID
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
                Four bespoke racing machines competing on track with hyper-tuned engines and active carbon aerodynamics.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold uppercase">Category:</span>
              <span className="px-3 py-1 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-black uppercase">
                Hypercar GT3 & Prototype
              </span>
            </div>
          </div>

          {/* 4 Multi-Car Fleet Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {RACING_CARS.map((car) => (
              <div
                key={car.id}
                className="group rounded-3xl overflow-hidden bg-slate-950/80 border border-slate-800 hover:border-red-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-red-950/50 flex flex-col justify-between"
              >
                <div>
                  {/* Car Image Container */}
                  <div className="relative h-48 w-full overflow-hidden bg-black">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white font-black text-xs border border-white/20">
                      #{car.number}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-red-600 text-white font-black text-[10px] tracking-wider uppercase shadow">
                      {car.badge}
                    </div>
                  </div>

                  {/* Car Details */}
                  <div className="p-5 space-y-3">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">{car.team}</div>
                      <h3 className="text-base font-black text-white italic group-hover:text-red-400 transition-colors">
                        {car.name}
                      </h3>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono">
                      Engine: <span className="text-slate-200 font-bold">{car.engine}</span>
                    </div>

                    {/* Quick Specs */}
                    <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-800/80 text-center">
                      <div className="p-2 rounded-lg bg-slate-900/80">
                        <div className="text-[9px] text-slate-400 uppercase font-semibold">Power</div>
                        <div className="text-xs font-black text-white">{car.horsepower}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900/80">
                        <div className="text-[9px] text-slate-400 uppercase font-semibold">0-100</div>
                        <div className="text-xs font-black text-white">{car.acceleration.replace("0-100 in ", "")}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900/80">
                        <div className="text-[9px] text-slate-400 uppercase font-semibold">Top Speed</div>
                        <div className="text-xs font-black text-red-400">{car.topSpeed}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={handleNoOp}
                    className="w-full py-2.5 rounded-xl bg-slate-900 group-hover:bg-red-600 text-slate-300 group-hover:text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-slate-800 group-hover:border-red-500"
                  >
                    <span>View Car Specs</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Leaderboard & Race Standings ───────────────────────── */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-red-500 font-black text-xs uppercase tracking-widest">
              OFFICIAL TIMING & SCORING
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase italic text-white tracking-tight mt-1">
              LIVE GRAND PRIX STANDINGS
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Real-time sector splits, pit stop gaps, and driver points table updated directly from trackside timing towers.
            </p>
          </div>

          {/* Leaderboard Table Container */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0e131d] border-b border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-4 px-4 sm:px-6">POS</th>
                    <th className="py-4 px-4">NO.</th>
                    <th className="py-4 px-4">DRIVER / RACING MACHINE</th>
                    <th className="py-4 px-4">INTERVAL / GAP</th>
                    <th className="py-4 px-4">TIRE</th>
                    <th className="py-4 px-4">BEST SECTOR</th>
                    <th className="py-4 px-4">POINTS</th>
                    <th className="py-4 px-4 sm:px-6 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-semibold">
                  {LEADERBOARD.map((row) => (
                    <tr
                      key={row.pos}
                      className="hover:bg-slate-900/60 transition-colors"
                    >
                      <td className="py-4 px-4 sm:px-6 font-black text-sm">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${
                            row.pos === 1
                              ? "bg-amber-500 text-black font-black"
                              : row.pos === 2
                              ? "bg-slate-300 text-black font-black"
                              : row.pos === 3
                              ? "bg-amber-700 text-white font-black"
                              : "text-slate-400 font-bold"
                          }`}
                        >
                          P{row.pos}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-red-400">
                        #{row.no}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-white text-sm">{row.driver}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{row.car}</div>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-amber-400">
                        {row.gap}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.tire === "SOFT"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : row.tire === "MEDIUM"
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              : "bg-white/20 text-white border border-white/30"
                          }`}
                        >
                          {row.tire}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-300">
                        {row.sector}
                      </td>
                      <td className="py-4 px-4 font-bold text-white">
                        {row.points}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer Bar */}
            <div className="bg-[#0e131d] px-6 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Sector 1, 2, and 3 Green • Timing Transponders Operational</span>
              </div>
              <button
                type="button"
                onClick={handleNoOp}
                className="text-red-400 hover:text-red-300 font-bold uppercase tracking-wider text-[11px] cursor-pointer"
              >
                Download Official PDF Classification →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Race Calendar & Championship Circuits ───────────────────── */}
      <section className="py-16 bg-[#0a0d14] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-red-500 font-black text-xs uppercase tracking-widest">
                GLOBAL TRACKS & CIRCUITS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase italic text-white tracking-tight mt-1">
                2026 RACE CALENDAR
              </h2>
            </div>
            <button
              type="button"
              onClick={handleNoOp}
              className="text-xs font-bold uppercase tracking-wider text-red-400 hover:text-white px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500 transition-colors self-start md:self-auto cursor-pointer"
            >
              View Full Season Schedule (22 Races)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CIRCUITS.map((circuit, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-slate-950/70 border border-slate-800/90 hover:border-red-500/40 transition-all hover:bg-slate-900/80"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                    {circuit.status}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{circuit.date}</span>
                </div>

                <h3 className="text-base font-black text-white italic">{circuit.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{circuit.country}</p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Track Length:</span>
                    <span className="font-bold text-white font-mono">{circuit.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Laps:</span>
                    <span className="font-bold text-white font-mono">{circuit.laps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lap Record:</span>
                    <span className="font-bold text-amber-400 font-mono">{circuit.record}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNoOp}
                  className="w-full mt-4 py-2 rounded-xl bg-slate-900 hover:bg-red-600 text-slate-300 hover:text-white text-[11px] font-black uppercase tracking-wider transition-colors cursor-pointer border border-slate-800"
                >
                  Track Map & Telemetry
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer: Motorsport Partners & Regulations ───────────────── */}
      <footer className="border-t border-slate-800/80 bg-[#07090e] py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏁</span>
              <span className="font-black text-lg text-white uppercase italic tracking-wider">
                VELOCITY<span className="text-red-500">GT</span> RACING
              </span>
            </div>

            {/* Dummy Sponsor Badges */}
            <div className="flex flex-wrap items-center gap-6 text-[11px] font-black uppercase tracking-widest text-slate-400">
              <span className="hover:text-white transition-colors cursor-pointer" onClick={handleNoOp}>PIRELLI MOTORSPORT</span>
              <span className="hover:text-white transition-colors cursor-pointer" onClick={handleNoOp}>BREMBO RACING</span>
              <span className="hover:text-white transition-colors cursor-pointer" onClick={handleNoOp}>SHELL V-POWER</span>
              <span className="hover:text-white transition-colors cursor-pointer" onClick={handleNoOp}>TAG HEUER TIMING</span>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-400">
            <p>© 2026 Velocity GT World Championship. All racing telemetry and car media rights reserved.</p>
            <div className="flex items-center gap-4">
              <button type="button" onClick={handleNoOp} className="hover:text-slate-200 cursor-pointer">
                FIA Regulations
              </button>
              <button type="button" onClick={handleNoOp} className="hover:text-slate-200 cursor-pointer">
                Telemetry Policy
              </button>
              <button type="button" onClick={handleNoOp} className="hover:text-slate-200 cursor-pointer">
                Paddock Terms
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ModernEnglishPortal;
