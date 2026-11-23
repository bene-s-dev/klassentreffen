import React, { useEffect } from 'react';
import { Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  useEffect(() => {
    // Subtle festive confetti pop on first arrival
    try {
      const timer = setTimeout(() => {
        confetti({
          particleCount: 75,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#d946ef', '#c026d3', '#9333ea', '#a855f7', '#ec4899', '#fbbf24', '#38bdf8', '#ffffff']
        });
      }, 300);
      return () => clearTimeout(timer);
    } catch {}
  }, []);

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#020617] text-slate-100 flex flex-col items-center justify-center p-3 sm:p-6 select-none overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] rounded-full bg-fuchsia-600/15 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[34rem] h-[34rem] rounded-full bg-indigo-600/12 blur-[140px] pointer-events-none" />
      </div>

      {/* Main Content: Result Image + ICS Calendar Download Link */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl my-auto">
        <a 
          href="/ergebnis-3-april.png" 
          target="_blank" 
          rel="noopener noreferrer"
          title="In voller Auflösung öffnen"
          className="block w-full cursor-zoom-in"
        >
          <img
            src="/ergebnis-3-april.png"
            alt="Merian-Klassentreffen 2.0 – Ergebnis: Samstag, 3. April ab 19:00 Uhr"
            className="w-full h-auto max-h-[82vh] object-contain rounded-2xl sm:rounded-3xl shadow-2xl transition-transform duration-300 hover:scale-[1.01]"
            loading="eager"
          />
        </a>

        {/* ICS Download Button */}
        <a
          href="/klassentreffen.ics"
          download="klassentreffen.ics"
          className="mt-4 sm:mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-white border border-fuchsia-500/35 hover:border-fuchsia-400 shadow-[0_4px_20px_-2px_rgba(192,38,211,0.25)] hover:shadow-[0_8px_30px_-2px_rgba(192,38,211,0.45)] text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer group active:scale-95"
        >
          <Calendar className="w-4 h-4 text-fuchsia-400 group-hover:scale-110 transition-transform" />
          <span>Termin im Kalender speichern (.ics)</span>
        </a>
      </main>
    </div>
  );
}
