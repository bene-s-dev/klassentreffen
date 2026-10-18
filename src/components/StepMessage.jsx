import React, { useState } from 'react';
import { ArrowLeft, Send, FastForward, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SLANG_QUOTES } from '../lib/constants';
import { sounds } from '../lib/sounds';

export default function StepMessage({ 
  message, 
  setMessage, 
  name, 
  selectedSlots, 
  selectedLocations, 
  customLocation, 
  onSubmit, 
  onBack, 
  isSubmitting
}) {
  const addQuote = (quote) => {
    sounds.playPop();
    if (!message) {
      setMessage(quote);
    } else {
      setMessage(`${message} ${quote}`);
    }
  };

  const handleFinish = async (skipMessage = false) => {
    sounds.playSuccess();
    
    if (skipMessage) {
      setMessage('');
    }

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}

    await onSubmit(skipMessage ? '' : message);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 pb-24 animate-slide-in">
      
      {/* Title */}
      <div className="text-center mb-4">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
          Gruß an die Klasse 💬
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Optional: Lass eine Nachricht da oder überspringe diesen Schritt.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl mb-6">
        
        {/* Quick summary badge */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80 text-xs">
          <span className="font-semibold text-white">{name}</span>
          <span className="text-slate-400">
            {selectedSlots.length} Tage • {selectedLocations.length + (customLocation ? 1 : 0)} Locations
          </span>
        </div>

        {/* Quick Quote Pills */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-400 mb-2">
            Schnelle Vorlagen
          </label>
          <div className="flex flex-wrap gap-1.5">
            {SLANG_QUOTES.slice(0, 5).map((quote) => (
              <button
                key={quote}
                type="button"
                onClick={() => addQuote(quote)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
              >
                {quote}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="mb-2">
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Deine Nachricht an alle (kannst du auch leer lassen)..."
            maxLength={300}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-fuchsia-500 transition-colors resize-none"
          />
          <div className="flex justify-end text-[11px] text-slate-500 mt-1">
            <span>{message.length} / 300</span>
          </div>
        </div>

      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 backdrop-blur-md bg-slate-950/80 border-t border-slate-800">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              sounds.playPop();
              onBack();
            }}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Zurück</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleFinish(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Überspringen</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleFinish(false)}
              className="px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-display font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Speichern...</span>
                </>
              ) : (
                <>
                  <span>Fertigstellen</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
