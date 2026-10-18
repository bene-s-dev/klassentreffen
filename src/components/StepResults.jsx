import React, { useState, useMemo } from 'react';
import { 
  Trophy, Users, Calendar, MapPin, MessageSquare, Share2, 
  Check, Edit3, Flame, Sparkles, Crown, ExternalLink, Heart,
  ThumbsUp, Beer, Skull, AlertCircle, RefreshCw, Code2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WEEKENDS, TIME_SLOTS, PRESET_LOCATIONS, formatSlotLabel } from '../lib/constants';
import { sounds } from '../lib/sounds';

export default function StepResults({ 
  allVotes, 
  myVote, 
  onEditVote, 
  onRefresh, 
  isSupabaseConnected 
}) {
  const [copied, setCopied] = useState(false);
  const [filterTopOnly, setFilterTopOnly] = useState(false);
  const [reactions, setReactions] = useState({});

  // Trigger confetti once on mount
  React.useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.3 }
      });
    } catch {}
  }, []);

  // Calculate stats for all slots
  const slotStats = useMemo(() => {
    const counts = {};
    const totalVoters = allVotes.length;

    // Collect all possible slots
    WEEKENDS.forEach(we => {
      we.days.forEach(d => {
        TIME_SLOTS.forEach(s => {
          const key = `${we.id}-${d.id}-${s.id}`;
          counts[key] = {
            key,
            weekend: we,
            day: d,
            slot: s,
            votes: 0,
            voters: []
          };
        });
      });
    });

    // Count votes
    allVotes.forEach(vote => {
      (vote.selected_slots || []).forEach(slotKey => {
        if (counts[slotKey]) {
          counts[slotKey].votes += 1;
          counts[slotKey].voters.push(vote);
        }
      });
    });

    // Convert to sorted array
    const sorted = Object.values(counts).sort((a, b) => b.votes - a.votes);
    const topSlot = sorted[0] || null;

    return { counts, sorted, topSlot, totalVoters };
  }, [allVotes]);

  // Calculate location stats
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
          by: vote.name,
          avatar: vote.avatar
        });
      }
    });

    const sortedLocs = Object.values(locCounts).sort((a, b) => b.count - a.count);
    return { sortedLocs, customLocs };
  }, [allVotes]);

  // Share link handler
  const handleShare = () => {
    sounds.playPop();
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleAddReaction = (messageId, emoji) => {
    sounds.playPop();
    setReactions(prev => {
      const key = `${messageId}-${emoji}`;
      const count = (prev[key] || 0) + 1;
      return { ...prev, [key]: count };
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-28 animate-slide-in">
      
      {/* Top Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 text-amber-300 border border-amber-500/30 mb-3 shadow-lg">
          <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
          Klassentreffen 2.0 • Offizielle Abrechnung
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">
          Wer kann wann? Die Ergebnisse! 🏆
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          Alle Stimmen live auf einen Blick. Wer schwänzt, kriegt lebenslanges Hausverbot!
        </p>
      </div>

      {/* TOP WINNER SPOTLIGHT BANNER */}
      {slotStats.topSlot && slotStats.topSlot.votes > 0 && (
        <div className="glass-panel-highlight rounded-3xl p-6 sm:p-8 mb-8 border border-amber-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/20 via-fuchsia-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-pink-500 flex items-center justify-center text-3xl sm:text-4xl shadow-xl shadow-amber-500/30 shrink-0 animate-pulse">
                👑
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                    Aktueller Boss-Termin 🔥
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {slotStats.topSlot.votes} von {slotStats.totalVoters} Stimmen ({Math.round((slotStats.topSlot.votes / Math.max(1, slotStats.totalVoters)) * 100)}%)
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                  {slotStats.topSlot.day.fullDate}
                </h3>
                <p className="text-sm sm:text-base text-fuchsia-300 font-semibold flex items-center gap-2 mt-1">
                  <span>{slotStats.topSlot.slot.icon} {slotStats.topSlot.slot.title} ({slotStats.topSlot.slot.label})</span>
                  <span>•</span>
                  <span>{slotStats.topSlot.weekend.label}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-display font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>{copied ? 'Link kopiert! 🚀' : 'Auf WhatsApp teilen'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onEditVote();
                }}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/15 text-slate-200 hover:text-white hover:bg-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Edit3 className="w-4 h-4 text-fuchsia-400" />
                <span>Meine Stimme anpassen</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PARTICIPANTS STRIP */}
      <div className="glass-panel rounded-2xl p-4 mb-8 border border-white/10 shadow-lg">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <h4 className="font-display font-bold text-sm text-white">
              Wer hat abgestimmt? ({allVotes.length} am Start)
            </h4>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onRefresh();
            }}
            title="Neu laden"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {allVotes.map((v) => (
            <div 
              key={v.id || v.name}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs shadow-sm"
            >
              <span className="text-base select-none">{v.avatar || '😎'}</span>
              <span className="font-semibold text-slate-200">{v.name}</span>
              <span className="text-[10px] text-fuchsia-400 font-mono">
                {v.selected_slots?.length || 0} Slots
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* DOODLE MATRIX HEATMAP */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 mb-8 border border-white/10 shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-white/10">
          <div>
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <span>Doodle-Heatmap der Termine</span>
            </h3>
            <p className="text-xs text-slate-400">
              Sieh genau, wer an welchem Tag Zeit hat und wo die meiste Übereinstimmung herrscht.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                setFilterTopOnly(!filterTopOnly);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                filterTopOnly 
                  ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-300' 
                  : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {filterTopOnly ? '✓ Nur Favoriten (>1 Vote)' : 'Alle Termine anzeigen'}
            </button>
          </div>
        </div>

        {/* Scrollable Heatmap Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3 w-56">Termin &amp; Slot</th>
                <th className="py-3 px-3 w-28 text-center">Stimmen</th>
                {allVotes.map((v) => (
                  <th key={v.id || v.name} className="py-3 px-2 text-center" title={v.name}>
                    <div className="flex flex-col items-center">
                      <span className="text-base select-none">{v.avatar || '😎'}</span>
                      <span className="text-[10px] text-slate-300 truncate max-w-[70px]">
                        {v.name.split(' ')[0]}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {slotStats.sorted
                .filter(item => (filterTopOnly ? item.votes > 1 : true))
                .slice(0, filterTopOnly ? 25 : 45)
                .map((item, idx) => {
                  const percentage = Math.round((item.votes / Math.max(1, slotStats.totalVoters)) * 100);
                  const isTop = idx === 0 && item.votes > 0;

                  return (
                    <tr 
                      key={item.key} 
                      className={`transition-colors ${
                        isTop ? 'bg-amber-500/10' : 'hover:bg-slate-900/60'
                      }`}
                    >
                      {/* Slot Description */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base select-none">{item.slot.icon}</span>
                          <div>
                            <div className="flex items-center gap-1.5 font-semibold text-white">
                              <span>{item.day.fullDate}</span>
                              {isTop && (
                                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/40">
                                  Top 👑
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {item.slot.title} ({item.slot.label})
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Vote Count & Progress Bar */}
                      <td className="py-2.5 px-3">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-white text-xs mb-1">
                            {item.votes} / {slotStats.totalVoters}
                          </span>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isTop ? 'bg-amber-400' : 'bg-gradient-to-r from-fuchsia-500 to-indigo-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Participant Checkmarks */}
                      {allVotes.map((v) => {
                        const canAttend = (v.selected_slots || []).includes(item.key);
                        return (
                          <td key={v.id || v.name} className="py-2.5 px-2 text-center">
                            {canAttend ? (
                              <span className="inline-flex w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 items-center justify-center font-bold text-xs shadow-sm">
                                ✓
                              </span>
                            ) : (
                              <span className="inline-block text-slate-600 text-xs">
                                –
                              </span>
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

      {/* LOCATIONS RANKING */}
      <div className="glass-panel rounded-3xl p-6 mb-8 border border-white/10 shadow-xl">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-pink-400" />
            <h3 className="font-display font-bold text-xl text-white">
              Location-Ranking: Wo steppt der Bär?
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {locationStats.sortedLocs.reduce((acc, l) => acc + l.count, 0)} Stimmen insgesamt
          </span>
        </div>

        <div className="space-y-4 mb-6">
          {locationStats.sortedLocs.map((loc, idx) => {
            const percentage = Math.round((loc.count / Math.max(1, slotStats.totalVoters)) * 100);
            return (
              <div key={loc.id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl select-none">{loc.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-white text-sm">
                          {loc.title}
                        </span>
                        {idx === 0 && loc.count > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                            Platz 1 🥇
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{loc.tag}</span>
                    </div>
                  </div>

                  <span className="font-bold text-white text-sm">
                    {loc.count} {loc.count === 1 ? 'Stimme' : 'Stimmen'} ({percentage}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Location Proposals from Classmates */}
        {locationStats.customLocs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Vorschläge aus der Klasse:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {locationStats.customLocs.map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/20 flex items-center gap-2.5 text-xs">
                  <span className="text-lg select-none">{c.avatar}</span>
                  <div>
                    <p className="font-bold text-amber-300">&ldquo;{c.location}&rdquo;</p>
                    <p className="text-[10px] text-slate-400">vorgeschlagen von {c.by}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* WALL OF FAME & GUESTBOOK */}
      <div className="glass-panel-highlight rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xl shadow-md">
              💬
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white">
                Wall of Fame &amp; Gästebuch
              </h3>
              <p className="text-xs text-slate-400">
                Die besten Sprüche, alte Erinnerungen und Grüße der Klasse
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {allVotes.filter(v => v.message).length} Einträge
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allVotes
            .filter(v => v.message && v.message.trim())
            .map((vote) => {
              const msgId = vote.id || vote.name;
              return (
                <div 
                  key={msgId}
                  className="rounded-2xl p-4 bg-slate-900/80 border border-white/10 flex flex-col justify-between hover:border-purple-500/40 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl select-none">{vote.avatar || '😎'}</span>
                        <span className="font-bold text-sm text-white">{vote.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(vote.created_at).toLocaleDateString('de-DE')}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-4">
                      &ldquo;{vote.message}&rdquo;
                    </p>
                  </div>

                  {/* Reaction buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    {['🔥', '👏', '🍻', '👑'].map((emoji) => {
                      const count = reactions[`${msgId}-${emoji}`] || 0;
                      return (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleAddReaction(msgId, emoji)}
                          className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 border transition-all cursor-pointer ${
                            count > 0
                              ? 'bg-purple-500/20 border-purple-500/40 text-purple-200'
                              : 'bg-slate-800/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <span>{emoji}</span>
                          {count > 0 && <span className="font-bold text-[10px]">{count}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* FOOTER ACTION BANNER */}
      <div className="mt-12 text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-4 rounded-3xl glass-panel border border-white/15">
          <p className="text-xs sm:text-sm text-slate-300">
            🎉 <strong className="text-white">Klassentreffen 2.0</strong> • Lowkey Pflichttermin!
          </p>
          <span className="text-slate-500 text-xs flex items-center gap-1">
            <Code2 className="w-3.5 h-3.5 text-fuchsia-400" /> Tool engineered by Bene
          </span>
          <button
            type="button"
            onClick={handleShare}
            className="px-5 py-2.5 rounded-2xl glass-button-primary text-white font-display font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'Link kopiert!' : 'Klassengruppe einladen 🚀'}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
