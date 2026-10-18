export const FIXED_TIME = 'ab 19 Uhr';
export const TIME_SLOTS = []; // fallback for cached HMR

export const WEEKENDS = [
  {
    id: 'we-1',
    label: 'Wochenende 1',
    range: '19. – 21. März',
    days: [
      { id: 'we-1-fri', dayName: 'Freitag', date: '19. Mär', fullDate: 'Fr, 19. März' },
      { id: 'we-1-sat', dayName: 'Samstag', date: '20. Mär', fullDate: 'Sa, 20. März' },
      { id: 'we-1-sun', dayName: 'Sonntag', date: '21. Mär', fullDate: 'So, 21. März' }
    ]
  },
  {
    id: 'we-2',
    label: 'Wochenende 2 (Ostern 🐣)',
    range: '26. – 29. März (Ostern 🐣)',
    days: [
      { id: 'we-2-fri', dayName: 'Karfreitag', date: '26. Mär', fullDate: 'Karfreitag, 26. März', badge: 'Feiertag 🐣' },
      { id: 'we-2-sat', dayName: 'Karsamstag', date: '27. Mär', fullDate: 'Karsamstag, 27. März', badge: 'Ostern' },
      { id: 'we-2-sun', dayName: 'Ostersonntag', date: '28. Mär', fullDate: 'Ostersonntag, 28. März', badge: 'Ostern' },
      { id: 'we-2-mon', dayName: 'Ostermontag', date: '29. Mär', fullDate: 'Ostermontag, 29. März', badge: 'Feiertag 🐣' }
    ]
  },
  {
    id: 'we-3',
    label: 'Wochenende 3',
    range: '02. – 04. April',
    days: [
      { id: 'we-3-fri', dayName: 'Freitag', date: '02. Apr', fullDate: 'Fr, 02. April' },
      { id: 'we-3-sat', dayName: 'Samstag', date: '03. Apr', fullDate: 'Sa, 03. April' },
      { id: 'we-3-sun', dayName: 'Sonntag', date: '04. Apr', fullDate: 'So, 04. April' }
    ]
  },
  {
    id: 'we-4',
    label: 'Wochenende 4',
    range: '09. – 11. April',
    days: [
      { id: 'we-4-fri', dayName: 'Freitag', date: '09. Apr', fullDate: 'Fr, 09. April' },
      { id: 'we-4-sat', dayName: 'Samstag', date: '10. Apr', fullDate: 'Sa, 10. April' },
      { id: 'we-4-sun', dayName: 'Sonntag', date: '11. Apr', fullDate: 'So, 11. April' }
    ]
  },
  {
    id: 'we-5',
    label: 'Wochenende 5',
    range: '16. – 18. April',
    days: [
      { id: 'we-5-fri', dayName: 'Freitag', date: '16. Apr', fullDate: 'Fr, 16. April' },
      { id: 'we-5-sat', dayName: 'Samstag', date: '17. Apr', fullDate: 'Sa, 17. April' },
      { id: 'we-5-sun', dayName: 'Sonntag', date: '18. Apr', fullDate: 'So, 18. April' }
    ]
  },
  {
    id: 'we-6',
    label: 'Wochenende 6',
    range: '23. – 25. April',
    days: [
      { id: 'we-6-fri', dayName: 'Freitag', date: '23. Apr', fullDate: 'Fr, 23. April' },
      { id: 'we-6-sat', dayName: 'Samstag', date: '24. Apr', fullDate: 'Sa, 24. April' },
      { id: 'we-6-sun', dayName: 'Sonntag', date: '25. Apr', fullDate: 'So, 25. April' }
    ]
  }
];

// Flat list of all 18 selectable days
export const ALL_DAYS = WEEKENDS.flatMap(we => 
  we.days.map(d => ({ ...d, weekendLabel: we.range, weekendId: we.id }))
);

export const PRESET_LOCATIONS = [
  {
    id: 'bar_restaurant',
    title: 'Bar / Restaurant in Freiburg',
    desc: 'Gemütlich zusammensitzen, lecker essen und Drinks in der City',
    icon: '🍻'
  },
  {
    id: 'action',
    title: 'Action: Lasertag, Bowling oder Ähnliches',
    desc: 'Gemeinsam aktiv werden, Spaß haben und gegeneinander zocken',
    icon: '🎳'
  },
  {
    id: 'outdoor',
    title: 'Draußen: Dreisam, Park oder kleine Wanderung',
    desc: 'Entspannt an der Dreisam chillen, Park-Vibes oder kleiner Ausflug ins Grüne',
    icon: '🌲'
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
