import React, { useState } from 'react';
import { MapPin, Check, Plus, ArrowRight, ArrowLeft, Sparkles, Flame, Star } from 'lucide-react';
import { PRESET_LOCATIONS } from '../lib/constants';
import { sounds } from '../lib/sounds';

export default function StepLocation({ 
  selectedLocations, 
  setSelectedLocations, 
  customLocation, 
  setCustomLocation, 
  onNext, 
  onBack 
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
      setError('Bruder, wähl wenigstens einen Spot aus oder schlag was Wildes vor!');
      return;
    }
    sounds.playSuccess();
    onNext();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-28 animate-slide-in">
      
      {/* Intro Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300 border border-pink-500/30 mb-3">
          <MapPin className="w-3.5 h-3.5 text-pink-400" />
          Schritt 3 von 4 • Spot-Auswahl
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Wo soll es scheppern? 📍
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
          Wähl deine Lieblings-Locations aus oder hau deinen eigenen legendären Spot raus! <br className="hidden sm:inline" />
          Mehrfachauswahl ist natürlich am Start.
        </p>
      </div>

      {/* Grid of Predefined Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {PRESET_LOCATIONS.map((loc) => {
          const isSelected = selectedLocations.includes(loc.id);

          return (
            <div
              key={loc.id}
              onClick={() => toggleLocation(loc.id)}
              className={`rounded-3xl p-5 border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                isSelected
                  ? 'bg-gradient-to-b from-fuchsia-950/40 via-slate-900/80 to-slate-900/90 border-fuchsia-500 shadow-xl shadow-fuchsia-950/50 scale-[1.02] ring-2 ring-fuchsia-500/40'
                  : 'glass-panel hover:border-white/25 hover:bg-slate-900/70 hover:-translate-y-1'
              }`}
            >
              {/* Corner accent glow */}
              {isSelected && (
                <div className="absolute top-0 right-0 w-28 h-28 bg-fuchsia-500/20 rounded-full blur-2xl pointer-events-none" />
              )}

              <div>
                {/* Header row: emoji + checkmark */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {loc.icon}
                  </div>

                  <div 
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-gradient-to-tr from-fuchsia-500 to-pink-500 text-white font-bold scale-110 shadow-lg shadow-fuchsia-500/50'
                        : 'border border-white/20 bg-slate-900/60 group-hover:border-white/40'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>

                <div className="mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10 inline-block mb-1.5">
                    {loc.tag}
                  </span>
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-fuchsia-300 transition-colors">
                    {loc.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {loc.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className={`font-semibold ${isSelected ? 'text-fuchsia-300' : 'text-slate-500'}`}>
                  {isSelected ? '✓ Am Start' : '+ Auswählen'}
                </span>
                {loc.id === 'kneipe' && (
                  <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" /> Beliebter Klassiker
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Location Proposal Box */}
      <div className="glass-panel-highlight rounded-3xl p-6 sm:p-8 border border-white/15 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xl shadow-md">
            💡
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">
              Eigener Spot-Vorschlag?
            </h3>
            <p className="text-xs text-slate-400">
              Hast du eine noch wildere Location im Kopf? Schlag deinen Geheimtipp vor!
            </p>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={customLocation}
            onChange={(e) => {
              setCustomLocation(e.target.value);
              if (error) setError('');
            }}
            placeholder="z.B. Rooftop-Terrasse, Secret Warehouse, oder Dönerladen um 4 Uhr morgens..."
            maxLength={100}
            className="w-full px-5 py-4 rounded-2xl bg-slate-900/90 border border-white/15 text-white placeholder-slate-500 text-sm sm:text-base font-medium transition-all duration-300 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 shadow-inner"
          />
        </div>

        {customLocation.trim() && (
          <p className="mt-2 text-xs font-semibold text-amber-300 flex items-center gap-1.5 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Nice! Dein Vorschlag wird für alle sichtbar mit ins Voting aufgenommen.
          </p>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-semibold text-center animate-bounce">
          {error}
        </div>
      )}

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 backdrop-blur-2xl bg-slate-950/85 border-t border-white/15 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onBack();
            }}
            className="px-4 py-3 rounded-2xl bg-slate-900/90 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Zurück</span>
          </button>

          {/* Location counter pill */}
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-slate-900/90 border border-white/10 text-xs sm:text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse" />
            <span className="font-bold text-white">
              {selectedLocations.length + (customLocation.trim() ? 1 : 0)}
            </span>
            <span className="text-slate-400 hidden xs:inline">Spots markiert</span>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-3 rounded-2xl glass-button-primary text-white font-display font-bold text-sm sm:text-base flex items-center gap-2.5 cursor-pointer shadow-lg hover:scale-105 transition-all"
          >
            <span>Weiter zur Nachricht</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </div>

    </div>
  );
}
