import React, { useState } from 'react';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { PRESET_LOCATIONS } from '../lib/constants';
import { sounds } from '../lib/sounds';

export default function StepLocation({ 
  selectedLocations, 
  setSelectedLocations, 
  customLocation, 
  setCustomLocation, 
  onNext, 
  onBack,
  narratorText 
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
    <div className="w-full max-w-2xl mx-auto px-4 pb-24 animate-slide-in">
      
      {/* Title */}
      <div className="text-center mb-4">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
          Wo soll es hingehen?
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Wähl deine Favoriten oder schlag einen eigenen Spot vor.
        </p>
      </div>

      {/* Inline Narrator sentence */}
      {narratorText && (
        <div className="mb-5 py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 text-center flex items-center justify-center gap-1.5 min-h-[2.25rem]">
          <span>🤖</span>
          <span>{narratorText}</span>
        </div>
      )}

      {/* Clean Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        {PRESET_LOCATIONS.map((loc) => {
          const isSelected = selectedLocations.includes(loc.id);

          return (
            <div
              key={loc.id}
              onClick={() => toggleLocation(loc.id)}
              className={`rounded-xl p-3.5 border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                isSelected
                  ? 'bg-fuchsia-600/15 border-fuchsia-500 shadow-sm'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <span className="text-xl select-none pt-0.5">{loc.icon}</span>
                <div className="min-w-0">
                  <h3 className="font-display font-semibold text-xs sm:text-sm text-white truncate">
                    {loc.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                    {loc.desc}
                  </p>
                </div>
              </div>

              <div 
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                  isSelected
                    ? 'bg-fuchsia-600 text-white'
                    : 'border border-slate-700 bg-slate-950'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Location Box */}
      <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-4">
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
          placeholder="z.B. Rooftop-Terrasse oder Park..."
          maxLength={100}
          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-fuchsia-500 transition-colors"
        />
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center font-medium">
          {error}
        </div>
      )}

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 backdrop-blur-md bg-slate-950/80 border-t border-slate-800">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onBack();
            }}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Zurück</span>
          </button>

          <span className="text-xs text-slate-400 font-medium">
            <strong className="text-white">
              {selectedLocations.length + (customLocation.trim() ? 1 : 0)}
            </strong> Locations
          </span>

          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-display font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors shadow-md"
          >
            <span>Weiter zur Nachricht</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>

    </div>
  );
}
