export const WEEKENDS = [
  {
    id: 'we-1',
    label: 'Wochenende 1',
    range: '20. – 22. März',
    badge: 'März-Start 🌸',
    color: 'from-fuchsia-500/20 to-pink-500/10',
    days: [
      { id: 'fri', name: 'Freitag', date: '20. Mär', fullDate: 'Fr, 20. März' },
      { id: 'sat', name: 'Samstag', date: '21. Mär', fullDate: 'Sa, 21. März', isPopular: true },
      { id: 'sun', name: 'Sonntag', date: '22. Mär', fullDate: 'So, 22. März' }
    ]
  },
  {
    id: 'we-2',
    label: 'Wochenende 2',
    range: '27. – 29. März',
    badge: 'März-Finale 🔥',
    color: 'from-purple-500/20 to-indigo-500/10',
    days: [
      { id: 'fri', name: 'Freitag', date: '27. Mär', fullDate: 'Fr, 27. März' },
      { id: 'sat', name: 'Samstag', date: '28. Mär', fullDate: 'Sa, 28. März', isPopular: true },
      { id: 'sun', name: 'Sonntag', date: '29. Mär', fullDate: 'So, 29. März' }
    ]
  },
  {
    id: 'we-3',
    label: 'Wochenende 3',
    range: '03. – 05. April',
    badge: 'April Kickoff 🐣',
    color: 'from-cyan-500/20 to-blue-500/10',
    days: [
      { id: 'fri', name: 'Freitag', date: '03. Apr', fullDate: 'Fr, 03. April' },
      { id: 'sat', name: 'Samstag', date: '04. Apr', fullDate: 'Sa, 04. April', isPopular: true },
      { id: 'sun', name: 'Sonntag', date: '05. Apr', fullDate: 'So, 05. April' }
    ]
  },
  {
    id: 'we-4',
    label: 'Wochenende 4',
    range: '10. – 12. April',
    badge: 'Mitte April ☀️',
    color: 'from-emerald-500/20 to-teal-500/10',
    days: [
      { id: 'fri', name: 'Freitag', date: '10. Apr', fullDate: 'Fr, 10. April' },
      { id: 'sat', name: 'Samstag', date: '11. Apr', fullDate: 'Sa, 11. April', isPopular: true },
      { id: 'sun', name: 'Sonntag', date: '12. Apr', fullDate: 'So, 12. April' }
    ]
  },
  {
    id: 'we-5',
    label: 'Wochenende 5',
    range: '17. – 19. April',
    badge: 'Late April 🚀',
    color: 'from-amber-500/20 to-orange-500/10',
    days: [
      { id: 'fri', name: 'Freitag', date: '17. Apr', fullDate: 'Fr, 17. April' },
      { id: 'sat', name: 'Samstag', date: '18. Apr', fullDate: 'Sa, 18. April', isPopular: true },
      { id: 'sun', name: 'Sonntag', date: '19. Apr', fullDate: 'So, 19. April' }
    ]
  }
];

export const TIME_SLOTS = [
  {
    id: 'afternoon',
    label: '15:00 - 18:00',
    title: 'Nachmittags',
    subtitle: 'Chillen & Vorglühen',
    icon: '🌅',
    color: 'amber'
  },
  {
    id: 'prime',
    label: '18:00 - 21:00',
    title: 'Primetime',
    subtitle: 'Food & Drinks',
    icon: '🍕',
    color: 'pink'
  },
  {
    id: 'night',
    label: '21:00 - Open End',
    title: 'Nightlife',
    subtitle: 'Eskalation & Bar',
    icon: '🌙',
    color: 'purple'
  }
];

export const PRESET_LOCATIONS = [
  {
    id: 'kneipe',
    title: 'Alte Stammkneipe / Eckkneipe',
    tag: 'Der Klassiker 🍺',
    desc: 'Bier vom Fass, Schnitzel, Dart & alte Geschichten wie vor 10 Jahren',
    icon: '🍻',
    accent: 'border-amber-500/40 bg-amber-500/10 hover:border-amber-400'
  },
  {
    id: 'restaurant',
    title: 'Gemütlicher Italiener / Tapas Bar',
    tag: 'Food coma & Vino 🍝',
    desc: 'Lange Tafel, Pizza aus dem Steinofen, guter Wein, alle quatschen stundenlang',
    icon: '🍕',
    accent: 'border-rose-500/40 bg-rose-500/10 hover:border-rose-400'
  },
  {
    id: 'park',
    title: 'Park & Grillen / Open Air Chill',
    tag: 'Frühlings-Vibes ☀️',
    desc: 'Decken auf der Wiese, Kasten Bier, Grillwürste, Bluetooth-Box & Frisbee',
    icon: '🥩',
    accent: 'border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-400'
  },
  {
    id: 'club',
    title: 'Club & Party / Bar-Hopping',
    tag: 'Abriss garantiert 🪩',
    desc: 'Erst Drinks in der Bar, danach Club bis 5 Uhr morgens. Kater inklusive.',
    icon: '🕺',
    accent: 'border-fuchsia-500/40 bg-fuchsia-500/10 hover:border-fuchsia-400'
  },
  {
    id: 'schulhof',
    title: 'Schulhof-Tour & Späti-Bier',
    tag: 'Peak Nostalgie 🏫',
    desc: 'Treffpunkt vor dem alten Schultor, Cringe-Stories erzählen & Bier auf der Bank',
    icon: '🎒',
    accent: 'border-cyan-500/40 bg-cyan-500/10 hover:border-cyan-400'
  },
  {
    id: 'bowling',
    title: 'Bowling / Billard & Drinks',
    tag: 'Strike & Spaß 🎳',
    desc: 'Kugeln schieben, wer ne Rinne wirft zahlt den ersten Schnaps!',
    icon: '🎳',
    accent: 'border-indigo-500/40 bg-indigo-500/10 hover:border-indigo-400'
  }
];

export const SLANG_QUOTES = [
  'Lowkey vermisst ihr mich alle 💅',
  'Wer schwänzt ist eh komplett lost 💀',
  'Erste Runde geht auf meinen Nacken! 🍻',
  'Bringt bitte alte Jahrbuch-Fotos mit! 📸',
  'Scheppert anders diesmal 🔥',
  'Keine Ausreden von wegen Arbeit oder Müde! 🚫',
  'Ich bring die JBL-Box mit 🔊',
  'Mashallah was für ein Klassentreffen 👑',
  'Kater am nächsten Tag ist schon eingeplant 🥴',
  'No cap, das wird wild! ⚡'
];

export const AVATARS = [
  '😎', '🤡', '🚀', '⚡', '👑', '📚', '🍕', '🍻', '🪩', '🦊', '🧢', '🦄', '🕶️', '💅', '💀', '🍿'
];

export function formatSlotLabel(slotKey) {
  const parts = slotKey.split('-');
  if (parts.length < 4) return slotKey;
  const weId = `${parts[0]}-${parts[1]}`;
  const dayId = parts[2];
  const timeId = parts[3];

  const weekend = WEEKENDS.find(w => w.id === weId);
  const day = weekend ? weekend.days.find(d => d.id === dayId) : null;
  const slot = TIME_SLOTS.find(s => s.id === timeId);

  return `${day ? day.fullDate : dayId} • ${slot ? slot.title : timeId}`;
}
