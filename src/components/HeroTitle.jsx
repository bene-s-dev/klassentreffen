import React, { useState, useEffect } from 'react';

export default function HeroTitle() {
  const [impact2, setImpact2] = useState(false);
  const [impactDot, setImpactDot] = useState(false);
  const [impact0, setImpact0] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setImpact2(true), 680);
    const t2 = setTimeout(() => setImpactDot(true), 1150);
    const t3 = setTimeout(() => setImpact0(true), 1620);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight py-1 flex items-center justify-center flex-wrap gap-x-2">
      <span className="animate-title-glow">
        Klassentreffen
      </span>

      <span className="inline-flex items-center tracking-tight">
        {/* Character '2' */}
        <span className="relative inline-block">
          <span 
            className="inline-block animate-title-glow"
            style={{
              animation: 'dropThud 0.65s cubic-bezier(0.17, 0.89, 0.32, 1.25) 0.25s both, titleGlowShift 4.5s ease-in-out infinite 0.9s'
            }}
          >
            2
          </span>

          {/* Dust effect on impact */}
          {impact2 && (
            <span className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-3 flex items-center justify-center">
              <span className="absolute w-2 h-2 rounded-full bg-slate-300/60 animate-dust-left" />
              <span className="absolute w-2 h-2 rounded-full bg-slate-300/60 animate-dust-right" />
              <span className="absolute w-6 h-1.5 rounded-full border border-slate-400/50 animate-dust-ring" />
            </span>
          )}
        </span>

        {/* Character '.' */}
        <span className="relative inline-block">
          <span 
            className="inline-block animate-title-glow"
            style={{
              animation: 'dropThud 0.55s cubic-bezier(0.17, 0.89, 0.32, 1.25) 0.75s both, titleGlowShift 4.5s ease-in-out infinite 1.3s'
            }}
          >
            .
          </span>

          {/* Dust effect on impact */}
          {impactDot && (
            <span className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-2 flex items-center justify-center">
              <span className="absolute w-1.5 h-1.5 rounded-full bg-slate-300/60 animate-dust-left" />
              <span className="absolute w-1.5 h-1.5 rounded-full bg-slate-300/60 animate-dust-right" />
              <span className="absolute w-4 h-1 rounded-full border border-slate-400/50 animate-dust-ring" />
            </span>
          )}
        </span>

        {/* Character '0' */}
        <span className="relative inline-block">
          <span 
            className="inline-block animate-title-glow"
            style={{
              animation: 'dropThud 0.65s cubic-bezier(0.17, 0.89, 0.32, 1.25) 1.2s both, titleGlowShift 4.5s ease-in-out infinite 1.85s'
            }}
          >
            0
          </span>

          {/* Dust effect on impact */}
          {impact0 && (
            <span className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-3 flex items-center justify-center">
              <span className="absolute w-2 h-2 rounded-full bg-slate-300/60 animate-dust-left" />
              <span className="absolute w-2 h-2 rounded-full bg-slate-300/60 animate-dust-right" />
              <span className="absolute w-6 h-1.5 rounded-full border border-slate-400/50 animate-dust-ring" />
            </span>
          )}
        </span>
      </span>
    </h1>
  );
}
