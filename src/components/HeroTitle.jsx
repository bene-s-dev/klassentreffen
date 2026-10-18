import React from 'react';

export default function HeroTitle() {
  return (
    <h1 className="font-display text-2xl min-[380px]:text-3xl sm:text-5xl font-extrabold tracking-tight py-0.5 flex flex-col items-center justify-center text-center max-w-full">
      <span className="animate-title-glow leading-none mb-1">
        Merian-
      </span>

      <div className="flex items-center justify-center flex-wrap gap-x-2 leading-tight">
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
      </div>
    </h1>
);
}
