import React, { useState, useEffect } from 'react';
import { Cpu, Sparkles, CheckCircle2, Zap, FastForward } from 'lucide-react';
import { sounds } from '../lib/sounds';

const TRANSITION_STEPS_LOGS = {
  '1-to-2': [
    { text: 'Name wird verschlüsselt an das Orgateam gesendet...', math: 'f(Name) → SecureStore' },
    { text: 'Scanne altes Klassenbuch nach vergessenen Hausaufgaben...', math: '∫ Fehlstunden dt' },
    { text: 'Berechne stochastische Vektormatrix im euklidischen Raum...', math: 'det(A - λI) = 0' },
    { text: 'Freigabe erteilt! Terminkalender wird freigeschaltet... 🔥', math: 'Status: 100%' }
  ],
  '2-to-3': [
    { text: 'Terminauswahl wird mit Gaußscher Normalverteilung kalibriert...', math: 'σ = √(E[(X - μ)²])' },
    { text: 'Diagonalisiere Wochenend-Matrix für maximale Anwesenheit...', math: 'T_opt = argmax ∑(v)' },
    { text: 'Kompression der Zeitkontinuums-Vektoren für Kaltgetränke...', math: 'lim(t→WE) Bier(t) = ∞' },
    { text: 'Termine verankert! Weiter zu den Locations... 📍', math: 'Status: 100%' }
  ],
  '3-to-4': [
    { text: 'Berechne Schallpegel-Reflexion nach Navier-Stokes-Gleichungen...', math: '∇ · u = 0' },
    { text: 'Prüfe Zapfhahn-Strömungsmechanik nach Bernoulli...', math: 'p + 0.5ρv² + ρgh = const' },
    { text: 'VIP-Vorwarnung geht per Express an die Wirte raus...', math: 'dB_max ≥ 110' },
    { text: 'Locations eingeloggt! Jetzt noch schnell Gruß & Anekdote droppen! 💬', math: 'Status: 100%' }
  ],
  'final-submit': [
    { text: 'Übertrage Stimmzettel in die zentrale Abstimmungs-Datenbank...', math: 'SHA-512(Vote) → OK' },
    { text: 'Supabase Realtime Synchronisation wird initialisiert...', math: 'socket.emit("VOTE_IN")' },
    { text: 'Kater-Wahrscheinlichkeit nach Taylor-Polynom 4. Grades berechnet...', math: '∑ (f^(n)(a)/n!) (x-a)^n' },
    { text: 'ABRECHNUNG VOLLENDET! WILLKOMMEN IN DER HALL OF FAME! 🏆', math: 'Status: DONE 🚀' }
  ]
};

export default function PseudoLoaderModal({ transitionType, onFinish }) {
  const logs = TRANSITION_STEPS_LOGS[transitionType] || TRANSITION_STEPS_LOGS['1-to-2'];
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    sounds.playPop();

    const interval = setInterval(() => {
      setCurrentStepIdx(prev => {
        const next = prev + 1;
        if (next < logs.length) {
          sounds.playPop();
          setProgress(Math.round(((next + 1) / logs.length) * 100));
          return next;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onFinish();
          }, 350);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [logs, onFinish]);

  const currentLog = logs[currentStepIdx] || logs[logs.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-2xl bg-slate-950/80 animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl glass-panel-highlight p-6 sm:p-8 border border-fuchsia-500/40 shadow-2xl relative overflow-hidden text-center">
        
        {/* Glow ambient pulse inside modal */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Tech / AI Spinner Icon */}
        <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-fuchsia-500/20 border-t-fuchsia-400 animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-indigo-500/20 border-b-pink-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center text-white text-xl shadow-lg shadow-fuchsia-500/50">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-fuchsia-300 font-bold px-2 py-0.5 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/30">
            Quantum Core Engine
          </span>
        </div>

        <h3 className="font-display font-extrabold text-xl text-white mb-2">
          {progress < 100 ? 'Berechne Vektor-Matrix...' : 'Erfolgreich kalibriert! 🚀'}
        </h3>

        {/* Dynamic Status Message */}
        <div className="min-h-[4rem] flex flex-col items-center justify-center mb-6 px-2">
          <p className="text-sm font-semibold text-slate-200 transition-all duration-200">
            {currentLog.text}
          </p>
          <p className="text-[11px] font-mono text-fuchsia-400/80 mt-1">
            Formel: {currentLog.math}
          </p>
        </div>

        {/* Glowing Progress Bar */}
        <div className="w-full bg-slate-900 rounded-full h-3 p-0.5 border border-white/10 mb-4 overflow-hidden relative shadow-inner">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-indigo-500 transition-all duration-300 shadow-lg shadow-fuchsia-500/50"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Buffer: OK • Tech by Bene</span>
          <span className="font-bold text-fuchsia-300">{progress}%</span>
        </div>

        {/* Skip button */}
        <div className="mt-5 pt-3 border-t border-white/5">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onFinish();
            }}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mx-auto cursor-pointer transition-colors"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Überspringen (Ich hab keine Geduld)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
