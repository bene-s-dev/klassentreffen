import React, { useEffect, useState } from 'react';
import { Calendar, Download, CheckCircle2, ArrowLeft, Clock, MapPin, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';

const FILE_NAME = 'Klassentreffen - tipp auf mich 📲.ics';

export default function CalendarDownloadPage({ onBack }) {
  const [downloadTriggered, setDownloadTriggered] = useState(false);

  const startDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = '/klassentreffen.ics';
      link.download = FILE_NAME;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadTriggered(true);
    } catch {}
  };

  useEffect(() => {
    // Auto-trigger download shortly after page load
    const timer = setTimeout(() => {
      startDownload();
    }, 400);

    // Subtle celebration confetti
    try {
      const confettiTimer = setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.5 },
          colors: ['#d946ef', '#c026d3', '#a855f7', '#fbbf24', '#38bdf8']
        });
      }, 500);
      return () => clearTimeout(confettiTimer);
    } catch {}

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#020617] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] rounded-full bg-fuchsia-600/15 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full bg-indigo-600/12 blur-[140px] pointer-events-none" />
      </div>

      <main className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center my-auto animate-fade-in py-6">
        
        {/* Navigation back */}
        <div className="w-full flex items-center justify-between mb-4">
          <a
            href="/"
            onClick={(e) => {
              if (onBack) {
                e.preventDefault();
                onBack();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer py-1 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Zurück zur Einladung</span>
          </a>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Termin fixiert</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full bg-slate-900/90 border border-fuchsia-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          
          {/* Subtle glow border highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/50 to-transparent" />

          {/* Event Summary Pill Header */}
          <div className="text-center mb-6">
            <span className="text-[11px] font-bold tracking-widest text-fuchsia-400 uppercase block mb-1">
              Merian-Klassentreffen 2.0
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Samstag, 3. April
            </h1>
            
            <div className="flex items-center justify-center gap-3 mt-2 text-xs text-slate-300 font-medium">
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                <Clock className="w-3.5 h-3.5 text-fuchsia-400" />
                ab 19:00 Uhr
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                Freiburg
              </span>
            </div>
          </div>

          {/* Download Action Box */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{downloadTriggered ? 'Kalender-Datei wird heruntergeladen...' : 'Download wird vorbereitet...'}</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Falls der Download nicht automatisch gestartet ist:
            </p>
            <button
              type="button"
              onClick={startDownload}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-fuchsia-500/25 transition-transform active:scale-95 cursor-pointer w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              <span>Termin-Datei herunterladen (.ics)</span>
            </button>
          </div>

          {/* Instructions Heading */}
          <div className="text-center mb-4">
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center justify-center gap-2">
              <Smartphone className="w-4 h-4 text-fuchsia-400" />
              <span>So fügst Du den Termin zu Deinem Kalender hinzu:</span>
            </h2>
          </div>

          {/* OS-specific Guides */}
          <div className="space-y-3.5">
            
            {/* iOS Guide */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 transition-colors hover:border-slate-700">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-lg">🍏</span>
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  iPhone / iPad (Apple Kalender)
                </h3>
              </div>
              <ol className="text-xs text-slate-300 space-y-1.5 pl-5 list-decimal marker:text-fuchsia-400 marker:font-bold">
                <li>
                  Tippe auf die heruntergeladene Datei (in Safari auf das <strong className="text-white">blaue Download-Symbol ⬇️</strong> in der Adressleiste oder auf <em>„Laden“</em>).
                </li>
                <li>
                  Tippe auf <strong className="text-fuchsia-300 font-semibold">„Klassentreffen - tipp auf mich 📲.ics“</strong>.
                </li>
                <li>
                  Tippe oben rechts auf <strong className="text-fuchsia-300 font-semibold">„Zu Kalender hinzufügen“</strong> (oder <em>„Hinzufügen“</em>) – fertig! 🎉
                </li>
              </ol>
            </div>

            {/* Android Guide */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 transition-colors hover:border-slate-700">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-lg">🤖</span>
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  Android (Google Kalender)
                </h3>
              </div>
              <ol className="text-xs text-slate-300 space-y-1.5 pl-5 list-decimal marker:text-sky-400 marker:font-bold">
                <li>
                  Öffne <strong className="text-sky-300 font-semibold">„Klassentreffen - tipp auf mich 📲.ics“</strong> über die <strong className="text-white">Benachrichtigungsleiste</strong> oder Deinen <em>Downloads-Ordner</em>.
                </li>
                <li>
                  Wähle bei der Abfrage <strong className="text-white">„Google Kalender“</strong> (oder Dein Kalender-App) aus.
                </li>
                <li>
                  Tippe unten rechts auf <strong className="text-sky-300 font-semibold">„Speichern“</strong> – fertig! 🎉
                </li>
              </ol>
            </div>

          </div>

          {/* Footer inside card */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
            <a
              href="/"
              onClick={(e) => {
                if (onBack) {
                  e.preventDefault();
                  onBack();
                }
              }}
              className="text-xs text-slate-400 hover:text-fuchsia-400 transition-colors font-medium cursor-pointer inline-flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>Zurück zum Einladungsbild</span>
            </a>
          </div>

        </div>
      </main>
    </div>
  );
}
