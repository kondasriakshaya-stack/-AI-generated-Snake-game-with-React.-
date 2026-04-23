import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { TRACKS } from '../constants';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
      setProgress(val);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl relative group">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="flex flex-col gap-6">
        {/* Track Info */}
        <div className="flex items-center gap-4">
          <motion.div
            key={currentTrack.id}
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className="relative"
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500 to-fuchsia-500 rounded-3xl blur-xl opacity-40 transition-opacity duration-1000 ${isPlaying ? 'animate-pulse' : ''}`} />
            <img
              src="https://picsum.photos/seed/clock/400/400"
              alt={currentTrack.title}
              className="w-24 h-24 rounded-3xl object-cover relative z-10 border border-white/10"
              referrerPolicy="no-referrer"
            />
            {isPlaying && (
              <div className="absolute -top-2 -right-2 z-20 bg-fuchsia-500 p-2 rounded-full shadow-lg border border-white/20">
                <Music className="w-3 h-3 text-white animate-bounce" />
              </div>
            )}
          </motion.div>

          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTrack.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-black text-white truncate tracking-tight uppercase italic underline decoration-cyan-500 decoration-4 underline-offset-4">
                  {currentTrack.title.length > 5 ? currentTrack.title.substring(0, 5) + '...' : currentTrack.title}
                </h3>
                <p className="text-white/40 font-bold text-sm tracking-widest mt-1">
                  {currentTrack.artist}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4">
          <div className="relative group/progress">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-400 overflow-hidden"
            />
            <div 
              className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full pointer-events-none transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 opacity-40">
              <Volume2 className="w-4 h-4 text-white" />
              <div className="w-12 h-1 bg-white/20 rounded-full">
                <div className="w-2/3 h-full bg-white rounded-full" />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={handlePrev}
                className="p-3 text-white/60 hover:text-white transition-colors hover:scale-110 active:scale-95"
              >
                <SkipBack className="w-6 h-6 fill-current" />
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 fill-current" />
                ) : (
                  <Play className="w-8 h-8 fill-current ml-1" />
                )}
              </button>

              <button
                onClick={handleNext}
                className="p-3 text-white/60 hover:text-white transition-colors hover:scale-110 active:scale-95"
              >
                <SkipForward className="w-6 h-6 fill-current" />
              </button>
            </div>

            <div className="w-10" /> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      {/* Decorative vertical text */}
      <div className="absolute top-1/2 -right-12 -translate-y-1/2 rotate-90 pointer-events-none opacity-10">
        <span className="text-4xl font-black text-white italic tracking-[0.5em] whitespace-nowrap">
          NEON SOUNDS
        </span>
      </div>
    </div>
  );
};

export default MusicPlayer;
