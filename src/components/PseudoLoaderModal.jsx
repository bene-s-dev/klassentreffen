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
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);

  const cleanName = voterName.trim() || 'Schüler/in';
  const config = LOADING_CONFIG[transitionType] || {
    sentence: 'Klassenbuch-Eintrag wird geladen...',
    badge: 'Klassenbuch-Check',
    icon: '📖'
  };

  // Humor tailored directly to step 1 (Klassenbuch)
  const getAiMessage = () => {
    switch (transitionType) {
      case '1-to-2':
        return `"${cleanName}" steht tatsächlich im Klassenbuch!\nIch habe gehört, Deine versiffte Schürze aus dem Kochunterricht hängt noch im Spind.`;
      default:
        return `Eingabe geprüft! Klassenbuch-Eintrag erfolgreich aktualisiert.`;
    }
  };

  const aiMessage = getAiMessage();

  // Word-by-word AI streaming simulation with dynamic natural pauses
  useEffect(() => {
    const words = aiMessage.split(' ').filter(Boolean);
    let index = 0;
    setDisplayedText('');
    setIsTypingDone(false);

    let timeoutId;

    const streamNextWord = () => {
      if (index >= words.length) {
        setIsTypingDone(true);
        return;
      }

      const currentWord = words[index];
      index++;
      setDisplayedText(words.slice(0, index).join(' '));

      if (index >= words.length) {
        setIsTypingDone(true);
        return;
      }

      // Calculate realistic pause for next word:
      let delay = 55 + Math.floor(Math.random() * 60);

      // Punctuation pauses (sentence end or comma)
      if (/[.!?]$/.test(currentWord)) {
        delay = 200 + Math.floor(Math.random() * 80);
      } else if (/[,;:]$/.test(currentWord)) {
        delay = 140 + Math.floor(Math.random() * 60);
      } else if (Math.random() < 0.15) {
        delay = 160 + Math.floor(Math.random() * 70);
      }

      timeoutId = setTimeout(streamNextWord, delay);
    };

    // Initial slight pause before streaming begins
    timeoutId = setTimeout(streamNextWord, 100);

    return () => clearTimeout(timeoutId);
  }, [aiMessage]);

  const handleContinue = () => {
    sounds.playPop();
    onFinish();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-slate-950/85 animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl relative text-center min-h-[250px] flex flex-col justify-between">
        
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

      </div>
    </div>
  );
}
