import { createClient } from '@supabase/supabase-js';

// Default mock data with simple day IDs
export const INITIAL_MOCK_VOTES = [
  {
    id: 'mock-1',
    name: 'Kevin (Klassenclown)',
    avatar: '🤡',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    selected_slots: ['we-1-sat', 'we-2-fri', 'we-2-sat', 'we-3-sat', 'we-4-sat'],
    selected_locations: ['kneipe', 'club', 'schulhof'],
    custom_location: 'Späti-Tour durchs alte Viertel mit Sterni',
    message: 'Lowkey habe ich mich 0 verändert, bin immer noch 10 min zu spät! Wer nicht kommt ist eh lost.'
  },
  {
    id: 'mock-2',
    name: 'Lisa (1,0 Schnitt)',
    avatar: '📚',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    selected_slots: ['we-1-fri', 'we-1-sat', 'we-2-sat', 'we-3-sat'],
    selected_locations: ['restaurant', 'park'],
    custom_location: '',
    message: 'Ich hab schon die alte WhatsApp-Gruppe reaktiviert! Freu mich so auf euch, no cap! 🥰'
  },
  {
    id: 'mock-3',
    name: 'Tobi (Krypto-Grind)',
    avatar: '🚀',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    selected_slots: ['we-2-fri', 'we-2-sat', 'we-3-fri', 'we-3-sat'],
    selected_locations: ['club', 'kneipe', 'bowling'],
    custom_location: 'Rooftop Bar mit Schampus',
    message: 'Erste Runde geht auf meinen Nacken! Scheppert anders diesmal 🔥'
  },
  {
    id: 'mock-4',
    name: 'Sarah (Sportskanone)',
    avatar: '⚡',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    selected_slots: ['we-1-sat', 'we-2-sat', 'we-3-sat', 'we-4-sat'],
    selected_locations: ['park', 'restaurant', 'bowling'],
    custom_location: '',
    message: 'Park und Grillen wäre peak Nostalgie! Bitte bringt alte Jahrbuch-Fotos mit haha 📸'
  }
];

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
const TABLE_NAME = 'klassentreffen_votes';

export function getSupabaseClient() {
  const { url, key, isConfigured } = getSupabaseCredentials();
  if (!isConfigured) return null;

  if (!supabaseInstance || supabaseInstance.supabaseUrl !== url) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: { persistSession: false }
      });
    } catch (e) {
      return null;
    }
  }
  return supabaseInstance;
}

export async function fetchAllVotes() {
  const client = getSupabaseClient();
  
  if (client) {
    try {
      // Try klassentreffen_votes first, fallback to votes
      let res = await client
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });

      if (res.error && res.error.code === '42P01') {
        // Table not found, try legacy votes table
        res = await client
          .from('votes')
          .select('*')
          .order('created_at', { ascending: false });
      }

      if (!res.error && res.data && res.data.length > 0) {
        return res.data;
      }
    } catch {}
  }

  // Local storage fallback
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
    localStorage.setItem('klassentreffen_local_votes', JSON.stringify(INITIAL_MOCK_VOTES));
    return INITIAL_MOCK_VOTES;
  }
  return INITIAL_MOCK_VOTES;
}

export async function submitVote(voteData) {
  const client = getSupabaseClient();
  const newVote = {
    ...voteData,
    created_at: new Date().toISOString()
  };

  let savedRemote = false;

  if (client) {
    try {
      let res = await client
        .from(TABLE_NAME)
        .insert([newVote])
        .select();

      if (res.error && res.error.code === '42P01') {
        res = await client
          .from('votes')
          .insert([newVote])
          .select();
      }

      if (!res.error && res.data && res.data.length > 0) {
        savedRemote = true;
        newVote.id = res.data[0].id;
      }
    } catch {}
  }

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

export function saveCustomSupabaseConfig(url, key) {
  if (typeof window !== 'undefined') {
    if (url && key) {
      localStorage.setItem('supabase_custom_url', url.trim());
      localStorage.setItem('supabase_custom_key', key.trim());
    } else {
      localStorage.removeItem('supabase_custom_url');
      localStorage.removeItem('supabase_custom_key');
    }
  }
  return true;
}
