import React from 'react';

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 hidden sm:block">
      {/* Subtle, soft ambient top glow on desktop only */}
      <div 
        className="absolute -top-40 left-1/4 w-[35rem] h-[35rem] rounded-full bg-indigo-900/10 blur-3xl" 
      />
    </div>
  );
}
