import express, { Request, Response } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import OpenAI from 'openai';
import openai from '../config/openai';

const router = express.Router();

const ALLOWED_MIME_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/mp4',
  'audio/mpga',
  'audio/m4a',
  'audio/wav',
  'audio/webm'
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.warn('Unsupported audio format', file.mimetype);
      cb(new Error('Unsupported audio format'));
    }
  }
});

const limiter = rateLimit({ windowMs: 60 * 1000, max: 5 });

router.post(
  '/',
  limiter,
  (req, res, next) => {
    upload.single('audio')(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
      }

      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'Audio file is required' });
      }

      console.log('Audio file received', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      });

      const transcription = await openai.audio.transcriptions.create({
        file: await OpenAI.toFile(file.buffer, file.originalname),
        model: 'gpt-4o-mini-transcribe',
        response_format: 'json'
      });

      const segments = (transcription.segments || []).map((seg: any) => ({
        text: seg.text,
        confidence: seg.confidence
      }));

      const avgConfidence = segments.length
        ? segments.reduce((sum, s) => sum + (s.confidence || 0), 0) / segments.length
        : null;

      res.json({ text: transcription.text, confidence: avgConfidence, segments });
    } catch (error: any) {
      console.error('Transcription failed', error);
      res.status(500).json({ error: 'Transcription failed' });
    }
  }
);

export default router;
