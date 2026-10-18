import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { sounds } from '../lib/sounds';

const LOADING_CONFIG = {
  '1-to-2': {
    sentence: 'Name wird mit dem alten Klassenbuch verglichen...',
    badge: 'Klassenbuch-Abgleich',
    icon: '📖'
  },
  '2-to-3': {
    sentence: 'Termine werden mit Fehlzeiten an der Heißmangel abgeglichen...',
    badge: 'Heißmangel & Termine',
    icon: '🧺'
  },
  '3-to-4': {
    sentence: 'Location wird auf Ambiente und Floristik geprüft...',
    badge: 'Floristik & Solarium',
    icon: '💐'
  },
  'final-submit': {
    sentence: 'Zettelchen wird heimlich unter der Schulbank nach hinten durchgereicht...',
    badge: 'Klassen-Geheimpost',
    icon: '📝'
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
    sentence: 'Daten werden mit dem Klassenbuch abgeglichen...',
    badge: 'Klassenbuch-Check',
    icon: '📖'
  };

  // Humor tailored directly to each step
  const getAiMessage = () => {
    switch (transitionType) {
      case '1-to-2':
        return `"${cleanName}" steht tatsächlich im Klassenbuch! Der alte Tadel wegen vergessener Schürze im Kochunterricht ist zum Glück verjährt.`;
      
      case '2-to-3': {
        const tagWord = selectedSlotsCount === 1 ? 'Tag' : 'Tage';
        if (selectedSlotsCount === 1) {
          return `Nur 1 Tag ausgewählt? So oft hast du damals mindestens pro Woche das Wäsche-Mangeln geschwänzt!`;
        }
        return `${selectedSlotsCount} ${tagWord} ausgewählt – so oft hast du damals nicht mal das Wäsche-Mangeln geschwänzt!`;
      }
      
      case '3-to-4':
        return `Starke Location! Hoffentlich sind die Blumen vor Ort besser gebunden als damals im Unterricht – und geh vorher nicht zu lang ins Solarium!`;
      
      case 'final-submit':
        return `Erfolgreich nach hinten durchgereicht, ohne dass der Lehrer es gemerkt hat! Deine Stimme ist verewigt. Ab zu den Ergebnissen!`;
      
      default:
        return `Eingabe geprüft! Klassenbuch-Eintrag erfolgreich aktualisiert.`;
    }
  };

  const aiMessage = getAiMessage();

  // Phase 1: Loader runs ~2.4 seconds
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
            {/* Animated Loading Icon tailored to step */}
            <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 mx-auto mb-4 flex items-center justify-center text-xl animate-pulse">
              {config.icon}
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
                <div className="w-7 h-7 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center text-sm">
                  {config.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Klassenbuch-KI</span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </h4>
                  <p className="text-[10px] text-slate-400">{config.badge}</p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>Geprüft</span>
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
