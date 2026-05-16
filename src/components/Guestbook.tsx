import React, { useState, useRef } from 'react';
import { Language } from '../types';

interface GuestbookProps {
  language: Language;
}

interface Particle {
  id: number;
  text: string;
  x: number;
  y: number;
  rot: number;
}

const Guestbook: React.FC<GuestbookProps> = ({ language }) => {
  const [inputText, setInputText] = useState('');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [status, setStatus] = useState<string>('EVENT HORIZON');
  const particleIdCounter = useRef(0);

  const sendToBlackHole = () => {
    const text = inputText.trim();
    if (!text) return;

    // 1. Create Floating Particle Message
    const newId = particleIdCounter.current++;
    const randomX = 30 + Math.random() * 40; // 30% to 70%
    const randomY = 30 + Math.random() * 40; // 30% to 70%
    const randomRot = Math.random() * 360;

    const newParticle: Particle = {
      id: newId,
      text: text,
      x: randomX,
      y: randomY,
      rot: randomRot,
    };

    setParticles((prev) => [...prev, newParticle]);

    // Remove after animation (10s)
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newId));
    }, 10000);

    // 2. Clear Input
    setInputText('');

    // 3. UI Feedback
    const messages =
      language === 'cn'
        ? ['信息已捕获...', '正在跨越视界...', '已永久存入奇点']
        : ['Message Captured...', 'Crossing Horizon...', 'Stored in Singularity'];

    let i = 0;
    const timer = setInterval(() => {
      setStatus(messages[i]);
      i++;
      if (i >= messages.length) {
        clearInterval(timer);
        setTimeout(() => setStatus('EVENT HORIZON'), 3000);
      }
    }, 800);
  };

  return (
    <div className="h-full grayscale hover:grayscale-0 transition-all duration-500 animate-float-3 relative overflow-hidden flex items-center justify-center min-h-[400px] glass-card rounded-2xl border border-white/5">
      {/* Black Hole Visual */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Core */}
        <div className="w-[200px] md:w-[250px] h-[200px] md:h-[250px] rounded-full bg-black shadow-[0_0_50px_rgba(255,255,255,0.05),inset_0_0_80px_rgba(0,0,0,1)] z-10"></div>
        {/* Accretion Disks */}
        <div className="absolute w-[350px] md:w-[450px] h-[350px] md:h-[450px] rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.1),rgba(255,255,255,0.2),transparent)] black-hole-spin z-0 opacity-40 blur-xl"></div>
        <div
          className="absolute w-[300px] md:w-[400px] h-[300px] md:h-[400px] rounded-full bg-[conic-gradient(from_180deg,transparent,rgba(0,242,255,0.2),rgba(0,242,255,0.05),transparent)] black-hole-spin z-0 opacity-50 mix-blend-screen"
          style={{ animationDuration: '15s' }}
        ></div>
      </div>

      {/* Particle Container */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="message-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: `translate(-50%, -50%) rotate(${p.rot}deg)`,
            }}
          >
            {p.text}
          </div>
        ))}
      </div>

      <div className="relative z-20 w-full px-8 md:px-12 flex flex-col items-center">
        <div className="text-center mb-8 h-8">
          <h3 className="text-[var(--color-brand-cyan)] font-mono text-lg leading-none tracking-[0.2em] uppercase transition-all duration-300">
            {status}
          </h3>
        </div>

        <div className="w-full max-w-md relative group/input">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendToBlackHole();
            }}
            className="w-full bg-black/60 border border-white/10 rounded-full px-6 py-4 text-center text-xs font-mono text-[var(--color-brand-cyan)] placeholder-gray-600 outline-none focus:border-[var(--color-brand-cyan)]/50 focus:shadow-[0_0_20px_rgba(0,242,255,0.1)] transition-all backdrop-blur-md"
            placeholder={
              language === 'cn'
                ? '// 发送信号至奇点...'
                : '// Send signal to singularity...'
            }
            autoComplete="off"
          />
          <button
            onClick={sendToBlackHole}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Guestbook;
