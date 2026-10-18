import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { sounds } from '../lib/sounds';

const LOADING_CONFIG = {
  '1-to-2': {
    sentence: 'Name wird mit dem alten Klassenbuch verglichen...',
    badge: 'Klassenbuch-Abgleich',
    icon: '📖'
  },
  '2-to-3': {
    sentence: 'Termine werden per pq-Formel berechnet...',
    badge: 'pq-Formel & Mathe',
    icon: '📐'
  },
  '3-to-4': {
    sentence: 'Locations werden in Freiburg geprüft...',
    badge: 'Location & Freiburg',
    icon: '📍'
  },
  'final-submit': {
    sentence: 'Tippgeschwindigkeit wird mit dem 10-Finger-Schreibkurs bei Frau Blessing abgeglichen...',
    badge: 'Frau Blessing & 10-Finger-System',
    icon: '⌨️'
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
        return `"${cleanName}" steht tatsächlich im Klassenbuch!\n Ich habe gehört Deine versiffte Schürze aus dem Kochunterricht hängt noch im Spind.`;
      
      case '2-to-3': {
        const tagWord = selectedSlotsCount === 1 ? 'Tag' : 'Tage';
        return `x₁,₂ = ${selectedSlotsCount} ${tagWord} ausgewählt. Besser als nichts.`;
      }
      
      case '3-to-4':
        return `Gute Wahl, ich wäre ja lieber ins Solarium gegangen 😎`;
      
      case 'final-submit':
        return `Frau Blessing wäre stolz: Sauber im 10-Finger-System ohne auf die Tastatur zu schauen abgetippt! Deine Stimme ist verewigt. Ab zu den Ergebnissen!`;
      
      default:
        return `Eingabe geprüft! Klassenbuch-Eintrag erfolgreich aktualisiert.`;
    }
  };

  const aiMessage = getAiMessage();

  // Phase 1: Loader runs ~2.4s (first loader 2/3 time = 1.6s)
  useEffect(() => {
    sounds.playPop();
    const startTime = Date.now();
    const duration = transitionType === '1-to-2' ? 1600 : 2400;

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

  // Phase 2: Word-by-word AI streaming simulation with dynamic natural pauses
  useEffect(() => {
    if (phase !== 'typing') return;

    const words = aiMessage.split(' ').filter(Boolean);
    let index = 0;
    setDisplayedText('');
    setIsTypingDone(false);

    let timeoutId;

    const streamNextWord = () => {
      if (index >= words.length) {
        setIsTypingDone(true);
        sounds.playPop();
        return;
      }

      const currentWord = words[index];
      index++;
      setDisplayedText(words.slice(0, index).join(' '));

      if (index >= words.length) {
        setIsTypingDone(true);
        sounds.playPop();
        return;
      }

      // Calculate realistic AI pause for next word:
      let delay = 65 + Math.floor(Math.random() * 70); // Base word delay: 65ms - 135ms

      // Punctuation pauses (sentence end or comma)
      if (/[.!?]$/.test(currentWord)) {
        delay = 240 + Math.floor(Math.random() * 100); // 240ms - 340ms
      } else if (/[,;:]$/.test(currentWord)) {
        delay = 160 + Math.floor(Math.random() * 80); // 160ms - 240ms
      } else if (Math.random() < 0.18) {
        // Occasional natural "thinking" hesitation
        delay = 190 + Math.floor(Math.random() * 90);
      }

      timeoutId = setTimeout(streamNextWord, delay);
    };

    // Initial slight pause before streaming begins (AI generation start)
    timeoutId = setTimeout(streamNextWord, 160);

    return () => clearTimeout(timeoutId);
  }, [phase, aiMessage]);

  const handleContinue = () => {
    sounds.playPop();
    onFinish();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-slate-950/85 animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl relative text-center min-h-[250px] flex flex-col justify-between">
        
        {phase === 'loading' ? (
          <div className="animate-fadeIn flex flex-col justify-between flex-1 py-1">
            <div>
              {/* Animated Loading Icon tailored to step */}
              <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 mx-auto mb-4 flex items-center justify-center text-xl animate-pulse">
                {config.icon}
              </div>

              {/* Exactly ONE clear status sentence */}
              <div className="min-h-[2.5rem] flex items-center justify-center px-2">
                <p className="text-sm font-semibold text-white">
                  {config.sentence}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-6">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-indigo-500 transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="animate-fadeIn flex flex-col justify-between flex-1">
            <div>
              {/* Clean Icon */}
              <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 mx-auto mb-3 flex items-center justify-center text-2xl shrink-0">
                {config.icon}
              </div>

              {/* Pure text with multiline support */}
              <div className="min-h-[5.5rem] flex items-center justify-center px-1">
                <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed whitespace-pre-line">
                  {displayedText}
                  {!isTypingDone && (
                    <span className="inline-block w-1.5 h-4 ml-1 bg-fuchsia-400 animate-pulse align-middle" />
                  )}
                </p>
              </div>
            </div>

            {/* "Weiter" Button is visible immediately (grayed out until typing finishes) */}
            <div className="pt-2">
              <button
                type="button"
                disabled={!isTypingDone}
                onClick={isTypingDone ? handleContinue : undefined}
                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                  isTypingDone
                    ? 'gradient-btn-primary text-white cursor-pointer shadow-md'
                    : 'bg-slate-800/80 border border-slate-700/60 text-slate-500 cursor-not-allowed opacity-50'
                }`}
              >
                <span>Weiter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
