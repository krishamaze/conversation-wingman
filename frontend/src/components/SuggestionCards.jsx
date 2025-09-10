import React from 'react';

export default function SuggestionCards({
  suggestions = [],
  loading = false,
  onCopy,
  topic,
  tone,
  onFilterChange,
}) {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    onCopy && onCopy(text);
  };

  const updateFilter = (key, value) => {
    onFilterChange && onFilterChange({ ...{ topic, tone }, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Topic"
          value={topic}
          onChange={(e) => updateFilter('topic', e.target.value)}
          className="border p-2 flex-1"
        />
        <input
          type="text"
          placeholder="Tone"
          value={tone}
          onChange={(e) => updateFilter('tone', e.target.value)}
          className="border p-2 flex-1"
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((s, idx) => (
            <div key={idx} className="p-4 border rounded-md flex flex-col">
              <p className="flex-1">{s.text}</p>
              <div className="h-2 bg-gray-200 my-2">
                <div
                  className="h-2 bg-blue-500"
                  style={{ width: `${(s.confidence || 0) * 100}%` }}
                />
              </div>
              <button
                onClick={() => handleCopy(s.text)}
                className="mt-2 px-2 py-1 text-sm bg-green-600 text-white rounded"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
