import React from 'react';

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Smooth full-screen ambient glows without any hard cutoffs */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] rounded-full bg-fuchsia-600/12 blur-[120px] pointer-events-none animate-pulse-slow" 
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none animate-pulse-slow" 
      />
    </div>
  );
}
