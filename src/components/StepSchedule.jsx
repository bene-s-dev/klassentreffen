import React, { useState } from 'react';
import { Check, ArrowRight, ArrowLeft, CheckCheck, RotateCcw, Users } from 'lucide-react';
import { WEEKENDS, TIME_SLOTS } from '../lib/constants';
import { sounds } from '../lib/sounds';

export default function StepSchedule({ 
  selectedSlots, 
  setSelectedSlots, 
  allVotes, 
  onNext, 
  onBack 
}) {
  const [activeWeekendId, setActiveWeekendId] = useState('all');
  const [error, setError] = useState('');

  // Pre-calculate vote counts for each slot
  const slotVoteCounts = React.useMemo(() => {
    const counts = {};
    allVotes.forEach(vote => {
      (vote.selected_slots || []).forEach(slotKey => {
        counts[slotKey] = (counts[slotKey] || 0) + 1;
      });
    });
    return counts;
  }, [allVotes]);

  const toggleSlot = (slotKey) => {
    setError('');
    const exists = selectedSlots.includes(slotKey);
    sounds.playToggle(!exists);
    if (exists) {
      setSelectedSlots(selectedSlots.filter(k => k !== slotKey));
    } else {
      setSelectedSlots([...selectedSlots, slotKey]);
    }
  };

  // Bulk actions
  const selectAll = () => {
    sounds.playSuccess();
    const all = [];
    WEEKENDS.forEach(we => {
      we.days.forEach(d => {
        TIME_SLOTS.forEach(s => {
          all.push(`${we.id}-${d.id}-${s.id}`);
        });
      });
    });
    setSelectedSlots(all);
  };

  const selectAllSaturdays = () => {
    sounds.playPop();
    const sats = [];
    WEEKENDS.forEach(we => {
      TIME_SLOTS.forEach(s => {
        sats.push(`${we.id}-sat-${s.id}`);
      });
    });
    setSelectedSlots(Array.from(new Set([...selectedSlots, ...sats])));
  };

  const selectWeekendAll = (weId) => {
    sounds.playPop();
    const weekend = WEEKENDS.find(w => w.id === weId);
    if (!weekend) return;
    const weSlots = [];
    weekend.days.forEach(d => {
      TIME_SLOTS.forEach(s => {
        weSlots.push(`${weId}-${d.id}-${s.id}`);
      });
    });

    const isAllChecked = weSlots.every(k => selectedSlots.includes(k));
    if (isAllChecked) {
      setSelectedSlots(selectedSlots.filter(k => !weSlots.includes(k)));
    } else {
      setSelectedSlots(Array.from(new Set([...selectedSlots, ...weSlots])));
    }
  };

  const clearAll = () => {
    sounds.playToggle(false);
    setSelectedSlots([]);
  };

  const handleNext = () => {
    if (selectedSlots.length === 0) {
      sounds.playToggle(false);
      setError('Bitte wähl mindestens einen passenden Termin aus!');
      return;
    }
    sounds.playSuccess();
    onNext();
  };

  // Filter displayed weekends
  const displayedWeekends = activeWeekendId === 'all' 
    ? WEEKENDS 
    : WEEKENDS.filter(w => w.id === activeWeekendId);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-24 animate-slide-in">
      
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
          Wann hast du Zeit?
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Kreuz alle passenden Termine an – Mehrfachauswahl erwünscht.
        </p>
      </div>

      {/* Clean Shortcuts & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        
        {/* Weekend Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setActiveWeekendId('all');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
              activeWeekendId === 'all'
                ? 'bg-fuchsia-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Alle anzeigen
          </button>
          {WEEKENDS.map((we, i) => {
            const count = selectedSlots.filter(s => s.startsWith(we.id)).length;
            const isActive = activeWeekendId === we.id;
            return (
              <button
                key={we.id}
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setActiveWeekendId(we.id);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-fuchsia-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <span>WE {i + 1} ({we.days[0].date.split(' ')[0]}–{we.days[2].date.split(' ')[0]})</span>
                {count > 0 && (
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-white text-[10px] flex items-center justify-center font-bold">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={selectAllSaturdays}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Samstage
          </button>
          <button
            type="button"
            onClick={selectAll}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Alle wählen
          </button>
          {selectedSlots.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="p-1 rounded-lg text-slate-500 hover:text-rose-400 cursor-pointer transition-colors"
              title="Auswahl zurücksetzen"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Clean Weekend Matrices */}
      <div className="space-y-6">
        {displayedWeekends.map((weekend) => {
          const weekendSlots = [];
          weekend.days.forEach(d => {
            TIME_SLOTS.forEach(s => weekendSlots.push(`${weekend.id}-${d.id}-${s.id}`));
          });
          const allWeekendChecked = weekendSlots.every(k => selectedSlots.includes(k));

          return (
            <div 
              key={weekend.id}
              className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 sm:p-5 shadow-sm"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-base text-white">
                    {weekend.range}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Freitag bis Sonntag
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => selectWeekendAll(weekend.id)}
                  className="text-xs font-medium text-slate-400 hover:text-fuchsia-400 cursor-pointer transition-colors"
                >
                  {allWeekendChecked ? '✓ Alles abwählen' : '+ Ganzes WE'}
                </button>
              </div>

              {/* Compact 3-Column Days Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {weekend.days.map((day) => (
                  <div key={day.id} className="rounded-xl bg-slate-950/50 p-2.5 border border-slate-800/60">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="font-semibold text-xs text-white">
                        {day.name}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {day.date}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {TIME_SLOTS.map((slot) => {
                        const slotKey = `${weekend.id}-${day.id}-${slot.id}`;
                        const isSelected = selectedSlots.includes(slotKey);
                        const votesCount = slotVoteCounts[slotKey] || 0;

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => toggleSlot(slotKey)}
                            className={`w-full text-left p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-fuchsia-600/15 border-fuchsia-500 text-white'
                                : 'bg-slate-900 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:text-white'
                            }`}
                          >
                            <div className="min-w-0 pr-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs select-none">{slot.icon}</span>
                                <span className="text-xs font-semibold truncate">
                                  {slot.title}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono block">
                                {slot.label}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {votesCount > 0 && (
                                <span className="text-[10px] text-slate-400 font-mono" title={`${votesCount} Stimmen`}>
                                  {votesCount}✓
                                </span>
                              )}
                              <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                                isSelected 
                                  ? 'bg-fuchsia-600 text-white font-bold' 
                                  : 'border border-slate-700 bg-slate-950'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center font-medium">
          {error}
        </div>
      )}

      {/* Clean Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 backdrop-blur-md bg-slate-950/80 border-t border-slate-800">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          
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
            <strong className="text-white">{selectedSlots.length}</strong> {selectedSlots.length === 1 ? 'Termin gewählt' : 'Termine gewählt'}
          </span>

          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-display font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors shadow-md"
          >
            <span>Weiter zu Locations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>

    </div>
  );
}
