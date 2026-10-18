export const FIXED_TIME = 'ab 19 Uhr';
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
  },
  {
    id: 'we-6',
    label: 'Wochenende 6',
    range: '24. – 26. April',
    days: [
      { id: 'we-6-fri', dayName: 'Freitag', date: '24. Apr', fullDate: 'Fr, 24. April' },
      { id: 'we-6-sat', dayName: 'Samstag', date: '25. Apr', fullDate: 'Sa, 25. April' },
      { id: 'we-6-sun', dayName: 'Sonntag', date: '26. Apr', fullDate: 'So, 26. April' }
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
