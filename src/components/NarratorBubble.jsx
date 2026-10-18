import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, MessageSquare, Volume2, X } from 'lucide-react';
import { sounds } from '../lib/sounds';

export default function NarratorBubble({ currentStep, name, selectedSlotsCount, selectedLocationsCount }) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [displayText, setDisplayText] = useState('');

  // Determine message based on state
  const message = React.useMemo(() => {
    switch (currentStep) {
      case 1:
        if (!name.trim()) {
          return 'Yo! Willkommen im Klassentreffen 2.0 Headquarter. Hier kannst du erstmal deinen Namen angeben... Mach kein Auge mit Fake-Namen, wir wissen eh wer du bist! 🕶️';
        } else {
          return `Ok. "${name}" ist ja mal mega wild... lowkey Legende! Klick unten auf Abfahrt, wenn du ready bist 🔥`;
        }
      case 2:
        if (selectedSlotsCount === 0) {
          return 'Jetzt wirds ernst: Wann kannst du? Wähl so viele Slots wie möglich an den Wochenenden. Wer nicht kann ist lowkey lost! 💀';
        } else if (selectedSlotsCount >= 8) {
          return `Mashallah, schon ${selectedSlotsCount} Termine?! Du bist ja flexibler als eine parabolische Hyperbelfunktion! Ehrenmann! 🚀`;
        } else if (selectedSlotsCount >= 4) {
          return `Nice, ${selectedSlotsCount} Termine am Start! Das System berechnet im Hintergrund schon die maximale Schnittmenge.`;
        } else {
          return 'Gönn dir ruhig noch ein paar mehr Termine, damit wir alle an einem Tag zusammenkriegen! 🙌';
        }
      case 3:
        if (selectedLocationsCount === 0) {
          return 'Wo soll der Abriss stattfinden? Die Kneipe ist ein stabiler Klassiker, aber schlag ruhig was Eigenes vor!';
        } else {
          return 'Stabile Auswahl! Hoffentlich reicht der Vorrat an Kaltgetränken für diese Location... 🍻';
        }
      case 4:
        return 'Fast geschafft! Jetzt noch einmal einen Gruß oder Anekdote hinterlassen. Die ganze Bande liest mit! 💬';
      case 5:
        return 'Boom! Deine Stimme ist eingeloggt. Die Matrix wird live ausgewertet. Teil den Link in der WhatsApp-Gruppe! 👑';
      default:
        return 'Das Orga-Tool regelt das für euch!';
    }
  }, [currentStep, name, selectedSlotsCount, selectedLocationsCount]);

  // Typing effect simulation
  useEffect(() => {
    setDisplayText('');
    let idx = 0;
    const timer = setInterval(() => {
      idx += 2;
      setDisplayText(message.slice(0, idx));
      if (idx >= message.length) {
        clearInterval(timer);
      }
    }, 18);

    return () => clearInterval(timer);
  }, [message]);

  if (isDismissed) {
    return (
      <button
        onClick={() => {
          sounds.playPop();
          setIsDismissed(false);
        }}
        className="fixed bottom-24 right-4 z-40 p-2.5 rounded-full bg-gradient-to-tr from-fuchsia-600 to-indigo-600 text-white shadow-xl hover:scale-110 transition-transform cursor-pointer border border-white/20"
        title="Orga-Bot öffnen"
      >
        <Bot className="w-5 h-5 animate-pulse" />
      </button>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-6 animate-slide-in">
      <div className="p-3.5 sm:p-4 rounded-2xl glass-panel-highlight border border-fuchsia-500/30 shadow-xl relative overflow-hidden flex items-start gap-3">
        
        {/* Animated Bot Avatar */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fuchsia-600 via-pink-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-fuchsia-500/30 animate-float">
          <Bot className="w-5 h-5" />
        </div>

        {/* Text Area */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-display font-bold text-xs text-fuchsia-300">
              Orga-Bot
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
              Online • Tech by Bene
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed min-h-[2.5rem]">
            {displayText}
            <span className="inline-block w-1.5 h-3.5 ml-1 bg-fuchsia-400 animate-pulse align-middle" />
          </p>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => {
            sounds.playPop();
            setIsDismissed(true);
          }}
          className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer transition-colors"
          title="Minimieren"
        >
          <X className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
}
