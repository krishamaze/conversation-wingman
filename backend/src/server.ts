import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { PORT, FRONTEND_ORIGIN } from './config/env';
import transcribeRouter from './routes/transcribe';
import suggestRouter from './routes/suggest';
import favoritesRouter from './routes/favorites';

const app = express();
app.set('trust proxy', true);

app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true
}));

app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

app.use(express.json());

app.use(morgan('combined'));

app.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'conversation-wingman',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/transcribe', transcribeRouter);
app.use('/api/suggest', suggestRouter);
app.use('/api/favorites', favoritesRouter);

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const shutdown = () => {
  server.close(() => {
    console.log('Server closed gracefully');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default app;
