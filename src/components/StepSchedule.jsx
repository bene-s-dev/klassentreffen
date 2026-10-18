import React, { useState } from 'react';
import { Check, ArrowRight, ArrowLeft, RotateCcw, Clock } from 'lucide-react';
import { WEEKENDS, FIXED_TIME } from '../lib/constants';
import { sounds } from '../lib/sounds';
import AiTitle from './AiTitle';

export default function StepSchedule({ 
  selectedSlots, 
  setSelectedSlots, 
  allVotes, 
  onNext, 
  onBack
}) {
  const [error, setError] = useState('');

  // Count votes per day ID
  const dayVoteCounts = React.useMemo(() => {
    const counts = {};
    allVotes.forEach(vote => {
      (vote.selected_slots || []).forEach(dayId => {
        counts[dayId] = (counts[dayId] || 0) + 1;
      });
    });
    return counts;
  }, [allVotes]);

  const toggleDay = (dayId) => {
    setError('');
    const exists = selectedSlots.includes(dayId);
    sounds.playToggle(!exists);
    if (exists) {
      setSelectedSlots(selectedSlots.filter(id => id !== dayId));
    } else {
      setSelectedSlots([...selectedSlots, dayId]);
    }
  };

  // Bulk toggle actions
  const allSats = React.useMemo(() => 
    WEEKENDS.flatMap(we => we.days.filter(d => d.dayName === 'Samstag').map(d => d.id)), []);
  const allFris = React.useMemo(() => 
    WEEKENDS.flatMap(we => we.days.filter(d => d.dayName === 'Freitag').map(d => d.id)), []);
  const allDays = React.useMemo(() => 
    WEEKENDS.flatMap(we => we.days.map(d => d.id)), []);

  const areAllSatsSelected = allSats.length > 0 && allSats.every(id => selectedSlots.includes(id));
  const areAllFrisSelected = allFris.length > 0 && allFris.every(id => selectedSlots.includes(id));
  const areAllDaysSelected = allDays.length > 0 && allDays.every(id => selectedSlots.includes(id));

  const toggleAllSaturdays = () => {
    setError('');
    if (areAllSatsSelected) {
      sounds.playToggle(false);
      setSelectedSlots(selectedSlots.filter(id => !allSats.includes(id)));
    } else {
      sounds.playPop();
      setSelectedSlots(Array.from(new Set([...selectedSlots, ...allSats])));
    }
  };

  const toggleAllFridays = () => {
    setError('');
    if (areAllFrisSelected) {
      sounds.playToggle(false);
      setSelectedSlots(selectedSlots.filter(id => !allFris.includes(id)));
    } else {
      sounds.playPop();
      setSelectedSlots(Array.from(new Set([...selectedSlots, ...allFris])));
    }
  };

  const toggleAll = () => {
    setError('');
    if (areAllDaysSelected) {
      sounds.playToggle(false);
      setSelectedSlots([]);
    } else {
      sounds.playSuccess();
      setSelectedSlots(allDays);
    }
  };

  const clearAll = () => {
    sounds.playToggle(false);
    setSelectedSlots([]);
  };

  const handleNext = () => {
    if (selectedSlots.length === 0) {
      sounds.playToggle(false);
      setError('Bitte wähl mindestens einen Tag aus!');
      return;
    }
    sounds.playSuccess();
    onNext();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-24 animate-slide-in">
      
      {/* Title */}
      <div className="text-center mb-4">
        <AiTitle 
          text="An welchen Tagen kannst Du?" 
          className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1" 
        />
        <p className="text-slate-400 text-xs sm:text-sm flex items-center justify-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-fuchsia-400" />
          <span>Feste Uhrzeit: <strong>{FIXED_TIME}</strong></span>
        </p>
      </div>


      {/* Quick shortcuts */}
      <div className="flex items-center justify-between gap-2 mb-4 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleAllSaturdays}
            className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer shadow-sm ${
              areAllSatsSelected
                ? 'bg-fuchsia-600/25 border border-fuchsia-500 text-white font-medium'
                : 'gradient-btn-subtle text-slate-300 hover:text-white'
            }`}
          >
            Alle Samstage {areAllSatsSelected && '✓'}
          </button>
          <button
            type="button"
            onClick={toggleAllFridays}
            className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer shadow-sm ${
              areAllFrisSelected
                ? 'bg-fuchsia-600/25 border border-fuchsia-500 text-white font-medium'
                : 'gradient-btn-subtle text-slate-300 hover:text-white'
            }`}
          >
            Alle Freitage {areAllFrisSelected && '✓'}
          </button>
          <button
            type="button"
            onClick={toggleAll}
            className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer shadow-sm ${
              areAllDaysSelected
                ? 'bg-fuchsia-600/25 border border-fuchsia-500 text-white font-medium'
                : 'gradient-btn-subtle text-slate-300 hover:text-white'
            }`}
          >
            Ich kann immer {areAllDaysSelected && '✓'}
          </button>
        </div>

        {selectedSlots.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
            title="Zurücksetzen"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Clean 5 Weekends with 3 Days Each */}
      <div className="space-y-4">
        {WEEKENDS.map((we) => (
          <div key={we.id} className="rounded-xl bg-slate-900/70 border border-slate-800 p-3 sm:p-4">
            
            <div className="mb-2.5 px-1">
              <span className="font-semibold text-xs text-white">
                {we.range}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {we.days.map((day) => {
                const isSelected = selectedSlots.includes(day.id);
                const votes = dayVoteCounts[day.id] || 0;

                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDay(day.id)}
                    className={`relative overflow-hidden p-2.5 rounded-xl border text-left transition-all duration-300 ease-out cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'border-fuchsia-500 text-white shadow-[0_0_24px_-4px_rgba(217,70,239,0.35)] scale-[1.01]'
                        : 'border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white bg-slate-950/80'
                    }`}
                  >
                    {/* Animated color fill layer that floods on select and recedes on deselect */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-r from-fuchsia-600/35 via-purple-600/25 to-pink-600/25 transition-all duration-300 ease-out pointer-events-none origin-left ${
                        isSelected ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                      }`}
                    />

                    {/* Subtle sweeping white sheen reflection on selection */}
                    {isSelected && (
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/12 to-transparent animate-glass-shimmer" />
                    )}

                    <div className="relative z-10">
                      <div className={`font-semibold text-xs transition-colors duration-200 ${isSelected ? 'text-white font-bold' : 'text-slate-300'}`}>
                        {day.fullDate}
                      </div>
                      <div className={`text-[10px] font-mono transition-colors duration-200 ${isSelected ? 'text-fuchsia-200' : 'text-slate-500'}`}>
                        {FIXED_TIME}
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center shrink-0">
                      <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] transition-all duration-300 ${
                        isSelected
                          ? 'bg-fuchsia-500 text-white font-bold scale-110 shadow-[0_0_10px_rgba(217,70,239,0.6)]'
                          : 'border border-slate-700 bg-slate-950 scale-100'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3] animate-fadeIn" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        ))}
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
            className="px-3 py-2 rounded-xl gradient-btn-subtle text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Zurück</span>
          </button>

          <span className="text-xs text-slate-300 font-medium whitespace-nowrap">
            <strong className="text-white font-semibold">{selectedSlots.length}</strong> {selectedSlots.length === 1 ? 'Tag gewählt' : 'Tage gewählt'}
          </span>

          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 rounded-xl gradient-btn-primary text-white font-display font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md shrink-0"
          >
            <span>Weiter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>

    </div>
  );
}
