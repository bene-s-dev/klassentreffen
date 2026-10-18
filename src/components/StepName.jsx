import React, { useState } from 'react';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { AVATARS } from '../lib/constants';
import { sounds } from '../lib/sounds';

export default function StepName({ name, setName, avatar, setAvatar, onNext }) {
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
    <div className="w-full max-w-sm mx-auto px-4 animate-slide-in">
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
        
        {/* Title */}
        <div className="text-center mb-5">
          <h2 className="font-display text-2xl font-bold text-white tracking-tight mb-1">
            Wer bist du?
          </h2>
          <p className="text-slate-400 text-xs">
            Trag kurz deinen Namen ein, um abzustimmen.
          </p>
        </div>

        <form onSubmit={handleNext} className="space-y-4">
          
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Avatar wählen
            </label>
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto py-2">
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
                    className={`w-8 h-8 min-w-[2rem] text-lg rounded-lg flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-fuchsia-600 text-white scale-105'
                        : 'hover:bg-slate-850 opacity-60 hover:opacity-100'
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
            <label htmlFor="name-input" className="block text-xs font-medium text-slate-300 mb-1.5">
              Dein Name
            </label>
            <div className="relative">
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Name eingeben..."
                maxLength={45}
                autoFocus
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-white placeholder-slate-600 text-sm font-medium transition-colors focus:outline-none ${
                  error
                    ? 'border-rose-500'
                    : 'border-slate-800 focus:border-fuchsia-500'
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg select-none pointer-events-none">
                {avatar}
              </span>
            </div>

            {error && (
              <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                {error}
              </p>
            )}
          </div>

          {/* Action CTA Button */}
          <div className="pt-1">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <span>Weiter zu den Terminen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
