import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { sounds } from '../lib/sounds';
import AiTitle from './AiTitle';

const NAME_EXAMPLES = ['Renate B.', 'Patrick W.', 'Benjamin B.'];

export default function StepName({ name, setName, onNext, allVotes = [] }) {
  const [error, setError] = useState('');
  const [exampleIndex, setExampleIndex] = useState(0);

  // Cycle through examples if no name is entered
  useEffect(() => {
    if (name.trim()) return;

    const timer = setInterval(() => {
      setExampleIndex((prev) => (prev + 1) % NAME_EXAMPLES.length);
    }, 2200);

    return () => clearInterval(timer);
  }, [name]);

  const handleNext = (e) => {
    e?.preventDefault();
    if (!name.trim()) {
      sounds.playToggle(false);
      setError('Bitte trag Deinen Namen ein.');
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

      {/* Card with subtle glowing shadow */}
      <div className="rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-800 p-6 sm:p-7 shadow-[0_0_45px_-10px_rgba(192,38,211,0.25)] hover:shadow-[0_0_60px_-5px_rgba(192,38,211,0.35)] transition-shadow duration-500 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-4">
          <AiTitle 
            text="Wer bist Du?" 
            className="font-display text-2xl font-bold text-white tracking-tight mb-1" 
          />
          <p className="text-slate-400 text-xs">
            Trag Deinen Namen ein, um abzustimmen.
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
              placeholder={`z.B. ${NAME_EXAMPLES[exampleIndex]}`}
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
          <div className="overflow-hidden py-2.5 bg-slate-900/40 backdrop-blur-md [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
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

      {/* Badge under Side Scroller */}
      <div className="text-center mt-5 mb-2">
        <span className="inline-block text-[10px] text-white font-mono tracking-wider font-medium px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800">
          Orga-Tool by Bene
        </span>
      </div>
    </div>
  );
}
