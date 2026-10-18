import React from 'react';
import { User, Calendar, MapPin, MessageSquare, Trophy, Check } from 'lucide-react';
import { sounds } from '../lib/sounds';

const STEPS = [
  { id: 1, label: 'Name', icon: User, tag: 'Wer bist du?' },
  { id: 2, label: 'Wann?', icon: Calendar, tag: 'Doodle-Grid' },
  { id: 3, label: 'Wo?', icon: MapPin, tag: 'Locations' },
  { id: 4, label: 'Nachricht', icon: MessageSquare, tag: 'Shoutout' },
  { id: 5, label: 'Abrechnung', icon: Trophy, tag: 'Live-Stats' },
];

export default function StepProgress({ currentStep, setCurrentStep, maxUnlockedStep }) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 mb-8">
      <div className="glass-panel rounded-2xl p-3 sm:p-4 shadow-xl shadow-black/30 border border-white/10 relative overflow-hidden">
        {/* Glow progress bar line background */}
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-800 -translate-y-1/2 rounded-full hidden sm:block" />
        
        {/* Active glowing progress bar line */}
        <div 
          className="absolute top-1/2 left-8 h-1 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-indigo-500 -translate-y-1/2 rounded-full transition-all duration-500 hidden sm:block"
          style={{ width: `${Math.min(100, Math.max(0, ((currentStep - 1) / 4) * 88))}%` }}
        />

        <div className="flex items-center justify-between relative z-10">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isClickable = step.id <= maxUnlockedStep;

            return (
              <button
                key={step.id}
                disabled={!isClickable}
                onClick={() => {
                  if (isClickable) {
                    sounds.playPop();
                    setCurrentStep(step.id);
                  }
                }}
                className={`flex flex-col items-center gap-1.5 transition-all group ${
                  isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
                }`}
              >
                <div 
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 relative ${
                    isCurrent
                      ? 'bg-gradient-to-tr from-fuchsia-600 to-pink-500 text-white shadow-lg shadow-fuchsia-500/50 scale-110 ring-2 ring-white/60 ring-offset-2 ring-offset-slate-950 animate-pulse-glow'
                      : isCompleted
                      ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-900/90 border border-white/10 text-slate-400 group-hover:border-white/30'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  ) : (
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-pink-400 animate-ping" />
                  )}
                </div>

                <div className="text-center">
                  <span className={`text-[11px] sm:text-xs font-semibold block transition-colors ${
                    isCurrent ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </span>
                  <span className="text-[9px] text-slate-500 hidden md:block">
                    {step.tag}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
