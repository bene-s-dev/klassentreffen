import React from 'react';

const STEPS = [
  { id: 1, label: 'Name' },
  { id: 2, label: 'Wann?' },
  { id: 3, label: 'Wo?' },
];

export default function StepProgress({ currentStep }) {
  if (currentStep === 5) return null; // No stepper on results page

  return (
    <div className="w-full max-w-xs mx-auto px-4 mb-6">
      <div className="flex items-center gap-2">
        {STEPS.map((step) => {
          const isCurrent = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div 
              key={step.id}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                isCurrent
                  ? 'bg-fuchsia-500'
                  : isCompleted
                  ? 'bg-slate-700'
                  : 'bg-slate-850'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
