# 🍻 Klassentreffen 2.0 – Lowkey Pflichttermin!

Eine moderne, ultra-stylische Vite + React + Tailwind CSS Web-App für das Klassentreffen-Voting mit interaktivem Doodle-Style Terminplaner, Location-Abstimmung, Wall of Fame und Supabase-Echtzeit-Synchronisation.

> **Tech by Bene / BeneLabs** ⚡

---

## 🚀 Features

- **Kein Login nötig**: Einfach Name oder alten Spitznamen eingeben, Avatar wählen und direkt loslegen!
- **Interactive Orga-Bot**: Ein witziger digitaler Guide führt mit dynamischen Texten & Gen-Z Sprüchen durch den gesamten Prozess.
- **Pseudo-Loading Animationen**: Zwischen den Schritten laufen witzige Pseudo-Ladebalken mit mathematischen Formeln und Orga-Gags (z.B. *„Berechne Gaußsche Normalverteilung der Wochenend-Matrix...“*).
- **Doodle-Style Terminmatrix**:
  - Wochenenden Freitag bis Sonntag von der 2. Hälfte März bis Mitte April.
  - Zeiteinteilung: *Nachmittags (15–18 Uhr)*, *Primetime (18–21 Uhr)*, *Nightlife (21 Uhr – Open End)*.
  - Sticky Weekend Navigator & Schnellwahl-Shortcuts (*„Ich kann immer (Ehrenmann) 🔥“*, *„Alle Samstage“*, *„Ganzes WE“*).
- **Location-Voting & Custom Spot**:
  - Beliebte Spots (Kneipe, Restaurant, Park & Grillen, Club, Schulhof-Tour, Bowling).
  - Eigenen Geheimtipp-Vorschlag einreichen.
- **Wall of Fame & Gästebuch**:
  - Grüße, Anekdoten und Sprüche hinterlassen.
  - Mit interaktiven Emoji-Reaktionen upvoten (🔥, 👏, 🍻, 👑).
- **Live-Ergebnisse & Heatmap**:
  - Boss-Termin Spotlight mit Siegerkranz & Prozenten.
  - Vollständige Doodle-Matrix mit farbigen Checkmarks aller Mitschüler.
  - Balkendiagramme für die Locations.
  - WhatsApp-Teilen mit 1-Klick Link-Kopierer.
- **Audiovisuelle Effekte**:
  - Taktile Web Audio API Soundeffekte (Pop, Toggle, Success-Chime) ohne externe Sound-Dateien.
  - Konfetti-Kanonen (`canvas-confetti`).
  - Dark Mode Glassmorphism & Neon-Glows.
- **Supabase Integration**:
  - Funktioniert out-of-the-box mit lokalem Speicher & humorvollen Mock-Stimmen.
  - Direkter 1-Klick Supabase Connect Dialog & SQL-Setup.

---

## 🛠️ Supabase Setup (in 1 Minute)

1. Erstelle ein kostenloses Projekt auf [supabase.com](https://supabase.com).
2. Gehe im Dashboard auf **SQL Editor** und füge den Inhalt der Datei [`supabase_schema.sql`](file:///Users/benedikt/Desktop/klassentreffen/supabase_schema.sql) ein.
3. Klicke auf **Run**.
4. Kopiere deine `Project URL` und deinen `anon public key` in eine `.env.local` Datei:
   ```env
   VITE_SUPABASE_URL=https://dein-projekt.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJh...
   ```
   *(Alternativ kannst du sie auch direkt in der laufenden Web-App über den Button **„Supabase Setup“** oben rechts eintragen!)*

---

## 💻 Lokal starten

```bash
# Abhängigkeiten installieren (bereits erledigt)
npm install

# Dev Server starten
npm run dev
```

Die App läuft standardmäßig auf **`http://localhost:5173`**.
