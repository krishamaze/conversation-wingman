import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Missing Supabase environment variables');
}

let supabase: SupabaseClient;
try {
  supabase = createClient(url, anonKey);
} catch (error) {
  console.error('Failed to initialize Supabase client', error);
  throw error;
}

export default supabase;
