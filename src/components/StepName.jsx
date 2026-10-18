import React, { useState } from 'react';
import { ArrowRight, Sparkles, Smile, ShieldAlert } from 'lucide-react';
import { AVATARS } from '../lib/constants';
import { sounds } from '../lib/sounds';

const FUN_NICKNAMES = [
  'Kevin (der Klassenclown)',
  'Lisa (immer 1,0 Schnitt)',
  'Dennis (hat AMG geleast)',
  'Laura (lowkey Influencerin)',
  'Tobi (macht jetzt Krypto)',
  'Sarah (immer noch verpeilt)',
  'Jonas (feiert immer noch im Park)'
];

export default function StepName({ name, setName, avatar, setAvatar, onNext }) {
  const [error, setError] = useState('');

  const handleNext = (e) => {
    e?.preventDefault();
    if (!name.trim()) {
      sounds.playToggle(false);
      setError('Bruder, gib wenigstens deinen Namen ein! Kein Geist sein 👻');
      return;
    }
    setError('');
    sounds.playSuccess();
    onNext();
  };

  const handleRandomNick = () => {
    sounds.playPop();
    const random = FUN_NICKNAMES[Math.floor(Math.random() * FUN_NICKNAMES.length)];
    setName(random);
    setError('');
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 animate-slide-in">
      <div className="glass-panel-highlight rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-2xl border border-white/15">
        
        {/* Glow ambient background inside card */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header Badge */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 text-fuchsia-300 border border-fuchsia-500/30 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
            Schritt 1 von 4 • Identity Check
          </span>
        </div>

        {/* Main Title with Jugend-Slang */}
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Wer bist du eigentlich?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Drop deinen Namen oder deinen alten Spitznamen. <br className="hidden sm:inline" />
            <span className="text-fuchsia-400 font-semibold">Kein Fake-Name, Diggi</span> – wir wollen wissen, wer am Start ist! 🕶️
          </p>
        </div>

        <form onSubmit={handleNext} className="space-y-6 relative z-10">
          
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
              <span>Wähl dein Vibe-Avatar</span>
              <span className="text-slate-500 font-normal">Klick zum Wechseln</span>
            </label>
            <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-900/60 border border-white/10 overflow-x-auto py-3">
              {AVATARS.map((emoji) => {
                const isSelected = avatar === emoji;
                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setAvatar(emoji);
                    }}
                    className={`w-11 h-11 min-w-[2.75rem] text-2xl rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-tr from-fuchsia-600 to-pink-600 shadow-lg shadow-fuchsia-500/40 scale-125 ring-2 ring-white z-10 animate-bounce'
                        : 'hover:bg-slate-800 hover:scale-110 opacity-75 hover:opacity-100'
                    }`}
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name Input Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="name-input" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Dein Name / Spitzname <span className="text-pink-400">*</span>
              </label>
              <button
                type="button"
                onClick={handleRandomNick}
                className="text-xs text-fuchsia-400 hover:text-fuchsia-300 underline underline-offset-2 flex items-center gap-1 font-medium hover:scale-105 transition-transform"
              >
                <Smile className="w-3.5 h-3.5" />
                Zufälliger Nickname?
              </button>
            </div>

            <div className="relative group">
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="z.B. Timmy (der immer geschwänzt hat)"
                maxLength={45}
                autoFocus
                className={`w-full px-5 py-4 rounded-2xl bg-slate-900/90 border text-white placeholder-slate-500 text-lg font-medium transition-all duration-300 focus:outline-none shadow-inner ${
                  error
                    ? 'border-rose-500 ring-2 ring-rose-500/30'
                    : 'border-white/15 focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/20 group-hover:border-white/30'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl select-none pointer-events-none">
                {avatar}
              </span>
            </div>

            {error && (
              <p className="mt-2 text-xs font-semibold text-rose-400 flex items-center gap-1.5 animate-pulse">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                {error}
              </p>
            )}
          </div>

          {/* Action CTA Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl glass-button-primary text-white font-display font-bold text-lg tracking-wide flex items-center justify-center gap-3 cursor-pointer group shadow-xl"
            >
              <span>Abfahrt! Weiter zu den Terminen</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </div>

          {/* Micro Footer note */}
          <p className="text-center text-xs text-slate-500">
            🔒 Null Login, kein Passwort, kein Spam. Einfach eintragen und ab geht die Post.
          </p>

        </form>
      </div>
    </div>
  );
}
