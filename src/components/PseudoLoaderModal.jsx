import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { sounds } from '../lib/sounds';

const LOADING_CONFIG = {
  '1-to-2': {
    sentence: 'Name wird durch die Heißmangel gezogen und im Kochunterricht-Buch gesucht...',
    badge: 'Heißmangel & Kochunterricht'
  },
  '2-to-3': {
    sentence: 'Termine werden mit dem Solarium-Plan und Nähmaschinen-Kurs synchronisiert...',
    badge: 'Solarium & Nähmaschine'
  },
  '3-to-4': {
    sentence: 'Locations werden auf Blumen-Binden und Heißmangel-Sicherheit geprüft...',
    badge: 'Floristik & Gastro-Check'
  },
  'final-submit': {
    sentence: 'Stimme wird floristisch gebunden, gemangelt und mit Zickzackstich versiegelt...',
    badge: 'Hauswirtschafts-Abschluss'
  }
};

export default function PseudoLoaderModal({ 
  transitionType, 
  voterName = '', 
  selectedSlotsCount = 0,
  locationsCount = 0,
  onFinish 
}) {
  const [phase, setPhase] = useState('loading'); // 'loading' | 'typing'
  const [progress, setProgress] = useState(5);
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const autoFinishTimerRef = useRef(null);

  const cleanName = voterName.trim() || 'Schüler/in';
  const config = LOADING_CONFIG[transitionType] || {
    sentence: 'Wäsche wird gemangelt und Daten werden verarbeitet...',
    badge: 'Hauswirtschafts-Check'
  };

  // Build the witty retro Hauswirtschaft / Solarium AI message
  const getAiMessage = () => {
    switch (transitionType) {
      case '1-to-2':
        return `"${cleanName}" ist freigegeben! Damals im Kochunterricht zwar die Mehlschwitze angebrannt und im Solarium mit Schutzbrille eingepennt – aber fürs Treffen absolut tauglich.`;
      
      case '2-to-3': {
        const tagWord = selectedSlotsCount === 1 ? 'Tag' : 'Tage';
        return `Termine glattgemangelt! ${selectedSlotsCount} ${tagWord} eingeloggt. Der Unterfaden der Nähmaschine sitzt, Wäsche ist durch die Walze – keine Überschneidung mit der Solarium-Flatrate.`;
      }
      
      case '3-to-4':
        return `Location-Wahl genehmigt! Blumen binden und Kochtopf-Schrubben fallen offiziell aus. Freiburg wird unsicher gemacht – Solarium-Bräune sitzt schon!`;
      
      case 'final-submit':
        return `Klassenbuch-Eintrag versiegelt! Floristisch perfekt gebunden, mit der Nähmaschine doppelt versteppt und faltenfrei wie frisch gemangelte Bettwäsche. Ab zu den Ergebnissen!`;
      
      default:
        return `Alles glatt wie frisch gemangelte Wäsche! Unterfaden sitzt, weiter geht's.`;
    }
  };

  const aiMessage = getAiMessage();

  // Phase 1: Loader runs ~2.4 seconds (comfortable reading time + progress)
  useEffect(() => {
    sounds.playPop();
    const startTime = Date.now();
    const duration = 2400; // 2.4 seconds

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(timer);
        sounds.playSuccess();
        setPhase('typing');
      }
    }, 40);

    return () => clearInterval(timer);
  }, []);

  // Phase 2: Typing effect
  useEffect(() => {
    if (phase !== 'typing') return;

    let index = 0;
    setDisplayedText('');
    setIsTypingDone(false);

    const typingSpeed = 20; // ms per character
    const typingInterval = setInterval(() => {
      index++;
      setDisplayedText(aiMessage.slice(0, index));

      if (index >= aiMessage.length) {
        clearInterval(typingInterval);
        setIsTypingDone(true);
        sounds.playPop();

        // Auto-continue after 2.3 seconds if user doesn't click "Weiter"
        autoFinishTimerRef.current = setTimeout(() => {
          onFinish();
        }, 2300);
      }
    }, typingSpeed);

    return () => {
      clearInterval(typingInterval);
      if (autoFinishTimerRef.current) {
        clearTimeout(autoFinishTimerRef.current);
      }
    };
  }, [phase, aiMessage, onFinish]);

  const handleManualContinue = () => {
    if (autoFinishTimerRef.current) {
      clearTimeout(autoFinishTimerRef.current);
    }
    sounds.playPop();
    onFinish();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-slate-950/80 animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative text-center">
        
        {phase === 'loading' ? (
          <div className="animate-fadeIn">
            {/* Animated Loading Icon */}
            <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 mx-auto mb-4 flex items-center justify-center text-xl animate-pulse">
              🧺
            </div>

            {/* Exactly ONE clear status sentence */}
            <div className="min-h-[2.5rem] flex items-center justify-center mb-5 px-2">
              <p className="text-sm font-semibold text-white">
                {config.sentence}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-indigo-500 transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{config.badge}</span>
              <span className="font-semibold text-slate-300">{progress}%</span>
            </div>
          </div>
        ) : (
          <div className="animate-scaleIn text-left">
            {/* AI Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center text-sm">
                  🪡
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Hauswirtschafts-KI</span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
                  </h4>
                  <p className="text-[10px] text-slate-400">Heißmangel & Solarium Check</p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>Bestanden</span>
              </span>
            </div>

            {/* Pseudo AI Typing Bubble */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 min-h-[4.5rem] mb-4">
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {displayedText}
                {!isTypingDone && (
                  <span className="inline-block w-1.5 h-3.5 ml-1 bg-fuchsia-400 animate-pulse align-middle" />
                )}
              </p>
            </div>

            {/* Action Button - Released immediately or auto after 2.3s */}
            <button
              type="button"
              onClick={handleManualContinue}
              className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isTypingDone
                  ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-md animate-fadeIn'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{isTypingDone ? 'Weiter geht\'s' : 'Überspringen'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
