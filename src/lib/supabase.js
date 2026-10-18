import { createClient } from '@supabase/supabase-js';

// Default mock data so the app looks alive and hilarious out of the box
export const INITIAL_MOCK_VOTES = [
  {
    id: 'mock-1',
    name: 'Kevin (der Klassenclown)',
    avatar: '🤡',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    selected_slots: [
      'we-1-sat-prime', 'we-1-sat-night',
      'we-2-fri-night', 'we-2-sat-prime', 'we-2-sat-night',
      'we-3-sat-prime', 'we-3-sat-night',
      'we-4-sat-prime'
    ],
    selected_locations: ['kneipe', 'club', 'schulhof'],
    custom_location: 'Späti-Tour durchs alte Viertel mit Sterni',
    message: 'Lowkey habe ich mich 0 verändert, bin immer noch 10 min zu spät! Wer nicht kommt ist eh lost.'
  },
  {
    id: 'mock-2',
    name: 'Lisa (immer 1,0 Schnitt)',
    avatar: '📚',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    selected_slots: [
      'we-1-fri-prime', 'we-1-sat-afternoon', 'we-1-sat-prime',
      'we-2-sat-prime', 'we-2-sun-afternoon',
      'we-3-sat-afternoon', 'we-3-sat-prime'
    ],
    selected_locations: ['restaurant', 'park'],
    custom_location: '',
    message: 'Ich hab schon die alte WhatsApp-Gruppe reaktiviert! Freu mich so auf euch, no cap! 🥰'
  },
  {
    id: 'mock-3',
    name: 'Tobi (Krypto / Startup Grind)',
    avatar: '🚀',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    selected_slots: [
      'we-2-fri-night', 'we-2-sat-night',
      'we-3-fri-night', 'we-3-sat-night',
      'we-4-sat-night'
    ],
    selected_locations: ['club', 'kneipe', 'bowling'],
    custom_location: 'Rooftop Bar mit Schampus',
    message: 'Erste Runde geht auf meinen Nacken! Scheppert anders diesmal 🔥'
  },
  {
    id: 'mock-4',
    name: 'Sarah (die Sportskanone)',
    avatar: '⚡',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    selected_slots: [
      'we-1-sat-afternoon', 'we-1-sat-prime',
      'we-2-sat-afternoon', 'we-2-sat-prime',
      'we-3-sat-afternoon', 'we-3-sat-prime',
      'we-4-sat-afternoon', 'we-4-sat-prime'
    ],
    selected_locations: ['park', 'restaurant', 'bowling'],
    custom_location: '',
    message: 'Park und Grillen wäre peak Nostalgie! Bitte bringt alte Jahrbuch-Fotos mit haha 📸'
  }
];

// Helper to get runtime supabase config (either from env or localStorage)
export function getSupabaseCredentials() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('supabase_custom_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('supabase_custom_key') : null;

  const url = localUrl || envUrl || '';
  const key = localKey || envKey || '';

  const isValid = Boolean(url && url.startsWith('http') && key && key.length > 10);
  return { url, key, isConfigured: isValid };
}

let supabaseInstance = null;

export function getSupabaseClient() {
  const { url, key, isConfigured } = getSupabaseCredentials();
  if (!isConfigured) return null;

  if (!supabaseInstance || supabaseInstance.supabaseUrl !== url) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: { persistSession: false }
      });
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return supabaseInstance;
}

// Fetch all votes (Supabase or Local Storage fallback)
export async function fetchAllVotes() {
  const client = getSupabaseClient();
  
  if (client) {
    try {
      const { data, error } = await client
        .from('votes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
      if (error) {
        console.warn('Supabase fetch error, fallback to local store:', error.message);
      }
    } catch (err) {
      console.warn('Supabase request failed:', err);
    }
  }

  // Fallback to localStorage + initial mocks
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('klassentreffen_local_votes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {}
    }
    // Initialize default seed
    localStorage.setItem('klassentreffen_local_votes', JSON.stringify(INITIAL_MOCK_VOTES));
    return INITIAL_MOCK_VOTES;
  }
  return INITIAL_MOCK_VOTES;
}

// Save a new vote or update existing
export async function submitVote(voteData) {
  const client = getSupabaseClient();
  const newVote = {
    ...voteData,
    created_at: new Date().toISOString()
  };

  let savedRemote = false;

  if (client) {
    try {
      const { data, error } = await client
        .from('votes')
        .insert([newVote])
        .select();

      if (!error && data && data.length > 0) {
        savedRemote = true;
        newVote.id = data[0].id;
      } else if (error) {
        console.error('Supabase insert failed:', error);
      }
    } catch (e) {
      console.warn('Supabase submission network error:', e);
    }
  }

  // Always update local storage too
  if (typeof window !== 'undefined') {
    const current = await fetchAllVotes();
    const updated = [
      { ...newVote, id: newVote.id || 'local-' + Date.now() },
      ...current.filter(v => v.name.toLowerCase() !== newVote.name.toLowerCase())
    ];
    localStorage.setItem('klassentreffen_local_votes', JSON.stringify(updated));
    localStorage.setItem('klassentreffen_my_vote', JSON.stringify(newVote));
  }

  return { success: true, savedRemote, vote: newVote };
}

// Save custom Supabase credentials from settings modal
export function saveCustomSupabaseConfig(url, key) {
  if (typeof window !== 'undefined') {
    if (url && key) {
      localStorage.setItem('supabase_custom_url', url.trim());
      localStorage.setItem('supabase_custom_key', key.trim());
      supabaseInstance = null; // force re-creation
      return true;
    } else {
      localStorage.removeItem('supabase_custom_url');
      localStorage.removeItem('supabase_custom_key');
      supabaseInstance = null;
      return true;
    }
  }
  return false;
}
