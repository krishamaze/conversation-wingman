import dotenv from 'dotenv';

dotenv.config();

const required = [
  'OPENAI_API_KEY',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'FRONTEND_ORIGIN'
] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
export const SUPABASE_URL = process.env.SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN!;
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
