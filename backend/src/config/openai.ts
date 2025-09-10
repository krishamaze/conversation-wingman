import OpenAI from 'openai';
import { OPENAI_API_KEY } from './env';

let openai: OpenAI;
try {
  openai = new OpenAI({ apiKey: OPENAI_API_KEY });
} catch (error) {
  console.error('Failed to initialize OpenAI client', error);
  throw error;
}

export default openai;
