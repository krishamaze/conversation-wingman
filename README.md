# conversation-wingman
AI-powered conversation assistant providing real-time chat suggestions.

## Frontend Development
The frontend uses React 18 with Vite 4 and Tailwind CSS.

```bash
cd frontend
npm install
npm run dev
```

## Backend Development
The backend uses Node.js 20 with Express and TypeScript.

```bash
cd backend
npm install
npm run dev
```

Set the following environment variables:

- `PORT` (optional)
- `FRONTEND_ORIGIN`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`

### API Endpoints

- `POST /api/transcribe` – upload an audio file and receive transcribed text with confidence scores.
- `POST /api/suggest` – send conversation context and receive three response suggestions.
- `GET /api/favorites` – list saved phrases with pagination and search.
- `POST /api/favorites` – save a new phrase.
- `DELETE /api/favorites/:id` – remove a saved phrase.

For production:

```bash
npm run build
npm start
```

## Implemented Components
- `AudioRecorder` – captures microphone input with visual feedback.
- `SuggestionCards` – displays AI-generated suggestions with confidence bars and copy-to-clipboard.
- `ConversationInterface` – main workspace integrating recording, transcription, and suggestions.

## Frontend API Service
Located at `frontend/src/services/api.js`, this client manages requests, tokens, and retries for all backend endpoints.
