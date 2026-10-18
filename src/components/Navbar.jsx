import React from 'react';
import { Volume2, VolumeX, Database, Users, BarChart2, Edit3, Code2 } from 'lucide-react';
import { sounds } from '../lib/sounds';

export default function Navbar({ 
  currentStep, 
  setCurrentStep, 
  votesCount, 
  isSupabaseConnected, 
  onOpenSupabaseModal, 
  soundEnabled, 
  setSoundEnabled,
  hasVoted
}) {
  const toggleSound = () => {
    const next = sounds.toggle();
    setSoundEnabled(next);
    if (next) sounds.playPop();
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/10 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand: Pure Klassentreffen 2.0 */}
        <div 
          onClick={() => {
            sounds.playPop();
            setCurrentStep(hasVoted ? 5 : 1);
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-fuchsia-600 via-pink-600 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-fuchsia-500/25 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 relative">
            <span className="select-none">🍻</span>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-lg text-white tracking-tight group-hover:text-fuchsia-400 transition-colors">
                Klassentreffen
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-fuchsia-500/30 to-pink-500/30 text-fuchsia-300 border border-fuchsia-500/40">
                2<span className="animate-dot-blink inline-block">.</span>0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:flex items-center gap-1">
              <span>Lowkey Pflichttermin</span>
              <span>•</span>
              <span className="text-slate-500 flex items-center gap-0.5">
                <Code2 className="w-3 h-3 text-fuchsia-400" /> Tech by Bene
              </span>
            </p>
          </div>
        </div>

        {/* Right side controls & navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Live participant counter pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-white/10 text-xs text-slate-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-white">{votesCount}</span>
            <span className="hidden sm:inline text-slate-400">am Start</span>
          </div>

          {/* Supabase status indicator */}
          <button
            onClick={() => {
              sounds.playPop();
              onOpenSupabaseModal();
            }}
            title={isSupabaseConnected ? 'Supabase ist live synchronisiert!' : 'Supabase Datenbank verbinden'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isSupabaseConnected 
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25' 
                : 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {isSupabaseConnected ? 'Supabase Live' : 'Supabase Setup'}
            </span>
          </button>

          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Sound stummschalten' : 'Sound aktivieren'}
            className="p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-fuchsia-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Quick toggle between Vote and Results */}
          {currentStep === 5 ? (
            <button
              onClick={() => {
                sounds.playPop();
                setCurrentStep(1);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-fuchsia-600/25 border border-fuchsia-500/50 text-fuchsia-200 hover:bg-fuchsia-600/40 text-xs font-bold transition-all hover:scale-105 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{hasVoted ? 'Meine Stimme' : 'Abstimmen'}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playPop();
                setCurrentStep(5);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600/25 border border-indigo-500/50 text-indigo-200 hover:bg-indigo-600/40 text-xs font-bold transition-all hover:scale-105 cursor-pointer"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Ergebnisse</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
