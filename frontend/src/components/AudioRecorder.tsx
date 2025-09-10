import React, { useEffect, useRef, useState } from 'react';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
}

export default function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const analyser = useRef<AnalyserNode | null>(null);
  const animation = useRef<number>();

  useEffect(() => {
    return () => {
      if (animation.current) cancelAnimationFrame(animation.current);
      analyser.current?.disconnect();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      analyser.current = context.createAnalyser();
      analyser.current.fftSize = 256;
      source.connect(analyser.current);

      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        chunks.current = [];
        onRecordingComplete(blob);
      };
      mediaRecorder.current.start();
      setIsRecording(true);
      visualize();
    } catch (err) {
      setError('Microphone access denied');
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  };

  const visualize = () => {
    if (!analyser.current) return;
    const buffer = new Uint8Array(analyser.current.frequencyBinCount);
    const update = () => {
      analyser.current?.getByteTimeDomainData(buffer);
      const max = buffer.reduce((p, c) => Math.max(p, c), 0);
      setVolume((max - 128) / 128);
      animation.current = requestAnimationFrame(update);
    };
    update();
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 border rounded-md">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="h-4 bg-gray-200 mb-4">
        <div
          className="h-4 bg-green-500 transition-all"
          style={{ width: `${Math.min(1, Math.max(0, volume)) * 100}%` }}
        />
      </div>
      <div className="flex justify-center space-x-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Start
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}
