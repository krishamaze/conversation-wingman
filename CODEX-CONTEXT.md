# Conversation Wingman - AI Context File

## Project Overview
Real-time conversation assistant that listens to voice, transcribes with Whisper, and suggests natural responses using ChatGPT.

## Core Features
- 🎤 Live audio transcription (OpenAI Whisper)
- 🧠 Context-aware response suggestions (ChatGPT)
- 💾 Save favorite phrases (Supabase)
- 🎯 Topic-based suggestions
- 📱 Floating widget UI (React)

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js/Express (API endpoints)
- **Database**: Supabase (PostgreSQL + Auth)
- **AI**: OpenAI Whisper API + ChatGPT API
- **Deployment**: Vercel (frontend) + Railway (backend)

## Folder Structure
conversation-wingman/
├── frontend/ # React app
├── backend/ # Node.js API
├── docs/ # Documentation
└── CODEX-CONTEXT.md # This file


## API Endpoints Needed
- `POST /api/transcribe` - Audio to text
- `POST /api/suggest` - Generate 3 suggestions
- `GET/POST /api/favorites` - CRUD for saved phrases

## UI Components Needed
- FloatingWidget (main container)
- SuggestionList (shows 3 options)
- AudioRecorder (microphone input)
- SavedPhrases (favorites management)

## Environment Variables
- OPENAI_API_KEY
- SUPABASE_URL
- SUPABASE_ANON_KEY

## Development Notes for AI Assistant
- Keep components small and focused
- Use modern React hooks (useState, useEffect, useCallback)
- Implement debouncing for audio transcription
- Add error handling for API calls
- Make UI responsive and accessible

## Next Implementation Steps
1. ✅ Create repo and context
2. ⏳ Initialize React frontend
3. ⏳ Set up basic API structure
4. ⏳ Implement audio recording
5. ⏳ Add OpenAI integration
