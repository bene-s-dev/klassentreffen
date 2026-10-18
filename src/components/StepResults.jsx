import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, MapPin, MessageSquare, Trash2, RefreshCw } from 'lucide-react';
import { ALL_DAYS, FIXED_TIME, PRESET_LOCATIONS } from '../lib/constants';
import { sounds } from '../lib/sounds';

export default function StepResults({ 
  allVotes, 
  myVote, 
  onDeleteVote,
  onRefresh
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [animateBars, setAnimateBars] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateBars(true), 80);
    return () => clearTimeout(timer);
  }, []);

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
    const maxVotes = sorted[0]?.votes || 0;
    const topDays = maxVotes > 0 ? sorted.filter(d => d.votes === maxVotes) : [];
    const topDay = sorted[0] || null;

    return { counts, sorted, topDays, topDay, maxVotes, totalVoters };
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
      
      {/* WINNER BANNER with Subtle Moving Gradient */}
      {dayStats.topDays && dayStats.topDays.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl winner-card-animated border border-amber-500/35 p-4 sm:p-5 mb-6 shadow-sm text-center">
          {/* Animated White Glass Sheen moving across */}
          <div 
            className="pointer-events-none absolute inset-0 -top-12 -bottom-12 w-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent animate-glass-shimmer"
          />

          <div className="relative z-10 text-center py-1">
            <span className="text-[11px] sm:text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-2 sm:mb-2.5">
              {dayStats.topDays.length > 1 ? 'Aktuell beliebteste Termine (Gleichstand)' : 'Aktuell beliebtester Termin'}
            </span>
            {dayStats.topDays.length > 1 ? (
              <div className="space-y-1.5">
                {dayStats.topDays.map((d) => (
                  <h3 key={d.id} className="font-display font-bold text-base sm:text-xl text-white tracking-tight">
                    {d.resultDate || d.fullDate} • {FIXED_TIME}
                  </h3>
                ))}
              </div>
            ) : (
              <h3 className="font-display font-bold text-lg sm:text-2xl text-white tracking-tight">
                {dayStats.topDays[0].resultDate || dayStats.topDays[0].fullDate} • {FIXED_TIME}
              </h3>
            )}
          </div>
        </div>
      )}

      {/* Personalized user status bar if user has already voted */}
      {myVote?.name ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 mb-4 rounded-2xl bg-slate-900/90 border border-fuchsia-500/25 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="text-xl select-none">👋</span>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-white">
                Danke {myVote.name}, Deine Stimme ist erfasst!
              </p>
              <p className="text-[11px] text-slate-400">
                Hier siehst Du alle Stimmen & Locations im Live-Vergleich.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {!confirmDelete ? (
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setConfirmDelete(true);
                }}
                className="px-2.5 py-1.5 rounded-xl gradient-btn-danger text-rose-300 hover:text-rose-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                title="Löscht Deine Stimme und bringt Dich zur Startseite"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Löschen</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 animate-fadeIn bg-slate-950/90 border border-rose-500/40 p-1 rounded-xl shadow-md">
                <span className="text-[11px] text-rose-300 font-medium pl-1.5">Wirklich löschen?</span>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playToggle(false);
                    setConfirmDelete(false);
                    onDeleteVote();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer shadow-sm transition-colors"
                >
                  Ja
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Delete Vote Button placed top-right above the Tage-Übersicht */
        <div className="flex justify-end mb-2.5">
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                setConfirmDelete(true);
              }}
              className="px-2.5 py-1.5 rounded-xl gradient-btn-danger text-rose-300 hover:text-rose-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              title="Löscht Deine Stimme und bringt Dich zur Startseite"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Meine Antwort löschen</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 animate-fadeIn bg-slate-950/90 border border-rose-500/40 p-1 rounded-xl shadow-md">
              <span className="text-[11px] text-rose-300 font-medium pl-1.5">Wirklich löschen?</span>
              <button
                type="button"
                onClick={() => {
                  sounds.playToggle(false);
                  setConfirmDelete(false);
                  onDeleteVote();
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer shadow-sm transition-colors"
              >
                Ja
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer transition-colors"
              >
                Abbrechen
              </button>
            </div>
          )}
        </div>
      )}

      {/* DOODLE MATRIX */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 mb-6 overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-fuchsia-400" />
            <h3 className="font-display font-bold text-sm sm:text-base text-white">
              Tage-Übersicht
            </h3>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
            <span>Live aktualisiert</span>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[520px]">
          <table className="text-left border-collapse w-max min-w-full">
            <thead className="sticky top-0 z-20">
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 pl-3 pr-2 w-[114px] min-w-[114px] max-w-[114px] sm:w-36 sm:min-w-36 whitespace-nowrap bg-slate-900/95 backdrop-blur-md">Tag</th>
                <th className="p-0 text-center w-[70px] min-w-[70px] max-w-[70px] sm:w-20 sm:min-w-20 whitespace-nowrap bg-slate-900/95 backdrop-blur-md">
                  <div className="py-2 px-1.5 bg-slate-950/70 rounded-t-xl">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      Stimmen
                    </span>
                  </div>
                </th>
                {allVotes.map((v) => {
                  const isMe = myVote && (v.id === myVote.id || (v.name && myVote.name && v.name.toLowerCase() === myVote.name.toLowerCase()));
                  return (
                    <th 
                      key={v.id || v.name} 
                      className={`py-2.5 px-3 sm:px-4 text-center min-w-[72px] whitespace-nowrap bg-slate-900/95 backdrop-blur-md ${isMe ? 'bg-fuchsia-950/40 border-x border-fuchsia-500/30' : ''}`} 
                      title={v.name}
                    >
                      <span className={`text-[11px] block font-semibold mx-auto whitespace-nowrap ${isMe ? 'text-fuchsia-400 font-bold' : 'text-fuchsia-300'}`}>
                        {v.name}
                        {isMe && <span className="text-[9px] text-fuchsia-300/80 font-normal block">(Du)</span>}
                      </span>
                    </th>
                  );
                })}
                {allVotes.length < 3 && <th className="p-0 bg-slate-900/95 backdrop-blur-md"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {dayStats.sorted.map((day, idx) => {
                const percentage = Math.round((day.votes / Math.max(1, dayStats.totalVoters)) * 100);
                const isTop = day.votes > 0 && day.votes === dayStats.maxVotes;
                const isLast = idx === dayStats.sorted.length - 1;

                return (
                  <tr 
                    key={day.id} 
                    style={{ animationDelay: `${idx * 40}ms` }}
                    className={`transition-colors animate-cascade ${
                      isTop ? 'bg-amber-500/5' : 'hover:bg-slate-850/60'
                    }`}
                  >
                    <td className="py-2.5 pl-3 pr-2 w-[114px] min-w-[114px] max-w-[114px] sm:w-36 sm:min-w-36 whitespace-nowrap">
                      <span className="font-semibold text-white text-xs">
                        {day.resultDate || day.fullDate}
                      </span>
                    </td>

                    <td className="p-0 text-center w-[70px] min-w-[70px] max-w-[70px] sm:w-20 sm:min-w-20">
                      <div className={`py-2.5 px-2 bg-slate-950/50 ${isLast ? 'rounded-b-xl' : ''}`}>
                        <span className={`font-mono font-bold text-xs ${isTop ? 'text-amber-400' : 'text-slate-200'}`}>
                          {day.votes}
                        </span>
                        <div className="w-10 bg-slate-800 rounded-full h-1 mx-auto mt-1 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-700 ease-out ${isTop ? 'bg-amber-400' : 'bg-fuchsia-500'}`}
                            style={{ width: animateBars ? `${percentage}%` : '0%' }}
                          />
                        </div>
                      </div>
                    </td>

                    {allVotes.map((v) => {
                      const isMe = myVote && (v.id === myVote.id || (v.name && myVote.name && v.name.toLowerCase() === myVote.name.toLowerCase()));
                      const canAttend = (v.selected_slots || []).includes(day.id);
                      return (
                        <td 
                          key={v.id || v.name} 
                          className={`py-2.5 px-3 sm:px-4 text-center min-w-[72px] whitespace-nowrap ${isMe ? 'bg-fuchsia-950/20 border-x border-fuchsia-500/20' : ''}`}
                        >
                          {canAttend ? (
                            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md font-bold text-xs animate-spring-check ${isMe ? 'bg-fuchsia-500/25 text-fuchsia-300' : 'bg-emerald-500/15 text-emerald-400'}`}>
                              ✓
                            </span>
                          ) : (
                            <span className="text-slate-700 text-xs font-mono">–</span>
                          )}
                        </td>
                      );
                    })}
                    {allVotes.length < 3 && <td className="p-0"></td>}
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
            {locationStats.sortedLocs.map((loc, idx) => {
              const percentage = Math.round((loc.count / Math.max(1, dayStats.totalVoters)) * 100);
              return (
                <div 
                  key={loc.id} 
                  style={{ animationDelay: `${idx * 60}ms` }}
                  className="text-xs animate-cascade"
                >
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
                      className="h-full rounded-full bg-pink-500 transition-all duration-700 ease-out"
                      style={{ width: animateBars ? `${percentage}%` : '0%' }}
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
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <h3 className="font-display font-bold text-sm text-white">
                  Nachrichten
                </h3>
              </div>
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
                  .map((vote, idx) => {
                  const msgId = vote.id || vote.name;
                  return (
                    <div 
                      key={msgId}
                      style={{ animationDelay: `${idx * 50}ms` }}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/60 transition-all duration-200 text-xs animate-cascade hover:-translate-y-0.5"
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

    </div>
  );
}
