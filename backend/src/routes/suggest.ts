import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import openai from '../config/openai';

const router = express.Router();

const limiter = rateLimit({ windowMs: 60 * 1000, max: 10 });

interface SuggestBody {
  context: string;
  topics?: string[];
  tone?: string;
}

router.post('/', limiter, async (req: Request<unknown, unknown, SuggestBody>, res: Response) => {
  try {
    const { context, topics = [], tone } = req.body;
    if (!context || typeof context !== 'string') {
      return res.status(400).json({ error: 'Context is required' });
    }

    const instructions = [
      'You are a helpful conversation assistant.',
      topics.length ? `Focus on topics: ${topics.join(', ')}.` : '',
      tone ? `Respond in a ${tone} tone.` : ''
    ].filter(Boolean).join(' ');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      n: 3,
      messages: [
        { role: 'system', content: instructions },
        { role: 'user', content: context }
      ],
      logprobs: true
    });

    const suggestions = response.choices.map(choice => {
      const text = choice.message?.content?.trim() || '';
      const probs = (choice.logprobs?.content || []).map(p => p.logprob);
      const confidence = probs.length
        ? Math.exp(probs.reduce((a, b) => a + b, 0) / probs.length)
        : null;
      return { text, confidence };
    }).filter(s => s.text);

    if (suggestions.length !== 3) {
      return res.status(500).json({ error: 'Failed to generate suggestions' });
    }

    res.json({ suggestions });
  } catch (error: any) {
    console.error('Suggestion failed', error);
    res.status(500).json({ error: 'Suggestion generation failed' });
  }
});

export default router;
