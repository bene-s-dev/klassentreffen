import React, { useState } from 'react';
import { X, Database, Check, Copy, ExternalLink, AlertCircle, Sparkles } from 'lucide-react';
import { getSupabaseCredentials, saveCustomSupabaseConfig, getSupabaseClient } from '../lib/supabase';
import { sounds } from '../lib/sounds';

export default function SupabaseModal({ isOpen, onClose, onConfigSaved }) {
  const current = getSupabaseCredentials();
  const [url, setUrl] = useState(current.url);
  const [anonKey, setAnonKey] = useState(current.key);
  const [copiedSql, setCopiedSql] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e?.preventDefault();
    sounds.playPop();

    if (!url.trim() || !anonKey.trim()) {
      saveCustomSupabaseConfig('', '');
      setStatusMessage('Zurückgesetzt auf Local Storage & Mock-Daten.');
      onConfigSaved();
      setTimeout(onClose, 1200);
      return;
    }

    saveCustomSupabaseConfig(url, anonKey);
    const client = getSupabaseClient();
    if (client) {
      try {
        const { error } = await client.from('votes').select('count', { count: 'exact', head: true });
        if (!error) {
          sounds.playSuccess();
          setStatusMessage('✅ Supabase erfolgreich verbunden & Tabelle gefunden!');
        } else {
          setStatusMessage(`⚠️ Verbunden, aber Tabelle 'votes' fehlt noch. Bitte führe das SQL-Script aus! (${error.message})`);
        }
      } catch (err) {
        setStatusMessage('⚠️ Verbindungstest fehlgeschlagen: ' + err.message);
      }
    }
    onConfigSaved();
  };

  const copySqlScript = () => {
    sounds.playPop();
    const sql = `-- Supabase SQL Script für Bene's Klassentreffen 2.0
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  avatar text not null default '😎',
  selected_slots text[] not null default '{}',
  selected_locations text[] not null default '{}',
  custom_location text default '',
  message text default ''
);

alter table public.votes enable row level security;

create policy "Allow public read access" on public.votes for select using (true);
create policy "Allow public insert access" on public.votes for insert with check (true);
create policy "Allow public update access" on public.votes for update using (true);

alter publication supabase_realtime add table public.votes;
`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-2xl bg-slate-950/80 animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl glass-panel-highlight p-6 sm:p-8 border border-white/15 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Supabase Datenbank
              </h3>
              <p className="text-xs text-slate-400">
                {current.isConfigured ? '🟢 Supabase ist aktiv' : '🟡 Aktuell im Local Storage Modus'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Note */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 mb-6 text-xs text-slate-300 leading-relaxed">
          <p>
            💡 <strong className="text-white">Kein Stress:</strong> Die App funktioniert auch ohne Supabase komplett mit interaktiven Mock-Stimmen &amp; Browser-Speicher! Wenn du Live-Sync willst, trage hier einfach deine Supabase Credentials ein.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Project URL (VITE_SUPABASE_URL)
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Anon Public Key (VITE_SUPABASE_ANON_KEY)
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsIn..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
            />
          </div>

          {statusMessage && (
            <p className="text-xs font-medium text-emerald-300 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              {statusMessage}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-102 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Speichern &amp; Testen</span>
            </button>
          </div>
        </form>

        {/* Copy SQL Schema Section */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              SQL Schema (1-Klick Setup)
            </span>
            <button
              type="button"
              onClick={copySqlScript}
              className="px-2.5 py-1 rounded-lg bg-slate-800 border border-white/10 text-slate-300 hover:text-white flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedSql ? 'Kopiert! ✓' : 'Script kopieren'}</span>
            </button>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Einfach in deinem Supabase Dashboard auf <strong>SQL Editor</strong> klicken, einfügen und auf <strong>Run</strong> drücken! Schon ist die Tabelle fertig.
          </p>
        </div>

      </div>
    </div>
  );
}
