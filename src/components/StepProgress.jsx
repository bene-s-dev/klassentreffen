import React from 'react';

const STEPS = [
  { id: 1, label: 'Name' },
  { id: 2, label: 'Wann?' },
  { id: 3, label: 'Wo?' },
  { id: 4, label: 'Nachricht' },
  { id: 5, label: 'Ergebnis' },
];

export default function StepProgress({ currentStep }) {
  if (currentStep === 5) return null; // No stepper on results page

  return (
    <div className="w-full max-w-xs mx-auto px-4 mb-6">
      <div className="flex items-center justify-between">
        {STEPS.slice(0, 4).map((step) => {
          const isCurrent = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center gap-1.5 flex-1">
              <div 
                className={`w-full h-1 rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'bg-fuchsia-500'
                    : isCompleted
                    ? 'bg-slate-700'
                    : 'bg-slate-850'
                }`}
              />
              <span className={`text-[10px] font-medium transition-colors ${
                isCurrent ? 'text-white font-semibold' : 'text-slate-600'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
