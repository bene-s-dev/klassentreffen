import React, { useState, useMemo } from 'react';
import { Calendar, MapPin, Trash2, RefreshCw, Code2 } from 'lucide-react';
import { ALL_DAYS, FIXED_TIME, PRESET_LOCATIONS } from '../lib/constants';
import { sounds } from '../lib/sounds';
import AiTitle from './AiTitle';

export default function StepResults({ 
  allVotes, 
  myVote, 
  onEditVote, 
  onDeleteVote,
  onRefresh
}) {

  // Calculate day stats
  const dayStats = useMemo(() => {
    const counts = {};
    const totalVoters = allVotes.length;

    ALL_DAYS.forEach(day => {
      counts[day.id] = {
        ...day,
        votes: 0,
        voters: []
      };
    });

    allVotes.forEach(vote => {
      (vote.selected_slots || []).forEach(dayId => {
        if (counts[dayId]) {
          counts[dayId].votes += 1;
          counts[dayId].voters.push(vote);
        }
      });
    });

    const sorted = Object.values(counts).sort((a, b) => b.votes - a.votes);
    const topDay = sorted[0] || null;

    return { counts, sorted, topDay, totalVoters };
  }, [allVotes]);

  // Location stats
  const locationStats = useMemo(() => {
    const locCounts = {};
    PRESET_LOCATIONS.forEach(loc => {
      locCounts[loc.id] = { ...loc, count: 0, voters: [] };
    });

    const customLocs = [];

    allVotes.forEach(vote => {
      (vote.selected_locations || []).forEach(locId => {
        if (locCounts[locId]) {
          locCounts[locId].count += 1;
          locCounts[locId].voters.push(vote.name);
        }
      });
      if (vote.custom_location && vote.custom_location.trim()) {
        customLocs.push({
          location: vote.custom_location.trim(),
          by: vote.name
        });
      }
    });

    const sortedLocs = Object.values(locCounts).sort((a, b) => b.count - a.count);
    return { sortedLocs, customLocs };
  }, [allVotes]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-20 animate-slide-in">
      
      {/* Title */}
      <div className="text-center mb-5">
        <AiTitle 
          text="Ergebnisse 🗓️" 
          className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight" 
        />
      </div>

      {/* WINNER BANNER with White Glass Shimmer Reflection */}
      {dayStats.topDay && dayStats.topDay.votes > 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-amber-500/30 p-4 sm:p-5 mb-6 shadow-sm">
          {/* Animated White Glass Sheen moving across */}
          <div 
            className="pointer-events-none absolute inset-0 -top-12 -bottom-12 w-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent animate-glass-shimmer"
          />

          <div className="relative z-10">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block mb-0.5">
              Aktuell beliebtester Termin
            </span>
            <h3 className="font-display font-bold text-lg sm:text-xl text-white">
              {dayStats.topDay.fullDate} • {FIXED_TIME}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {dayStats.topDay.votes} von {dayStats.totalVoters} Stimmen ({Math.round((dayStats.topDay.votes / Math.max(1, dayStats.totalVoters)) * 100)}%)
            </p>
          </div>
        </div>
      )}

      {/* DOODLE MATRIX */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 mb-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-fuchsia-400" />
            <h3 className="font-display font-bold text-sm sm:text-base text-white">
              Tage-Übersicht (jeweils {FIXED_TIME})
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playToggle(false);
              if (window.confirm('Möchtest Du Deine Antwort wirklich löschen?')) {
                onDeleteVote();
              }
            }}
            className="px-2.5 py-1.5 rounded-xl gradient-btn-danger text-rose-300 hover:text-rose-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
            title="Löscht Deine Stimme und bringt Dich zur Startseite"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Meine Antwort löschen</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[450px]">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-2 px-3">Tag</th>
                <th className="py-2 px-2 text-center w-20">Stimmen</th>
                {allVotes.map((v) => (
                  <th key={v.id || v.name} className="py-2 px-2 text-center" title={v.name}>
                    <span className="text-[11px] text-slate-300 truncate max-w-[60px] block font-medium">
                      {v.name.split(' ')[0]}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {dayStats.sorted.map((day, idx) => {
                const percentage = Math.round((day.votes / Math.max(1, dayStats.totalVoters)) * 100);
                const isTop = idx === 0 && day.votes > 0;

                return (
                  <tr 
                    key={day.id} 
                    className={`transition-colors ${
                      isTop ? 'bg-amber-500/5' : 'hover:bg-slate-850'
                    }`}
                  >
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <span className="font-semibold text-white text-xs">
                          {day.fullDate}
                        </span>
                        {day.badge && (
                          <span className="text-[9px] text-amber-300 font-medium px-1 rounded bg-amber-500/10 border border-amber-500/20">
                            {day.badge}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-2 px-2 text-center">
                      <span className={`font-bold text-xs ${isTop ? 'text-amber-400' : 'text-slate-300'}`}>
                        {day.votes}
                      </span>
                      <div className="w-12 bg-slate-800 rounded-full h-1 mx-auto mt-1 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isTop ? 'bg-amber-400' : 'bg-fuchsia-500'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </td>

                    {allVotes.map((v) => {
                      const canAttend = (v.selected_slots || []).includes(day.id);
                      return (
                        <td key={v.id || v.name} className="py-2 px-2 text-center">
                          {canAttend ? (
                            <span className="text-emerald-400 font-bold text-xs">✓</span>
                          ) : (
                            <span className="text-slate-700 text-xs">–</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOCATION STATS & GUESTBOOK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        
        {/* Locations */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-pink-400" />
            <h3 className="font-display font-bold text-sm text-white">
              Location-Ranking
            </h3>
          </div>

          <div className="space-y-3">
            {locationStats.sortedLocs.map((loc) => {
              const percentage = Math.round((loc.count / Math.max(1, dayStats.totalVoters)) * 100);
              return (
                <div key={loc.id} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-white truncate">
                      {loc.title}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px] shrink-0 ml-2">
                      {loc.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-pink-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {locationStats.customLocs.length > 0 && (
            <div className="mt-4">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Weitere Vorschläge:
              </span>
              <div className="space-y-1.5">
                {locationStats.customLocs.map((c, i) => (
                  <div key={i} className="text-xs p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                    &ldquo;{c.location}&rdquo; <span className="text-[10px] text-slate-500">von {c.by}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Guestbook Messages */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-sm text-white">
                Nachrichten
              </h3>
              <span className="text-xs text-slate-400">
                {allVotes.filter(v => v.message && v.message.trim()).length} Einträge
              </span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {allVotes.filter(v => v.message && v.message.trim()).length === 0 ? (
                <p className="text-xs text-slate-500 italic py-3 text-center">
                  Noch keine Nachrichten hinterlassen.
                </p>
              ) : (
                allVotes
                  .filter(v => v.message && v.message.trim())
                  .map((vote) => {
                  const msgId = vote.id || vote.name;
                  return (
                    <div 
                      key={msgId}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white">
                          {vote.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(vote.created_at).toLocaleDateString('de-DE')}
                        </span>
                      </div>

                      <p className="text-slate-300 italic">
                        &ldquo;{vote.message}&rdquo;
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PARTICIPANTS LIST (Ganz unten) */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-3.5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300">
            {allVotes.length} abgegebene Stimmen
          </span>
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onRefresh();
            }}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Aktualisieren</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {allVotes.map((v) => (
            <span 
              key={v.id || v.name}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5"
            >
              <strong className="text-white font-medium">{v.name}</strong>
              <span className="text-[10px] text-slate-500 font-mono">({v.selected_slots?.length || 0} Tage)</span>
            </span>
          ))}
        </div>
      </div>

      {/* Clean Footer */}
      <div className="text-center pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <span>Klassentreffen 2.0 • Lowkey Pflichttermin!</span>
        <span className="flex items-center gap-1">
          <Code2 className="w-3.5 h-3.5 text-fuchsia-400" /> Tool engineered by Bene
        </span>
      </div>

    </div>
  );
}
