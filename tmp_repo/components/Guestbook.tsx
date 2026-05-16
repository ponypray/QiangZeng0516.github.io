import React, { useState, useEffect, useRef } from 'react';
import { transcribeAudio } from '../services/geminiService';
import { Language } from '../types';

interface GuestbookProps {
  language: Language;
}

interface Message {
  id: string;
  text: string;
  date: number;
  type: 'text' | 'voice';
}

const Guestbook: React.FC<GuestbookProps> = ({ language }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [adminPass, setAdminPass] = useState('');

  // New Simulation States
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Load messages from local storage
  useEffect(() => {
    const saved = localStorage.getItem('guestbook_messages');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load messages", e);
      }
    }
    
    // Check if previously logged in as admin (session based)
    const adminSession = sessionStorage.getItem('admin_logged_in');
    if (adminSession === 'true') setIsAdmin(true);
  }, []);

  // Save messages to local storage
  useEffect(() => {
    localStorage.setItem('guestbook_messages', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Start Simulation
    setIsCompiling(true);
    setCompileProgress(0);

    const duration = 1500; // 1.5s simulation
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
        currentStep++;
        const progress = Math.min((currentStep / steps) * 100, 100);
        setCompileProgress(progress);

        if (currentStep >= steps) {
            clearInterval(timer);
            finalizeMessage();
        }
    }, interval);
  };

  const finalizeMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      date: Date.now(),
      type: 'text' 
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsCompiling(false);
    
    // Show success toast
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm(language === 'cn' ? '确定删除这条留言吗？' : 'Delete this message?')) {
      setMessages(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleAdminLogin = () => {
    if (adminPass === 'admin') { // Simple simulation password
      setIsAdmin(true);
      setShowLogin(false);
      setAdminPass('');
      sessionStorage.setItem('admin_logged_in', 'true');
    } else {
      alert(language === 'cn' ? '密码错误' : 'Wrong password');
    }
  };

  // --- Voice Logic ---

  const startRecording = async () => {
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
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert(language === 'cn' ? "无法访问麦克风" : "Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const result = await transcribeAudio(base64Data, blob.type);
        setInputText(prev => (prev ? prev + ' ' + result : result));
        setIsProcessing(false);
      };
    } catch (err) {
      console.error("Processing failed", err);
      setIsProcessing(false);
      alert(language === 'cn' ? "语音识别失败" : "Transcription failed");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(language === 'cn' ? 'zh-CN' : 'en-US', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper to count lines for editor look
  const lineCount = inputText.split('\n').length;
  const lines = Array.from({ length: Math.max(lineCount, 3) }, (_, i) => i + 1);

  return (
    <div className="glass-card h-full rounded-xl flex flex-col group border-brand-cyan/20 overflow-hidden relative">
      {/* Success Toast */}
      {showSuccess && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-brand-cyan/10 border border-brand-cyan text-brand-cyan px-4 py-2 rounded-full text-xs font-mono flex items-center gap-2 animate-in fade-in slide-in-from-top-4 shadow-[0_0_20px_rgba(0,242,255,0.2)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            {language === 'cn' ? '留言已加密 存入星系' : 'Message encrypted and stored in galaxy'}
        </div>
      )}

      {/* Header */}
      <div className="p-6 pb-2 flex justify-between items-start z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
           <div className="p-2 rounded-full bg-brand-cyan/10 text-brand-cyan animate-pulse-glow">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          </div>
          <div>
            <h3 className="text-white font-mono text-lg leading-none">{language === 'cn' ? "AI 留言板" : "Guestbook"}</h3>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              {language === 'cn' ? "想到什么，写点什么吧" : "Share your thoughts..."}
            </span>
          </div>
        </div>
        
        {/* Admin Toggle */}
        <button 
            onClick={() => isAdmin ? setIsAdmin(false) : setShowLogin(!showLogin)}
            className={`text-gray-600 hover:text-brand-cyan transition-colors ${isAdmin ? 'text-brand-cyan' : ''}`}
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </button>
      </div>

      {/* Admin Login Overlay */}
      {showLogin && !isAdmin && (
        <div className="absolute top-16 right-4 z-50 bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl flex gap-2 animate-in fade-in slide-in-from-top-2">
            <input 
                type="password" 
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="Password"
                className="bg-black/50 border border-gray-700 rounded px-2 py-1 text-xs text-white outline-none focus:border-brand-cyan w-24"
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            <button onClick={handleAdminLogin} className="text-brand-cyan text-xs font-bold px-2 hover:bg-white/10 rounded">GO</button>
        </div>
      )}

      {/* Messages List */}
      <div className="flex-grow overflow-y-auto px-6 py-2 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                <svg className="w-10 h-10 mb-2 text-brand-cyan/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <p className="text-xs font-mono">{language === 'cn' ? "暂无留言，快来发布第一条！" : "No messages yet. Say hi!"}</p>
            </div>
        ) : (
            messages.map((msg) => (
                <div key={msg.id} className="relative group/msg">
                    <div className="bg-white/5 border border-white/5 rounded-lg p-3 hover:border-brand-cyan/20 transition-colors">
                        <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-mono">{msg.text}</p>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-[9px] text-gray-600 font-mono">{formatDate(msg.date)}</span>
                            {isAdmin && (
                                <button 
                                    onClick={() => handleDelete(msg.id)}
                                    className="text-red-500/50 hover:text-red-500 text-[10px] opacity-0 group-hover/msg:opacity-100 transition-opacity"
                                >
                                    {language === 'cn' ? "删除" : "DELETE"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Code Editor Style */}
      <div className="p-4 bg-[#0a0a0a] border-t border-white/5 relative">
        {/* Processing Overlay */}
        {isCompiling && (
            <div className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
                <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-brand-cyan transition-all duration-75 ease-linear" style={{ width: `${compileProgress}%` }}></div>
                </div>
                <p className="text-[10px] font-mono text-brand-cyan animate-pulse">
                    AI PROCESSING... {Math.round(compileProgress)}%
                </p>
            </div>
        )}

        <div className="relative flex border border-gray-800 rounded-md bg-[#050505] overflow-hidden focus-within:border-brand-cyan/50 transition-colors">
            {/* Line Numbers */}
            <div className="w-8 bg-[#111] border-r border-gray-800 pt-3 flex flex-col items-center gap-[2px]">
                {lines.map(n => (
                    <span key={n} className="text-[10px] font-mono text-gray-600 h-5 leading-5">{n}</span>
                ))}
            </div>

            {/* Editor Area */}
            <div className="flex-grow relative">
                <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder={
                        isProcessing 
                        ? (language === 'cn' ? "// 正在识别语音..." : "// Transcribing audio...") 
                        : (language === 'cn' ? "// 在此输入代码或留言..." : "// Type code or message here...")
                    }
                    className="w-full h-full bg-transparent border-none outline-none text-xs md:text-sm font-mono text-green-400 placeholder-gray-600 p-3 leading-5 resize-none min-h-[80px]"
                    disabled={isProcessing || isCompiling}
                />
                
                {/* Voice Button absolute inside editor */}
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing || isCompiling}
                    className={`absolute right-2 top-2 p-1.5 rounded hover:bg-white/5 transition-all
                        ${isRecording 
                            ? 'text-red-500 animate-pulse' 
                            : 'text-gray-500 hover:text-brand-cyan'
                        }
                    `}
                    title={language === 'cn' ? "语音输入" : "Voice Input"}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isRecording ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        )}
                    </svg>
                </button>

                {/* Send Button absolute bottom right */}
                <button 
                    onClick={handleSend}
                    disabled={!inputText.trim() || isProcessing || isCompiling}
                    className={`absolute right-2 bottom-2 px-3 py-1 rounded text-[10px] font-mono font-bold tracking-wider transition-all
                        ${inputText.trim() 
                            ? 'bg-brand-cyan text-black hover:bg-white hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]' 
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        }
                    `}
                >
                    RUN_SCRIPT
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Guestbook;