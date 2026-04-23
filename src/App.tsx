import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Github } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050508] text-white selection:bg-cyan-500 selection:text-white overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-900/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Scanned Lines / Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>

      <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-fuchsia-500 rounded-lg rotate-12 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <span className="text-xl font-black italic">N</span>
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter mix-blend-difference">NEON SYNTH SNAKE</h1>
            <p className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase">V 0.1 / Experimental</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-8">
            <a href="#" className="text-xs font-bold tracking-widest text-white/40 hover:text-white transition-colors italic">SESSIONS</a>
            <a href="#" className="text-xs font-bold tracking-widest text-white/40 hover:text-white transition-colors italic">COLONIES</a>
            <a href="#" className="text-xs font-bold tracking-widest text-white/40 hover:text-white transition-colors italic">TRANSMISSIONS</a>
          </div>
          <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all">
            <Github className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Information / Stats */}
        <div className="lg:col-span-3 flex flex-col gap-12">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-6xl font-black tracking-tighter leading-none italic">
              DEFY THE
            </h2>
            <div className="w-48 h-20 bg-gradient-to-r from-cyan-400 to-fuchsia-500 mt-2" />
            <p className="mt-6 text-white/60 font-medium leading-relaxed max-w-xs">
              Navigate the digital labyrinth. Consume packets to fuel the system. 
              Higher velocity equals higher precision.
            </p>
          </motion.div>

          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-6"
          >
            <div className="pt-6 border-t border-white/10">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">SYSTEM LOAD</p>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-cyan-500" 
                  initial={{ width: '0%' }}
                  animate={{ width: '64%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
            </div>
            <div className="pt-6 border-t border-white/10">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">NEURAL FEED</p>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 items-center opacity-40">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    <div className="h-2 bg-white/20 rounded-full flex-1" style={{ width: `${Math.random() * 60 + 40}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Center: Snake Game */}
        <div className="lg:col-span-6 flex justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          >
            <SnakeGame />
          </motion.div>
        </div>

        {/* Right Side: Music Player */}
        <div className="lg:col-span-3 flex flex-col items-center lg:items-end gap-12">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full"
          >
            <MusicPlayer />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="hidden lg:block text-right"
          >
            <div className="text-[80px] font-black text-white/5 italic leading-none whitespace-nowrap">
              VAPOR<br/>GRID
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-20 border-t border-white/5 bg-black/60 backdrop-blur-xl px-8 py-3 flex justify-between items-center text-[10px] font-bold text-white/40 tracking-widest uppercase">
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span>CORE STATUS: NOMINAL</span>
          </div>
          <div>ENCRYPTION: 128-SYNTH</div>
        </div>
        <div className="animate-pulse">LATENCY: 12MS</div>
      </footer>
    </div>
  );
}

