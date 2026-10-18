import React from 'react';

export default function HeroTitle() {
  return (
    <div className="flex flex-col items-center justify-center max-w-full">
      <span className="font-display text-base min-[380px]:text-lg sm:text-2xl font-extrabold tracking-widest uppercase text-fuchsia-400 drop-shadow-[0_0_18px_rgba(217,70,239,0.6)] mb-0.5 select-none">
        Merian-
      </span>

      <h1 className="font-display text-2xl min-[380px]:text-3xl sm:text-5xl font-extrabold tracking-tight py-0.5 flex items-center justify-center flex-wrap gap-x-2 max-w-full">
        <span className="animate-title-glow">
          Klassentreffen
        </span>

      <span className="inline-flex items-center tracking-tight">
        {/* Character '2' */}
        <span 
          className="inline-block animate-title-glow"
          style={{
            animation: 'dropThud 0.65s cubic-bezier(0.17, 0.89, 0.32, 1.25) 0.25s both, titleGlowShift 4.5s ease-in-out infinite 0.9s'
          }}
        >
          2
        </span>

        {/* Character '.' */}
        <span 
          className="inline-block animate-title-glow"
          style={{
            animation: 'dropThud 0.55s cubic-bezier(0.17, 0.89, 0.32, 1.25) 0.75s both, titleGlowShift 4.5s ease-in-out infinite 1.3s'
          }}
        >
          .
        </span>

        {/* Character '0' */}
        <span 
          className="inline-block animate-title-glow"
          style={{
            animation: 'dropThud 0.65s cubic-bezier(0.17, 0.89, 0.32, 1.25) 1.2s both, titleGlowShift 4.5s ease-in-out infinite 1.85s'
          }}
        >
          0
        </span>
      </span>
    </h1>
  </div>
);
}
