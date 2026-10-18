import React, { useState, useEffect } from 'react';
import { Sparkles, FastForward } from 'lucide-react';
import { sounds } from '../lib/sounds';

const TRANSITION_STEPS_LOGS = {
  '1-to-2': [
    { text: 'Prüfe Klassenbuch von damals auf Fehlstunden...', sub: 'Klassenbuch 2016' },
    { text: 'Entschuldigungszettel auf Mamas Handschrift gescannt...', sub: 'Unterschrift verifiziert' },
    { text: 'Kaugummis unterm Schultisch virtuell abgekratzt...', sub: 'Klassenzimmer aufgeräumt' },
    { text: 'Klassenbuch unterschrieben. Kalender freigegeben! 🔔', sub: 'Bereit' }
  ],
  '2-to-3': [
    { text: 'Overheadprojektor angeworfen, Folie lag spiegelverkehrt...', sub: 'OHP fokussiert' },
    { text: 'Hauswirtschaft: Heißmangel auf Stufe 3 vorgeheizt...', sub: 'Wäschepflege' },
    { text: 'Trockenblumen-Gesteck für die Tischdeko gebunden...', sub: 'Floristik-Note: 1' },
    { text: 'Termine stehen! Jetzt ab zur Location-Wahl! 🍽️', sub: 'Bereit' }
  ],
  '3-to-4': [
    { text: 'Hauswirtschaftsküche: Brandmelder beim Kochen ignoriert...', sub: 'Mittagessen gerettet' },
    { text: 'Geschirrhandtücher nach Vorschrift zusammengelegt...', sub: 'Ordnungsdienst' },
    { text: 'Hausmeister schließt den Raum auf und meckert kurz...', sub: 'Schlüsselbund rasselt' },
    { text: 'Locations eingeloggt! Jetzt noch einen Gruß hinterlassen! 💬', sub: 'Bereit' }
  ],
  'final-submit': [
    { text: 'Tischdecken ordentlich gemangelt und glattgezogen...', sub: 'Wäsche & Tischkultur' },
    { text: 'Klassenliste aktualisiert, niemand schwänzt unbemerkt...', sub: 'Anwesenheitskontrolle' },
    { text: 'Erinnerungsfotos und Jahrbuch werden geladen...', sub: 'Nostalgie-Modus' },
    { text: 'GONG ZUR GROSSEN PAUSE! DU BIST EINGETRAGEN! 🔔', sub: 'Vollendet' }
  ]
};

export default function PseudoLoaderModal({ transitionType, onFinish }) {
  const logs = TRANSITION_STEPS_LOGS[transitionType] || TRANSITION_STEPS_LOGS['1-to-2'];
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progress, setProgress] = useState(20);

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
          }, 300);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [logs, onFinish]);

  const currentLog = logs[currentStepIdx] || logs[logs.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-slate-950/70 animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative text-center">
        
        {/* Animated Icon */}
        <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 mx-auto mb-4 flex items-center justify-center text-xl">
          🔔
        </div>

        {/* Dynamic Status Message */}
        <div className="min-h-[3.5rem] flex flex-col items-center justify-center mb-5 px-2">
          <p className="text-sm font-semibold text-white transition-all duration-200">
            {currentLog.text}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {currentLog.sub}
          </p>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Klassenbuch-Sync</span>
          <span className="font-semibold text-slate-300">{progress}%</span>
        </div>

        {/* Skip button */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onFinish();
            }}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mx-auto cursor-pointer transition-colors"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Überspringen</span>
          </button>
        </div>

      </div>
    </div>
  );
}
