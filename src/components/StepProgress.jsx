import React from 'react';
import { Check } from 'lucide-react';
import { sounds } from '../lib/sounds';

const STEPS = [
  { id: 1, label: 'Name' },
  { id: 2, label: 'Wann?' },
  { id: 3, label: 'Wo?' },
  { id: 4, label: 'Gruß' },
  { id: 5, label: 'Ergebnisse' },
];

export default function StepProgress({ currentStep, setCurrentStep, maxUnlockedStep }) {
  return (
    <div className="w-full max-w-xl mx-auto px-4 mb-6">
      <div className="flex items-center justify-between relative">
        
        {/* Background track line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-800 -translate-y-1/2" />
        
        {/* Active track line */}
        <div 
          className="absolute top-1/2 left-4 h-0.5 bg-fuchsia-500 -translate-y-1/2 transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, ((currentStep - 1) / (STEPS.length - 1)) * 92))}%` }}
        />

        {STEPS.map((step) => {
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
              className={`flex flex-col items-center gap-1.5 relative z-10 transition-all ${
                isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
              }`}
            >
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isCurrent
                    ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/40 ring-4 ring-slate-950'
                    : isCompleted
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700 ring-4 ring-slate-950'
                    : 'bg-slate-900 text-slate-500 border border-slate-800 ring-4 ring-slate-950'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.id}
              </div>

              <span className={`text-[11px] font-medium transition-colors ${
                isCurrent ? 'text-white font-semibold' : isCompleted ? 'text-slate-300' : 'text-slate-500'
              }`}>
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
