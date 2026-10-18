import React, { useState } from 'react';
import { MessageSquare, ArrowLeft, Send, CheckCheck, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SLANG_QUOTES } from '../lib/constants';
import { sounds } from '../lib/sounds';

export default function StepMessage({ 
  message, 
  setMessage, 
  name, 
  avatar, 
  selectedSlots, 
  selectedLocations, 
  customLocation, 
  onSubmit, 
  onBack, 
  isSubmitting 
}) {
  const [selectedQuote, setSelectedQuote] = useState('');

  const addQuote = (quote) => {
    sounds.playPop();
    setSelectedQuote(quote);
    if (!message) {
      setMessage(quote);
    } else {
      setMessage(`${message} ${quote}`);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    sounds.playSuccess();
    
    // Confetti blast!
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b']
      });
    } catch {}

    await onSubmit();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-28 animate-slide-in">
      
      {/* Intro Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 text-purple-300 border border-purple-500/30 mb-3">
          <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
          Schritt 4 von 4 • Nachricht an die Bande
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Drop deinen Gruß an die Bande 💬
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto">
          Hinterlass eine Nachricht, eine alte Anekdote oder einen witzigen Spruch. <br className="hidden sm:inline" />
          Erscheint live auf der <span className="text-fuchsia-400 font-semibold">Wall of Fame</span>!
        </p>
      </div>

      <div className="glass-panel-highlight rounded-3xl p-6 sm:p-8 border border-white/15 relative overflow-hidden shadow-2xl mb-8">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Voting Summary Snapshot */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 rounded-xl bg-slate-800 border border-white/10 select-none">
              {avatar}
            </span>
            <div>
              <p className="font-bold text-sm text-white">{name}</p>
              <p className="text-slate-400">
                {selectedSlots.length} Termine • {selectedLocations.length + (customLocation ? 1 : 0)} Spots gewählt
              </p>
            </div>
          </div>
          <span className="text-emerald-400 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1 self-start sm:self-auto">
            <CheckCheck className="w-3.5 h-3.5" /> Bereit zum Abschicken
          </span>
        </div>

        {/* Slang Quick-Quote Pills */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
            <span>Schnelle Sprüche &amp; Badges (Klick zum Einfügen)</span>
            <span className="text-fuchsia-400 text-[11px] font-semibold">No cap 🔥</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {SLANG_QUOTES.map((quote) => {
              const isUsed = message.includes(quote);
              return (
                <button
                  key={quote}
                  type="button"
                  onClick={() => addQuote(quote)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    isUsed
                      ? 'bg-fuchsia-500/25 border-fuchsia-400 text-fuchsia-200 shadow-sm scale-105'
                      : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/30 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  {quote}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message Input Box */}
        <div className="mb-6">
          <label htmlFor="message-input" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Deine Nachricht (Optional, aber ehrenvoll)
          </label>
          <textarea
            id="message-input"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="z.B. Lowkey habe ich mich 0 verändert! Bringt alte Fotos mit und erste Runde geht auf meinen Nacken..."
            maxLength={350}
            className="w-full px-5 py-4 rounded-2xl bg-slate-900/90 border border-white/15 text-white placeholder-slate-500 text-sm sm:text-base font-medium transition-all duration-300 focus:outline-none focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/20 shadow-inner resize-none"
          />
          <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
            <span>
              {message.length > 200 ? '🔥 Wild, kompletter Roman!' : 'Lowkey sympathisch'}
            </span>
            <span>{message.length} / 350 Zeichen</span>
          </div>
        </div>

      </div>

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 backdrop-blur-2xl bg-slate-950/85 border-t border-white/15 shadow-2xl">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              sounds.playPop();
              onBack();
            }}
            className="px-4 py-3 rounded-2xl bg-slate-900/90 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Zurück</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="px-6 py-3.5 rounded-2xl glass-button-primary text-white font-display font-bold text-base sm:text-lg flex items-center gap-2.5 cursor-pointer shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Wird gespeichert...</span>
              </>
            ) : (
              <>
                <span>Scheppert! Stimme abschicken</span>
                <Send className="w-5 h-5 animate-pulse" />
              </>
            )}
          </button>

        </div>
      </div>

    </div>
  );
}
