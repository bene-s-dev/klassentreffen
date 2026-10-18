import { createClient } from '@supabase/supabase-js';

// Default production Supabase credentials (public anon client)
export const PROD_SUPABASE_URL = 'https://odsghowxbgqnfsyjstcb.supabase.co';
export const PROD_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kc2dob3d4YmdxbmZzeWpzdGNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4Njk1MTMsImV4cCI6MjA5NDQ0NTUxM30.-3ns3ckkDcBClXix43lek-TKehfv_THqYsqkvGUf1HU';

// No mock data - only real participant votes
export const INITIAL_MOCK_VOTES = [];

export function getSupabaseCredentials() {
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL;
  const envKey = typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY;
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('supabase_custom_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('supabase_custom_key') : null;

  const url = localUrl || envUrl || PROD_SUPABASE_URL;
  const key = localKey || envKey || PROD_SUPABASE_ANON_KEY;

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

      if (!res.error && Array.isArray(res.data)) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('klassentreffen_local_votes', JSON.stringify(res.data));
        }
        return res.data;
      }
    } catch {}
  }

  // Local storage fallback (real votes only)
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('klassentreffen_local_votes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const realVotes = parsed.filter(v => !String(v.id).startsWith('mock-'));
          localStorage.setItem('klassentreffen_local_votes', JSON.stringify(realVotes));
          return realVotes;
        }
      } catch {}
    }
    return [];
  }
  return [];
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
      // Lösche vorherige Stimme mit gleichem Namen um Dubletten zu vermeiden
      if (newVote.name) {
        await client
          .from(TABLE_NAME)
          .delete()
          .ilike('name', newVote.name);
      }

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

      if (res.error) {
        console.error('❌ Supabase Fehler beim Speichern der Stimme:', res.error);
      } else if (res.data && res.data.length > 0) {
        savedRemote = true;
        newVote.id = res.data[0].id;
        console.log('✅ Stimme erfolgreich in Supabase gespeichert! ID:', newVote.id);
      }
    } catch (err) {
      console.error('❌ Netzwerkfehler beim Supabase-Speichern:', err);
    }
  } else {
    console.warn('⚠️ Kein Supabase Client konfiguriert.');
  }

  if (typeof window !== 'undefined') {
    const current = await fetchAllVotes();
    const updated = [
      { ...newVote, id: newVote.id || 'local-' + Date.now() },
      ...current.filter(v => v.name.toLowerCase() !== newVote.name.toLowerCase() && !String(v.id).startsWith('mock-'))
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

export async function deleteVote(voteId, voterName) {
  const client = getSupabaseClient();
  if (client) {
    try {
      if (voteId && !String(voteId).startsWith('local-')) {
        await client.from(TABLE_NAME).delete().eq('id', voteId);
      }
      if (voterName) {
        await client.from(TABLE_NAME).delete().ilike('name', voterName);
      }
      console.log('✅ Stimme erfolgreich in Supabase gelöscht:', voterName || voteId);
    } catch (err) {
      console.error('❌ Fehler beim Löschen in Supabase:', err);
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem('klassentreffen_my_vote');
    const current = await fetchAllVotes();
    const updated = current.filter(v => v.name.toLowerCase() !== (voterName || '').toLowerCase() && !String(v.id).startsWith('mock-'));
    localStorage.setItem('klassentreffen_local_votes', JSON.stringify(updated));
  }

  return true;
}

