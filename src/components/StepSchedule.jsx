import React, { useState, useEffect } from 'react';
import { 
  Calendar, Check, ArrowRight, ArrowLeft, Sparkles, CheckCheck, 
  RotateCcw, Zap, Users, Flame 
} from 'lucide-react';
import { WEEKENDS, TIME_SLOTS } from '../lib/constants';
import { sounds } from '../lib/sounds';

export default function StepSchedule({ 
  selectedSlots, 
  setSelectedSlots, 
  allVotes, 
  onNext, 
  onBack 
}) {
  const [activeWeekendId, setActiveWeekendId] = useState('we-1');
  const [error, setError] = useState('');

  // Calculate vote counts for each slot from existing voters
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
    const combined = Array.from(new Set([...selectedSlots, ...sats]));
    setSelectedSlots(combined);
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

  const scrollToWeekend = (weId) => {
    sounds.playPop();
    setActiveWeekendId(weId);
    const el = document.getElementById(`section-${weId}`);
    if (el) {
      const yOffset = -140; // account for sticky headers
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (selectedSlots.length === 0) {
      sounds.playToggle(false);
      setError('Bruder, du musst mindestens einen Termin ankreuzen! Lost wer nie kann 💀');
      return;
    }
    sounds.playSuccess();
    onNext();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-28 animate-slide-in">
      
      {/* Intro Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          Schritt 2 von 4 • Doodle-Style Voting
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Wann hast du lowkey Zeit? 🗓️
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
          Klick alle Tage & Uhrzeiten an, an denen du am Start wärst. <br className="hidden sm:inline" />
          <span className="text-fuchsia-400 font-semibold">Mehrfachauswahl erwünscht</span> – je flexibler du bist, desto eher finden wir den Boss-Termin!
        </p>
      </div>

      {/* Quick Bulk Shortcuts Bar */}
      <div className="glass-panel rounded-2xl p-3 sm:p-4 mb-6 flex flex-wrap items-center justify-between gap-2 border border-white/10 shadow-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Shortcuts:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-fuchsia-600/30 to-pink-600/30 border border-fuchsia-500/40 text-fuchsia-200 hover:bg-fuchsia-600/50 text-xs font-semibold flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Ich kann immer (Ehrenmann) 🔥</span>
          </button>

          <button
            type="button"
            onClick={selectAllSaturdays}
            className="px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 hover:bg-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Alle Samstage</span>
          </button>

          {selectedSlots.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 text-xs font-medium flex items-center gap-1 transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* STICKY WEEKEND NAVIGATOR */}
      <div className="sticky top-16 z-30 -mx-4 px-4 py-2.5 backdrop-blur-xl bg-slate-950/85 border-y border-white/10 mb-8 shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Wochenenden:
          </span>
          {WEEKENDS.map((we, idx) => {
            const isCurrentWe = activeWeekendId === we.id;
            // check how many slots selected in this weekend
            const selectedInWe = selectedSlots.filter(s => s.startsWith(we.id)).length;

            return (
              <button
                key={we.id}
                type="button"
                onClick={() => scrollToWeekend(we.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isCurrentWe
                    ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-lg shadow-fuchsia-500/30 scale-105 ring-1 ring-white/50'
                    : 'bg-slate-900/80 border border-white/10 text-slate-300 hover:bg-slate-800 hover:border-white/20'
                }`}
              >
                <span>{we.range}</span>
                {selectedInWe > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[10px] flex items-center justify-center">
                    {selectedInWe}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* WEEKEND MATRICES */}
      <div className="space-y-8">
        {WEEKENDS.map((weekend) => {
          const weekendSlots = [];
          weekend.days.forEach(d => {
            TIME_SLOTS.forEach(s => weekendSlots.push(`${weekend.id}-${d.id}-${s.id}`));
          });
          const allWeekendChecked = weekendSlots.every(k => selectedSlots.includes(k));

          return (
            <div 
              key={weekend.id}
              id={`section-${weekend.id}`}
              className="glass-panel-subtle rounded-3xl p-4 sm:p-6 border border-white/10 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-white/20"
            >
              {/* Card top banner with weekend info and toggle all */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-indigo-600 flex items-center justify-center text-lg font-display font-bold text-white shadow-md">
                    📅
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-xl text-white">
                        {weekend.range}
                      </h3>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-fuchsia-300 border border-white/10">
                        {weekend.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Freitag bis Sonntag • Wähl deine passenden Slots
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => selectWeekendAll(weekend.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer ${
                    allWeekendChecked
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-slate-800/80 text-slate-300 border border-white/10 hover:border-fuchsia-500/50 hover:text-white'
                  }`}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>{allWeekendChecked ? 'Ganzes WE gewählt ✓' : 'Ganzes WE ankreuzen'}</span>
                </button>
              </div>

              {/* Doodle Grid: Days columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {weekend.days.map((day) => {
                  return (
                    <div 
                      key={day.id} 
                      className={`rounded-2xl p-3.5 bg-slate-900/60 border transition-all ${
                        day.isPopular 
                          ? 'border-fuchsia-500/30 shadow-lg shadow-fuchsia-950/20' 
                          : 'border-white/5'
                      }`}
                    >
                      {/* Day Header */}
                      <div className="flex items-center justify-between mb-3 px-1">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-bold text-base text-white">
                              {day.name}
                            </span>
                            {day.isPopular && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                                Primetime 🔥
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">{day.date}</span>
                        </div>
                      </div>

                      {/* Time Slots */}
                      <div className="space-y-2.5">
                        {TIME_SLOTS.map((slot) => {
                          const slotKey = `${weekend.id}-${day.id}-${slot.id}`;
                          const isSelected = selectedSlots.includes(slotKey);
                          const votesCount = slotVoteCounts[slotKey] || 0;

                          return (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() => toggleSlot(slotKey)}
                              className={`w-full text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                                isSelected
                                  ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-600/25 border-emerald-400 text-white shadow-lg shadow-emerald-950/40 scale-[1.02] ring-1 ring-emerald-400/50'
                                  : 'bg-slate-950/50 border-white/10 hover:border-white/30 text-slate-300 hover:bg-slate-800/40'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  <span className="text-lg select-none">
                                    {slot.icon}
                                  </span>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold text-white leading-tight">
                                        {slot.title}
                                      </span>
                                      <span className="text-[11px] text-slate-400 font-mono">
                                        {slot.label}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400">
                                      {slot.subtitle}
                                    </p>
                                  </div>
                                </div>

                                {/* Checkbox Indicator */}
                                <div 
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                                    isSelected
                                      ? 'bg-emerald-400 text-slate-950 font-bold scale-110 shadow-md shadow-emerald-400/40'
                                      : 'border border-white/20 group-hover:border-white/40 bg-slate-900/60'
                                  }`}
                                >
                                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                                </div>
                              </div>

                              {/* Voted badge if other people voted for this slot */}
                              {votesCount > 0 && (
                                <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                                  <span className="flex items-center gap-1 text-slate-400">
                                    <Users className="w-3 h-3 text-slate-400" />
                                    <span>{votesCount} {votesCount === 1 ? 'Person kann' : 'Leute können'}</span>
                                  </span>
                                  {votesCount >= 3 && (
                                    <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                                      <Flame className="w-3 h-3" /> Hot
                                    </span>
                                  )}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
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

          {/* Slots counter pill */}
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-slate-900/90 border border-white/10 text-xs sm:text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white">{selectedSlots.length}</span>
            <span className="text-slate-400 hidden xs:inline">
              {selectedSlots.length === 1 ? 'Slot gewählt' : 'Slots am Start'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-3 rounded-2xl glass-button-primary text-white font-display font-bold text-sm sm:text-base flex items-center gap-2.5 cursor-pointer shadow-lg hover:scale-105 transition-all"
          >
            <span>Weiter zu Locations</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </div>

    </div>
  );
}
