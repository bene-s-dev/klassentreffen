import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { sounds, audio } from '../lib/sounds';
import { magicEffects } from '../lib/magicEffects';
import AiTitle from './AiTitle';

const NAME_EXAMPLES = ['Patrick W.', 'Benjamin B.'];

export default function StepName({ name, setName, onNext, allVotes = [] }) {
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [displayedExample, setDisplayedExample] = useState('');
  const [exampleIndex, setExampleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter animation: types letter by letter, pauses, deletes, and switches to next example
  // Starts empty, "z. B. " stays static, and pauses while user is typing or focused
  useEffect(() => {
    if (name.trim() || isFocused) return;

    const currentWord = NAME_EXAMPLES[exampleIndex];
    let timeoutId;

    if (!isDeleting) {
      if (displayedExample.length < currentWord.length) {
        // Initial delay on empty start (650ms), then natural typing speed (100ms)
        const delay = displayedExample.length === 0 ? 650 : 100;
        timeoutId = setTimeout(() => {
          setDisplayedExample(currentWord.slice(0, displayedExample.length + 1));
        }, delay);
      } else {
        // Pause once full word is typed before starting deletion
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (displayedExample.length > 0) {
        // Backspacing speed (50ms per character)
        timeoutId = setTimeout(() => {
          setDisplayedExample(currentWord.slice(0, displayedExample.length - 1));
        }, 50);
      } else {
        // Pause briefly on empty before typing next name
        timeoutId = setTimeout(() => {
          setIsDeleting(false);
          setExampleIndex((prev) => (prev + 1) % NAME_EXAMPLES.length);
        }, 450);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [name, isFocused, displayedExample, isDeleting, exampleIndex]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (error) setError('');

    // 1. Klangerzeugung beim Tippen: playTypeDroplet(charLength)
    audio.playTypeDroplet(val.length);

    // 2. Partikelsystem beim Tippen: emitTypingSparkle(x, y) mit räumlichem Caret-Tracking
    const coords = magicEffects.getCaretCoordinates(e.target);
    magicEffects.emitTypingSparkle(coords.x, coords.y);
  };

  const handleNext = (e) => {
    e?.preventDefault();
    if (!name.trim()) {
      sounds.playToggle(false);
      setError('Bitte trag Deinen Namen ein.');
      return;
    }
    setError('');
    sounds.playPop();
    onNext();
  };

  return (
    <div className="w-full max-w-sm mx-auto px-3 sm:px-4 animate-slide-in relative">
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
              onChange={handleInputChange}
              onFocus={() => {
                setIsFocused(true);
                audio.init();
                magicEffects.initCanvas();
              }}
              onBlur={() => setIsFocused(false)}
              placeholder={`z. B. ${displayedExample}`}
              maxLength={45}
              style={{ fontSize: '16px' }}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-white placeholder-slate-600 text-base font-medium transition-colors focus:outline-none ${
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

      {/* Social Proof: Clean Badge when few participants (<5), Marquee when 5+ */}
      {allVotes && allVotes.length > 0 && (
        <div className="mt-7">
          <p className="text-center text-xs font-medium text-slate-400 mb-2.5">
            {allVotes.length === 1 
              ? 'Schon 1 Person ist dabei:' 
              : `${allVotes.length} Personen sind schon dabei:`}
          </p>

          {allVotes.length < 5 ? (
            /* Centered badges - every voter name appears exactly ONCE */
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto px-2">
              {allVotes.map((v) => (
                <span 
                  key={v.id || v.name} 
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-200 shadow-sm"
                >
                  <span>{v.name}</span>
                </span>
              ))}
            </div>
          ) : (
            /* Marquee ticker when 5+ people - each name appears once per set */
            <div className="w-full max-w-full overflow-hidden">
              <div className="overflow-hidden py-2.5 bg-slate-900/40 backdrop-blur-md [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                <div className="animate-marquee items-center gap-8 text-xs text-slate-200">
                  {/* Set 1 */}
                  <div className="flex items-center gap-8 shrink-0">
                    {allVotes.map((v) => (
                      <span key={v.id || v.name} className="font-medium text-slate-200">
                        {v.name}
                      </span>
                    ))}
                  </div>

                  {/* Set 2 (for seamless endless loop) */}
                  <div className="flex items-center gap-8 shrink-0" aria-hidden="true">
                    {allVotes.map((v) => (
                      <span key={`clone-${v.id || v.name}`} className="font-medium text-slate-200">
                        {v.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
