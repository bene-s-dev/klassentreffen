import React, { useState, useEffect, useRef } from 'react';
import { Bot, X } from 'lucide-react';
import { sounds } from '../lib/sounds';

export default function NarratorBubble({ currentStep, name, selectedSlotsCount, selectedLocationsCount }) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [displayedWords, setDisplayedWords] = useState([]);
  const [isTyping, setIsTyping] = useState(true);
  const [isThinking, setIsThinking] = useState(true);
  const abortControllerRef = useRef(0);

  // Messages with school, Klassenbuch & Hauswirtschaft jokes
  const message = React.useMemo(() => {
    switch (currentStep) {
      case 1:
        if (!name.trim()) {
          return 'Moin! Trag kurz deinen Namen ein. Kein Fake-Name – das Klassenbuch von damals lügt nicht! 🕶️';
        } else {
          return `Ok. "${name}" ist eingeloggt... lowkey Legende! Klick unten auf Weiter 🔥`;
        }
      case 2:
        if (selectedSlotsCount === 0) {
          return 'Wann kannst du? Kreuz an was geht. Wer schwänzt, kriegt nachträglich einen Klassenbucheintrag! 💀';
        } else if (selectedSlotsCount >= 8) {
          return `Stark, schon ${selectedSlotsCount} Termine! So motiviert warst du damals nicht mal im Hauswirtschaftsunterricht beim Wäsche mangeln! 🧺`;
        } else if (selectedSlotsCount >= 4) {
          return `Nice, ${selectedSlotsCount} Termine am Start! Wir finden garantiert den perfekten Tag.`;
        } else {
          return 'Wähl gern noch ein paar Termine mehr an, damit wir alle an einen Tisch kriegen! 🙌';
        }
      case 3:
        if (selectedLocationsCount === 0) {
          return 'Wo soll es hingehen? Hauswirtschafts-Küche oder lieber gemütliche Kneipe? Schlag auch gern was Eigenes vor!';
        } else {
          return 'Gute Wahl! Hauptsache wir müssen hinterher nicht den Tafeldienst machen... 🍻';
        }
      case 4:
        return 'Fast geschafft! Lass einen Gruß oder eine alte Schul-Anekdote da. Die ganze Klasse liest mit! 💬';
      case 5:
        return 'Eingetragen! Die Stimmen sind ausgewertet. Schick den Link direkt in die WhatsApp-Gruppe! 👑';
      default:
        return 'Klassentreffen 2.0 Orga läuft!';
    }
  }, [currentStep, name, selectedSlotsCount, selectedLocationsCount]);

  // AI-Style Live Word-by-Word Streaming with realistic token pauses
  useEffect(() => {
    abortControllerRef.current += 1;
    const currentRunId = abortControllerRef.current;

    setIsThinking(true);
    setIsTyping(true);
    setDisplayedWords([]);

    const words = message.split(' ');
    let timeoutId;

    timeoutId = setTimeout(() => {
      if (abortControllerRef.current !== currentRunId) return;
      setIsThinking(false);

      let wordIdx = 0;
      const currentStream = [];

      const streamNextWord = () => {
        if (abortControllerRef.current !== currentRunId) return;

        if (wordIdx < words.length) {
          const nextWord = words[wordIdx];
          currentStream.push(nextWord);
          setDisplayedWords([...currentStream]);

          if (wordIdx % 5 === 0) {
            sounds.playPop();
          }

          let delay = 50 + Math.random() * 35;
          if (nextWord.endsWith('.') || nextWord.endsWith('!') || nextWord.endsWith('?')) {
            delay += 200;
          } else if (nextWord.endsWith(',') || nextWord.includes('...')) {
            delay += 120;
          }

          wordIdx += 1;
          timeoutId = setTimeout(streamNextWord, delay);
        } else {
          setIsTyping(false);
        }
      };

      streamNextWord();
    }, 200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [message]);

  if (isDismissed) {
    return (
      <button
        onClick={() => {
          sounds.playPop();
          setIsDismissed(false);
        }}
        className="fixed bottom-20 right-4 z-40 p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 shadow-lg hover:text-white transition-all cursor-pointer"
        title="Tipp einblenden"
      >
        <Bot className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 mb-6">
      <div className="py-2.5 px-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 text-xs text-slate-300">
        
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="text-sm select-none shrink-0">🤖</span>

          <div className="min-w-0 flex-1 leading-normal">
            {isThinking ? (
              <span className="text-slate-500 italic">Schreibt...</span>
            ) : (
              <>
                {displayedWords.join(' ')}
                {isTyping && (
                  <span className="inline-block w-1.5 h-3 ml-1 bg-fuchsia-400 animate-pulse align-middle" />
                )}
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playPop();
            setIsDismissed(true);
          }}
          className="text-slate-500 hover:text-slate-300 p-0.5 shrink-0 cursor-pointer"
          title="Schließen"
        >
          <X className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
}
