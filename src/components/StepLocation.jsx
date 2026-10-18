import React, { useState } from 'react';
import { Check, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { PRESET_LOCATIONS } from '../lib/constants';
import { sounds } from '../lib/sounds';
import AiTitle from './AiTitle';

export default function StepLocation({ 
  selectedLocations, 
  setSelectedLocations, 
  customLocation, 
  setCustomLocation, 
  onNext, 
  onBack,
  isSubmitting
}) {
  const [error, setError] = useState('');

  const toggleLocation = (locId) => {
    setError('');
    const exists = selectedLocations.includes(locId);
    sounds.playToggle(!exists);
    if (exists) {
      setSelectedLocations(selectedLocations.filter(id => id !== locId));
    } else {
      setSelectedLocations([...selectedLocations, locId]);
    }
  };

  const handleNext = () => {
    if (selectedLocations.length === 0 && !customLocation.trim()) {
      sounds.playToggle(false);
      setError('Bitte wähl mindestens eine Location aus oder schlag einen eigenen Spot vor!');
      return;
    }
    sounds.playSuccess();
    onNext();
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 pb-24 animate-slide-in">
      
      {/* Title */}
      <div className="text-center mb-4">
        <AiTitle 
          text="Wo soll es hingehen?" 
          className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1" 
        />
        <p className="text-slate-400 text-xs sm:text-sm">
          Wähl Deine Favoriten oder schlag einen eigenen Spot vor.
        </p>
      </div>

      {/* 3 Full-Width, Non-Truncated, Clean Cards */}
      <div className="space-y-3 mb-5">
        {PRESET_LOCATIONS.map((loc) => {
          const isSelected = selectedLocations.includes(loc.id);

          return (
            <div
              key={loc.id}
              onClick={() => toggleLocation(loc.id)}
              className={`rounded-2xl p-4 border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                isSelected
                  ? 'bg-fuchsia-600/15 border-fuchsia-500 shadow-sm'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="text-2xl select-none shrink-0">{loc.icon}</span>
                <div className="min-w-0">
                  <h3 className="font-display font-semibold text-sm sm:text-base text-white leading-snug">
                    {loc.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {loc.desc}
                  </p>
                </div>
              </div>

              <div 
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-fuchsia-600 text-white'
                    : 'border border-slate-700 bg-slate-950'
                }`}
              >
                {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Location Box */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 mb-4">
        <label htmlFor="custom-spot" className="block text-xs font-semibold text-slate-300 mb-1.5">
          Eigener Vorschlag? (Optional)
        </label>
        <input
          id="custom-spot"
          type="text"
          value={customLocation}
          onChange={(e) => {
            setCustomLocation(e.target.value);
            if (error) setError('');
          }}
          placeholder="z.B. Rooftop-Terrasse, Schlossberg oder Biergarten..."
          maxLength={100}
          style={{ fontSize: '16px' }}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-base font-medium focus:outline-none focus:border-fuchsia-500 transition-colors"
        />
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center font-medium">
          {error}
        </div>
      )}

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 backdrop-blur-md bg-slate-950/85">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onBack();
            }}
            className="px-3 py-2 rounded-xl gradient-btn-subtle text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Zurück</span>
          </button>

          <span className="text-xs text-slate-300 font-medium whitespace-nowrap">
            <strong className="text-white font-semibold">
              {selectedLocations.length + (customLocation.trim() ? 1 : 0)}
            </strong> gewählt
          </span>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleNext}
            className="px-4 py-2 rounded-xl gradient-btn-primary text-white font-display font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md shrink-0 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Speichern...</span>
              </>
            ) : (
              <>
                <span>Weiter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

        </div>
      </div>

    </div>
  );
}
