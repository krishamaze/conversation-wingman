import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('Missing OpenAI API key');
}

let openai: OpenAI;
try {
  openai = new OpenAI({ apiKey });
} catch (error) {
  console.error('Failed to initialize OpenAI client', error);
  throw error;
}

export default openai;
