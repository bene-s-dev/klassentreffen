import React, { useState } from 'react';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { sounds } from '../lib/sounds';

export default function StepName({ name, setName, onNext, allVotes = [] }) {
  const [error, setError] = useState('');

  const handleNext = (e) => {
    e?.preventDefault();
    if (!name.trim()) {
      sounds.playToggle(false);
      setError('Bitte trag deinen Namen ein.');
      return;
    }
    setError('');
    sounds.playSuccess();
    onNext();
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4 animate-slide-in relative">
      
      {/* Ambient background glow orbs */}
      <div 
        className="w-64 h-64 rounded-full bg-fuchsia-600/15 blur-3xl absolute -top-8 -left-12 animate-pulse-slow pointer-events-none -z-10" 
      />
      <div 
        className="w-64 h-64 rounded-full bg-indigo-600/15 blur-3xl absolute -bottom-10 -right-12 animate-pulse-slow pointer-events-none -z-10" 
      />

      {/* Floating decorative mini-badges */}
      <div className="hidden sm:flex items-center gap-1.5 absolute -top-4 -right-4 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-fuchsia-500/30 text-[11px] text-fuchsia-300 font-medium shadow-lg animate-float pointer-events-none z-20">
        <span>🎒</span>
        <span>Klassenbuch</span>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 absolute -bottom-3 -left-4 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-[11px] text-indigo-300 font-medium shadow-lg animate-float-delayed pointer-events-none z-20">
        <span>🗓️</span>
        <span>Termine</span>
      </div>

      {/* Card with subtle glowing shadow */}
      <div className="rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-800 p-6 sm:p-7 shadow-[0_0_45px_-10px_rgba(192,38,211,0.25)] hover:shadow-[0_0_60px_-5px_rgba(192,38,211,0.35)] transition-shadow duration-500 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="font-display text-2xl font-bold text-white tracking-tight mb-1">
            Wer bist du?
          </h2>
          <p className="text-slate-400 text-xs">
            Trag deinen Namen ein, um abzustimmen.
          </p>
        </div>

        <form onSubmit={handleNext} className="space-y-4">
          <div>
            <label htmlFor="name-input" className="block text-xs font-medium text-slate-300 mb-1.5">
              Dein Name
            </label>
            <input
              id="name-input"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="z.B. Renate B."
              maxLength={45}
              autoFocus
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-white placeholder-slate-600 text-sm font-medium transition-all focus:outline-none ${
                error
                  ? 'border-rose-500'
                  : 'border-slate-800 focus:border-fuchsia-500 focus:shadow-[0_0_20px_-3px_rgba(217,70,239,0.3)]'
              }`}
            />

            {error && (
              <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 animate-fadeIn">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                {error}
              </p>
            )}
          </div>

          <div className="pt-1">
            <button
              type="submit"
              className="group w-full py-2.5 px-4 rounded-xl gradient-btn-primary text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Weiter</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </form>
      </div>

      {/* Social Proof Marquee Ticker - Full Screen Width */}
      {allVotes && allVotes.length > 0 && (
        <div className="w-screen relative left-1/2 -translate-x-1/2 mt-7">
          <p className="text-center text-xs font-medium text-slate-400 mb-2">
            Diese Personen sind schon dabei:
          </p>
          <div className="overflow-hidden py-2.5 bg-slate-900/60 border-y border-slate-800/70 backdrop-blur-md [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="animate-marquee items-center gap-8 text-xs text-slate-200">
              {/* Set 1 */}
              <div className="flex items-center gap-6 shrink-0">
                {allVotes.map((v) => (
                  <span key={v.id || v.name} className="flex items-center gap-2 font-medium text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.8)]"></span>
                    <span>{v.name}</span>
                  </span>
                ))}
              </div>

              {/* Set 2 (for seamless loop) */}
              <div className="flex items-center gap-6 shrink-0" aria-hidden="true">
                {allVotes.map((v) => (
                  <span key={`clone-${v.id || v.name}`} className="flex items-center gap-2 font-medium text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.8)]"></span>
                    <span>{v.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
