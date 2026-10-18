export const FIXED_TIME = 'ab 19:00 Uhr';
export const TIME_SLOTS = []; // fallback for cached HMR

export const WEEKENDS = [
  {
    id: 'we-1',
    label: 'Wochenende 1',
    range: '20. – 22. März',
    days: [
      { id: 'we-1-fri', dayName: 'Freitag', date: '20. Mär', fullDate: 'Fr, 20. März' },
      { id: 'we-1-sat', dayName: 'Samstag', date: '21. Mär', fullDate: 'Sa, 21. März' },
      { id: 'we-1-sun', dayName: 'Sonntag', date: '22. Mär', fullDate: 'So, 22. März' }
    ]
  },
  {
    id: 'we-2',
    label: 'Wochenende 2',
    range: '27. – 29. März',
    days: [
      { id: 'we-2-fri', dayName: 'Freitag', date: '27. Mär', fullDate: 'Fr, 27. März' },
      { id: 'we-2-sat', dayName: 'Samstag', date: '28. Mär', fullDate: 'Sa, 28. März' },
      { id: 'we-2-sun', dayName: 'Sonntag', date: '29. Mär', fullDate: 'So, 29. März' }
    ]
  },
  {
    id: 'we-3',
    label: 'Wochenende 3',
    range: '03. – 05. April',
    days: [
      { id: 'we-3-fri', dayName: 'Freitag', date: '03. Apr', fullDate: 'Fr, 03. April' },
      { id: 'we-3-sat', dayName: 'Samstag', date: '04. Apr', fullDate: 'Sa, 04. April' },
      { id: 'we-3-sun', dayName: 'Sonntag', date: '05. Apr', fullDate: 'So, 05. April' }
    ]
  },
  {
    id: 'we-4',
    label: 'Wochenende 4',
    range: '10. – 12. April',
    days: [
      { id: 'we-4-fri', dayName: 'Freitag', date: '10. Apr', fullDate: 'Fr, 10. April' },
      { id: 'we-4-sat', dayName: 'Samstag', date: '11. Apr', fullDate: 'Sa, 11. April' },
      { id: 'we-4-sun', dayName: 'Sonntag', date: '12. Apr', fullDate: 'So, 12. April' }
    ]
  },
  {
    id: 'we-5',
    label: 'Wochenende 5',
    range: '17. – 19. April',
    days: [
      { id: 'we-5-fri', dayName: 'Freitag', date: '17. Apr', fullDate: 'Fr, 17. April' },
      { id: 'we-5-sat', dayName: 'Samstag', date: '18. Apr', fullDate: 'Sa, 18. April' },
      { id: 'we-5-sun', dayName: 'Sonntag', date: '19. Apr', fullDate: 'So, 19. April' }
    ]
  }
];

// Flat list of all 15 selectable days
export const ALL_DAYS = WEEKENDS.flatMap(we => 
  we.days.map(d => ({ ...d, weekendLabel: we.range, weekendId: we.id }))
);

export const PRESET_LOCATIONS = [
  {
    id: 'kneipe',
    title: 'Alte Stammkneipe / Eckkneipe',
    desc: 'Bier vom Fass, Schnitzel, Dart & alte Geschichten wie vor 10 Jahren',
    icon: '🍻'
  },
  {
    id: 'restaurant',
    title: 'Gemütlicher Italiener / Tapas Bar',
    desc: 'Lange Tafel, Pizza, guter Wein, alle quatschen stundenlang',
    icon: '🍕'
  },
  {
    id: 'park',
    title: 'Park & Grillen / Open Air',
    desc: 'Wiese, Kasten Bier, Grill, Musikbox & Frühlingsluft',
    icon: '🥩'
  },
  {
    id: 'club',
    title: 'Club & Party / Bar-Hopping',
    desc: 'Erst Drinks in der Bar, danach Club bis morgens',
    icon: '🕺'
  },
  {
    id: 'schulhof',
    title: 'Schulhof-Tour & Späti-Bier',
    desc: 'Treffpunkt vor dem alten Schultor, Cringe-Stories erzählen & Bier',
    icon: '🎒'
  },
  {
    id: 'bowling',
    title: 'Bowling / Billard & Drinks',
    desc: 'Kugeln schieben, wer ne Rinne wirft zahlt den ersten Schnaps',
    icon: '🎳'
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
  'Kater am nächsten Tag ist schon eingeplant 🥴',
  'No cap, das wird wild! ⚡'
];

export const AVATARS = [
  '😎', '🤡', '🚀', '⚡', '👑', '📚', '🍕', '🍻', '🪩', '🦊', '🧢', '🦄', '🕶️', '💅', '💀', '🍿'
];

export function getDayInfo(dayId) {
  return ALL_DAYS.find(d => d.id === dayId) || null;
}
