import React, { useState, useRef, useCallback } from 'react';
import { transcribeAudio } from '../services/geminiService';
import { Language } from '../types';

interface AudioTranscriberProps {
  language: Language;
}

const AudioTranscriber: React.FC<AudioTranscriberProps> = ({ language }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
      setTranscription(null);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError(language === 'cn' ? "无法访问麦克风" : "Microphone access denied");
    }
  }, [language]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const result = await transcribeAudio(base64Data, blob.type);
        setTranscription(result);
        setIsProcessing(false);
      };
    } catch (err) {
      console.error("Processing failed", err);
      setError(language === 'cn' ? "处理失败，请重试" : "Processing failed, try again");
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-card h-full p-8 rounded-xl flex flex-col justify-between group border-brand-cyan/20">
      <div className="flex justify-between items-start mb-4">
         <div className="p-2 rounded-full bg-brand-cyan/10 text-brand-cyan animate-pulse-glow">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
        </div>
        <span className="text-[10px] font-mono text-brand-cyan/80 uppercase tracking-widest">AI / VOICE</span>
      </div>

      <div className="flex-grow flex flex-col justify-center items-center gap-4">
        {transcription ? (
          <div className="w-full h-32 overflow-y-auto p-3 bg-black/40 rounded border border-white/5 text-sm font-mono text-gray-300">
            {transcription}
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-white font-mono text-lg mb-2">
              {language === 'cn' ? "语音转写" : "Voice Transcribe"}
            </h3>
            <p className="text-gray-500 text-xs">
              {language === 'cn' ? "Gemini 3 Flash 驱动" : "Powered by Gemini 3 Flash"}
            </p>
          </div>
        )}
        
        {error && (
            <p className="text-red-400 text-xs">{error}</p>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`w-full py-3 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2
            ${isRecording 
              ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' 
              : 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30 hover:bg-brand-cyan/20 hover:shadow-[0_0_15px_rgba(0,242,255,0.2)]'
            }
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isProcessing ? (
            <>
              <span className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce"></span>
              {language === 'cn' ? "处理中..." : "Processing..."}
            </>
          ) : isRecording ? (
            <>
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              {language === 'cn' ? "停止录音" : "Stop Recording"}
            </>
          ) : (
             language === 'cn' ? "点击说话" : "Click to Speak"
          )}
        </button>
      </div>
    </div>
  );
};

export default AudioTranscriber;