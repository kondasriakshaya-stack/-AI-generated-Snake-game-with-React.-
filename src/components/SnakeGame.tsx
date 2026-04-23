import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCcw, Play, Pause } from 'lucide-react';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';
import { GameState } from '../types';

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 5, y: 5 },
    direction: 'RIGHT',
    score: 0,
    isGameOver: false,
    isPaused: false,
  });
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback((snake: { x: number; y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const hitSnake = snake.some(s => s.x === newFood.x && s.y === newFood.y);
      if (!hitSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setState({
      snake: [{ x: 10, y: 10 }],
      food: generateFood([{ x: 10, y: 10 }]),
      direction: 'RIGHT',
      score: 0,
      isGameOver: false,
      isPaused: false,
    });
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (state.direction !== 'DOWN') setState(s => ({ ...s, direction: 'UP' }));
          break;
        case 'ArrowDown':
          if (state.direction !== 'UP') setState(s => ({ ...s, direction: 'DOWN' }));
          break;
        case 'ArrowLeft':
          if (state.direction !== 'RIGHT') setState(s => ({ ...s, direction: 'LEFT' }));
          break;
        case 'ArrowRight':
          if (state.direction !== 'LEFT') setState(s => ({ ...s, direction: 'RIGHT' }));
          break;
        case ' ':
          setState(s => ({ ...s, isPaused: !s.isPaused }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state.direction]);

  useEffect(() => {
    if (state.isGameOver || state.isPaused) return;

    const moveSnake = () => {
      setState(prev => {
        const head = { ...prev.snake[0] };

        switch (prev.direction) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          if (prev.score > highScore) setHighScore(prev.score);
          return { ...prev, isGameOver: true };
        }

        // Self collision
        if (prev.snake.some(s => s.x === head.x && s.y === head.y)) {
          if (prev.score > highScore) setHighScore(prev.score);
          return { ...prev, isGameOver: true };
        }

        const newSnake = [head, ...prev.snake];

        // Food collision
        if (head.x === prev.food.x && head.y === prev.food.y) {
          return {
            ...prev,
            snake: newSnake,
            food: generateFood(newSnake),
            score: prev.score + 10,
          };
        }

        newSnake.pop();
        return { ...prev, snake: newSnake };
      });
    };

    const speed = Math.max(MIN_SPEED, INITIAL_SPEED - state.score * SPEED_INCREMENT);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [state.isGameOver, state.isPaused, state.score, highScore, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines (subtle)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    state.snake.forEach((segment, index) => {
      const gradient = ctx.createLinearGradient(
        segment.x * cellSize,
        segment.y * cellSize,
        (segment.x + 1) * cellSize,
        (segment.y + 1) * cellSize
      );
      
      if (index === 0) {
        gradient.addColorStop(0, '#00ffff');
        gradient.addColorStop(1, '#00cccc');
      } else {
        gradient.addColorStop(0, '#ff00ff');
        gradient.addColorStop(1, '#cc00cc');
      }

      ctx.fillStyle = gradient;
      ctx.shadowBlur = 10;
      ctx.shadowColor = index === 0 ? '#00ffff' : '#ff00ff';
      
      // Rounded snake segments
      const x = segment.x * cellSize + 2;
      const y = segment.y * cellSize + 2;
      const size = cellSize - 4;
      const radius = 4;
      
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + size, y, x + size, y + size, radius);
      ctx.arcTo(x + size, y + size, x, y + size, radius);
      ctx.arcTo(x, y + size, x, y, radius);
      ctx.arcTo(x, y, x + size, y, radius);
      ctx.closePath();
      ctx.fill();
    });

    // Draw food
    ctx.fillStyle = '#facc15';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#facc15';
    const fx = state.food.x * cellSize + cellSize / 2;
    const fy = state.food.y * cellSize + cellSize / 2;
    
    ctx.beginPath();
    ctx.arc(fx, fy, (cellSize / 2) - 4, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [state.snake, state.food]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative group">
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-cyan-500/30 transition-colors duration-500" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-fuchsia-500/30 transition-colors duration-500" />

      <div className="w-full flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
            <Trophy className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Best Score</p>
            <p className="text-2xl font-black text-white">{highScore}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Current Score</p>
          <div className="w-32 h-10 bg-gradient-to-r from-cyan-400 to-fuchsia-500 mt-1" />
        </div>
      </div>

      <div className="relative group/canvas">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-2xl border border-white/10 shadow-2xl transition-transform duration-500 group-hover/canvas:scale-[1.01]"
        />
        
        <AnimatePresence>
          {(state.isGameOver || state.isPaused) && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4 rounded-2xl z-20"
            >
              {state.isGameOver ? (
                <>
                  <h2 className="text-5xl font-black text-white italic tracking-tighter mix-blend-difference">GAME OVER</h2>
                  <button
                    onClick={resetGame}
                    className="flex flex-col items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform active:scale-95"
                  >
                    <div className="flex items-center gap-2">
                       <RefreshCcw className="w-5 h-5" />
                       RETRY
                    </div>
                  </button>
                  <p className="text-sm font-bold text-cyan-400 mt-2 lowercase">snake game</p>
                </>
              ) : (
                <>
                  <h2 className="text-5xl font-black text-white italic tracking-tighter">PAUSED</h2>
                  <button
                    onClick={() => setState(s => ({ ...s, isPaused: false }))}
                    className="flex items-center gap-2 px-8 py-4 bg-cyan-500 text-white rounded-full font-bold hover:scale-105 transition-transform active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    RESUME
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 z-10">
        <button
          onClick={() => setState(s => ({ ...s, isPaused: !s.isPaused }))}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10 group/btn"
        >
          {state.isPaused ? (
            <Play className="w-6 h-6 text-white group-hover/btn:scale-110 transition-transform" />
          ) : (
            <Pause className="w-6 h-6 text-white group-hover/btn:scale-110 transition-transform" />
          )}
        </button>
        <button
          onClick={resetGame}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10 group/btn"
        >
          <RefreshCcw className="w-6 h-6 text-white group-hover/btn:scale-110 transition-transform" />
        </button>
      </div>

      <p className="text-[10px] text-white/20 font-medium uppercase tracking-[0.2em] italic">
        Use arrow keys to move • Space to pause
      </p>
    </div>
  );
};

export default SnakeGame;
