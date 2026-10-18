import React, { useState, useEffect } from 'react';
import { sounds } from '../lib/sounds';

const SINGLE_STEP_LOGS = {
  '1-to-2': 'Name wird mit Klassenbuch verglichen...',
  '2-to-3': 'Termine werden per pq-Formel verglichen...',
  '3-to-4': 'Locations werden auf Lärmpegel und Zapfhahn-Durchfluss geprüft...',
  'final-submit': 'Nachricht wird auf Stilmittel analysiert...'
};

export default function PseudoLoaderModal({ transitionType, onFinish }) {
  const sentence = SINGLE_STEP_LOGS[transitionType] || 'Daten werden verarbeitet...';
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    sounds.playPop();

    // Smooth single-sentence progress
    const startTime = Date.now();
    const duration = 1300; // 1.3 seconds - comfortable reading time

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(timer);
        sounds.playPop();
        setTimeout(() => {
          onFinish();
        }, 200);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-slate-950/75 animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative text-center">
        
        {/* Animated Icon */}
        <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 mx-auto mb-4 flex items-center justify-center text-xl">
          🔔
        </div>

        {/* Dynamic Status Message - Exactly ONE single, readable sentence */}
        <div className="min-h-[2.5rem] flex items-center justify-center mb-5 px-2">
          <p className="text-sm font-semibold text-white">
            {sentence}
          </p>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Klassenbuch-Check</span>
          <span className="font-semibold text-slate-300">{progress}%</span>
        </div>

      </div>
    </div>
  );
}
