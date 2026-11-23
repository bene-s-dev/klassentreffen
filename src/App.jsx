import React, { useEffect } from 'react';
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
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#020617] text-slate-100 flex items-center justify-center p-2 sm:p-6 select-none overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] rounded-full bg-fuchsia-600/15 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[34rem] h-[34rem] rounded-full bg-indigo-600/12 blur-[140px] pointer-events-none" />
      </div>

      {/* Main Content: Displays ONLY the Result Image */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl my-auto">
        <a 
          href="/ergebnis-3-april.png" 
          target="_blank" 
          rel="noopener noreferrer"
          title="In voller Auflösung öffnen / herunterladen"
          className="block w-full cursor-zoom-in"
        >
          <img
            src="/ergebnis-3-april.png"
            alt="Merian-Klassentreffen 2.0 – Ergebnis: Samstag, 3. April ab 19:00 Uhr"
            className="w-full h-auto max-h-[92vh] object-contain rounded-2xl sm:rounded-3xl shadow-2xl transition-transform duration-300 hover:scale-[1.01]"
            loading="eager"
          />
        </a>
      </main>
    </div>
  );
}
