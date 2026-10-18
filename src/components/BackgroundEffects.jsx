import React from 'react';

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Subtle, soft ambient glows */}
      <div 
        className="absolute -top-40 left-1/4 w-[35rem] h-[35rem] rounded-full bg-indigo-900/10 blur-3xl" 
      />
      <div 
        className="absolute top-1/2 -right-40 w-[30rem] h-[30rem] rounded-full bg-fuchsia-900/10 blur-3xl" 
      />
    </div>
  );
}
