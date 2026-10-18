import React from 'react';
import { X, Send, FastForward, Loader2 } from 'lucide-react';
import { SLANG_QUOTES } from '../lib/constants';
import { sounds } from '../lib/sounds';
import AiTitle from './AiTitle';

export default function StepMessage({ 
  message, 
  setMessage, 
  name, 
  selectedSlots, 
  selectedLocations, 
  customLocation, 
  onSubmit, 
  onClose, 
  isSubmitting
}) {
  const addQuote = (quote) => {
    sounds.playPop();
    if (!message) {
      setMessage(quote);
    } else {
      setMessage(`${message} ${quote}`.trim());
    }
  };

  const handleFinish = async (skipMessage = false) => {
    sounds.playSuccess();
    if (skipMessage) {
      setMessage('');
    }
    await onSubmit(skipMessage ? '' : message);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          sounds.playPop();
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-2xl relative animate-scaleUp">
        
        {/* Close Button */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Schließen"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="text-center mb-4 pr-6">
          <AiTitle 
            text="Gruß an die Klasse 💬" 
            className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight mb-1" 
          />
          <p className="text-slate-400 text-xs">
            Optional: Lass eine Nachricht da oder überspringe diesen Schritt.
          </p>
        </div>

        {/* Quick summary badge */}
        <div className="flex items-center justify-between mb-3 text-xs px-1 text-slate-400">
          <span className="font-semibold text-white">{name}</span>
          <span>
            {selectedSlots.length} Tage • {selectedLocations.length + (customLocation ? 1 : 0)} Locations
          </span>
        </div>

        {/* Quick Quote Pills */}
        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
            Schnelle Vorlagen
          </label>
          <div className="flex flex-wrap gap-1.5">
            {SLANG_QUOTES.slice(0, 5).map((quote) => (
              <button
                key={quote}
                type="button"
                onClick={() => addQuote(quote)}
                className="text-xs px-2.5 py-1 rounded-lg gradient-btn-subtle text-slate-300 hover:text-white transition-all cursor-pointer shadow-xs"
              >
                {quote}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="mb-3">
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Deine Nachricht an alle (kannst Du auch leer lassen)..."
            maxLength={300}
            style={{ fontSize: '16px' }}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-base font-normal focus:outline-none focus:border-fuchsia-500 transition-colors resize-none"
          />
          <div className="flex justify-end text-[11px] text-slate-500 mt-1">
            <span>{message.length} / 300</span>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between gap-2.5 pt-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleFinish(true)}
            className="px-3.5 py-2 rounded-xl gradient-btn-subtle text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Überspringen</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleFinish(false)}
            className="px-4 py-2 rounded-xl gradient-btn-primary text-white font-display font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Speichern...</span>
              </>
            ) : (
              <>
                <span>Abschicken</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
