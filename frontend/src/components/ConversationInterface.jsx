import React, { useState } from 'react';
import AudioRecorder from './AudioRecorder';
import SuggestionCards from './SuggestionCards';
import {
  transcribeAudio,
  suggestResponses,
} from '../services/api';

export default function ConversationInterface() {
  const [transcript, setTranscript] = useState('');
  const [context, setContext] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  const handleAudio = async (blob) => {
    try {
      setLoading(true);
      const { text } = await transcribeAudio(blob);
      setTranscript(text);
      setLoading(false);
    } catch (e) {
      setError('Transcription failed');
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const result = await suggestResponses({ transcript, context, topic, tone });
      setSuggestions(result.suggestions || []);
      setHistory([...history, { transcript, suggestions: result.suggestions || [] }]);
      setLoading(false);
    } catch (e) {
      setError('Suggestion fetch failed');
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    setTopic(filters.topic);
    setTone(filters.tone);
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <AudioRecorder onRecordingComplete={handleAudio} />
      <div>
        <p className="font-semibold">Transcript</p>
        <div className="min-h-[3rem] p-2 border rounded">{transcript}</div>
      </div>
      <textarea
        value={context}
        onChange={(e) => setContext(e.target.value)}
        placeholder="Additional context"
        className="w-full border p-2 rounded"
      />
      <button
        onClick={fetchSuggestions}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Get Suggestions
      </button>
      <SuggestionCards
        suggestions={suggestions}
        loading={loading}
        topic={topic}
        tone={tone}
        onFilterChange={handleFilterChange}
      />
      {history.length > 0 && (
        <div>
          <p className="font-semibold mt-4">Session History</p>
          <ul className="space-y-2">
            {history.map((h, i) => (
              <li key={i} className="border p-2 rounded">
                <p className="font-medium">{h.transcript}</p>
                <ul className="list-disc ml-4">
                  {h.suggestions.map((s, j) => (
                    <li key={j}>{s.text}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
