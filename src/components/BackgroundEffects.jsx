import React from 'react';

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Ambient glowing radial orbs */}
      <div 
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl animate-pulse" 
        style={{ animationDuration: '8s' }} 
      />
      <div 
        className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-pink-600/15 blur-3xl animate-pulse" 
        style={{ animationDuration: '10s', animationDelay: '2s' }} 
      />
      <div 
        className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-emerald-600/15 blur-3xl animate-pulse" 
        style={{ animationDuration: '7s', animationDelay: '1s' }} 
      />
      <div 
        className="absolute top-3/4 right-1/4 w-80 h-80 rounded-full bg-blue-600/15 blur-3xl animate-pulse" 
        style={{ animationDuration: '9s', animationDelay: '3s' }} 
      />

      {/* Subtle tech grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Floating playful background emojis with gentle bobbing */}
      <div className="hidden lg:block absolute top-24 left-10 text-3xl opacity-20 select-none animate-float" style={{ animationDelay: '0s' }}>
        🍻
      </div>
      <div className="hidden lg:block absolute top-1/2 left-8 text-2xl opacity-20 select-none animate-float" style={{ animationDelay: '1.5s' }}>
        🍕
      </div>
      <div className="hidden lg:block absolute bottom-32 left-16 text-3xl opacity-20 select-none animate-float" style={{ animationDelay: '3s' }}>
        🪩
      </div>
      <div className="hidden lg:block absolute top-28 right-12 text-3xl opacity-20 select-none animate-float" style={{ animationDelay: '2s' }}>
        🔥
      </div>
      <div className="hidden lg:block absolute top-2/3 right-10 text-2xl opacity-20 select-none animate-float" style={{ animationDelay: '0.8s' }}>
        ⚡
      </div>
      <div className="hidden lg:block absolute bottom-20 right-20 text-3xl opacity-20 select-none animate-float" style={{ animationDelay: '2.5s' }}>
        🕶️
      </div>
    </div>
  );
}
