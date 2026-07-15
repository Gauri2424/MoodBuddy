import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Award, Zap, Timer } from 'lucide-react';

const COLORS = [
  { name: 'RED', hex: '#E57373', textClass: 'text-red-500' },
  { name: 'BLUE', hex: '#6C9BCF', textClass: 'text-blue-500' },
  { name: 'GREEN', hex: '#81C784', textClass: 'text-green-500' },
  { name: 'YELLOW', hex: '#FFD966', textClass: 'text-yellow-500' },
  { name: 'PURPLE', hex: '#A78BFA', textClass: 'text-purple-500' },
];

export default function ColorMatchRush() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('colormatch_highscore') || '0', 10);
  });
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targetColor, setTargetColor] = useState('');
  const [circles, setCircles] = useState([]);
  
  const audioCtxRef = useRef(null);
  const gameAreaRef = useRef(null);
  const spawnTimerRef = useRef(null);
  const gameTimerRef = useRef(null);
  const targetChangeTimerRef = useRef(null);

  // Initialize Web Audio synth for premium zero-file sound effects
  const playSound = (type) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'levelup') {
        osc.frequency.setValueAtTime(261.63, ctx.currentTime); // C4
        osc.frequency.setValueAtTime(329.63, ctx.currentTime + 0.08); // E4
        osc.frequency.setValueAtTime(392.00, ctx.currentTime + 0.16); // G4
        osc.frequency.exponentialRampToValueAtTime(523.25, ctx.currentTime + 0.3); // C5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      console.warn('Audio Context block:', e);
    }
  };

  // Start the game loop
  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setTimeLeft(30);
    setCircles([]);
    
    // Choose initial target color
    const initialTarget = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTargetColor(initialTarget.name);

    // Play starting sound
    playSound('levelup');
  };

  // End the game
  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    setCircles([]);
    clearInterval(spawnTimerRef.current);
    clearInterval(gameTimerRef.current);
    clearInterval(targetChangeTimerRef.current);

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('colormatch_highscore', score.toString());
      playSound('levelup');
    } else {
      playSound('error');
    }
  };

  // Handle spawn and timers
  useEffect(() => {
    if (isPlaying) {
      // 1. General Game Countdown Timer (30s)
      gameTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 2. Change Target Color instruction dynamically (every 5 seconds)
      targetChangeTimerRef.current = setInterval(() => {
        setTargetColor((prev) => {
          const filtered = COLORS.filter(c => c.name !== prev);
          return filtered[Math.floor(Math.random() * filtered.length)].name;
        });
      }, 5000);

      return () => {
        clearInterval(gameTimerRef.current);
        clearInterval(targetChangeTimerRef.current);
      };
    }
  }, [isPlaying]);

  // Handle Spawning circles dynamically based on Level
  useEffect(() => {
    if (isPlaying) {
      const spawnInterval = Math.max(1200 - level * 100, 400); // gets faster
      
      spawnTimerRef.current = setInterval(() => {
        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        const size = Math.max(80 - level * 4, 40); // circles get smaller as level climbs
        
        // Random placement inside the game area container (10% to 90% boundary)
        const x = Math.floor(Math.random() * 80) + 10;
        const y = Math.floor(Math.random() * 70) + 10;
        
        const newCircle = {
          id: Date.now() + Math.random(),
          x,
          y,
          size,
          color: randomColor.name,
          hex: randomColor.hex,
        };

        setCircles((prev) => [...prev, newCircle]);

        // Auto remove circles after a duration
        const lifespan = Math.max(2500 - level * 200, 1000);
        setTimeout(() => {
          setCircles((prev) => prev.filter(c => c.id !== newCircle.id));
        }, lifespan);

      }, spawnInterval);

      return () => clearInterval(spawnTimerRef.current);
    }
  }, [isPlaying, level]);

  // Handle Tapping circles
  const handleCircleTap = (circle, e) => {
    e.stopPropagation(); // Stop background tap trigger
    
    if (circle.color === targetColor) {
      playSound('success');
      setScore((prev) => {
        const nextScore = prev + 10;
        
        // Level up every 60 points
        if (nextScore > 0 && nextScore % 60 === 0) {
          setLevel(l => {
            playSound('levelup');
            return l + 1;
          });
        }
        return nextScore;
      });
    } else {
      playSound('error');
      setScore((prev) => Math.max(prev - 5, 0));
    }
    
    // Remove tapped circle from the board
    setCircles((prev) => prev.filter(c => c.id !== circle.id));
  };

  const handleMissTap = () => {
    if (!isPlaying) return;
    playSound('error');
    setScore((prev) => Math.max(prev - 3, 0));
  };

  const targetHex = COLORS.find(c => c.name === targetColor)?.hex || '#000000';

  return (
    <div class="clay-card p-6 bg-white/70 max-w-xl mx-auto border-white/60 select-none">
      <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div class="flex items-center gap-1.5">
          <Zap class="w-5 h-5 text-violet-500 fill-violet-400" />
          <h2 class="text-xl font-extrabold text-slate-800 font-display">Color Match Rush</h2>
        </div>
        <div class="flex items-center gap-1 bg-violet-100 px-3 py-1 rounded-full text-xs font-bold text-violet-600">
          <Award class="w-3.5 h-3.5" /> High Score: {highScore}
        </div>
      </div>

      {!isPlaying && !gameOver ? (
        // Start Screen
        <div class="text-center py-12">
          <div class="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-6 shadow-clay-sm animate-bounce">
            <Zap class="w-10 h-10 text-violet-600 fill-violet-400" />
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-2">Are you ready to rush?</h3>
          <p class="text-sm text-slate-500 mb-8 max-w-xs mx-auto">
            Instruction colors change dynamically! Tap the matching color circles as they spawn. Don't tap the wrong colors!
          </p>
          <button
            onClick={startGame}
            class="flex items-center gap-2 px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl mx-auto transition-transform hover:scale-105 shadow-lg shadow-violet-200"
          >
            <Play class="w-5 h-5 fill-white" /> Start Game
          </button>
        </div>
      ) : gameOver ? (
        // Game Over Screen
        <div class="text-center py-12 animate-scale-up">
          <span class="text-6xl mb-4 block">🏆</span>
          <h3 class="text-2xl font-extrabold text-slate-800 mb-2">Game Over!</h3>
          <p class="text-slate-500 text-sm mb-4">You did an amazing job matching colors.</p>
          
          <div class="bg-slate-50 border border-slate-100 rounded-3xl p-6 max-w-xs mx-auto mb-8">
            <div class="text-sm font-semibold text-slate-400">Final Score</div>
            <div class="text-4xl font-black text-violet-600 mt-1">{score}</div>
            
            {score >= highScore && score > 0 && (
              <div class="text-xs text-emerald-600 font-bold mt-2 flex items-center justify-center gap-1">
                🔥 New Personal Record!
              </div>
            )}

            <div class="h-[1px] bg-slate-200/50 my-3"></div>
            <div class="text-xs text-slate-500">Reached Level: <span class="font-bold">{level}</span></div>
          </div>

          <button
            onClick={startGame}
            class="flex items-center gap-2 px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl mx-auto transition-transform hover:scale-105 shadow-lg"
          >
            <RotateCcw class="w-5 h-5" /> Play Again
          </button>
        </div>
      ) : (
        // Active Game Screen
        <div class="animate-fade-in">
          {/* Game Stats HUD */}
          <div class="grid grid-cols-3 gap-3 mb-4 text-center">
            <div class="bg-slate-50 py-2.5 rounded-2xl border border-slate-100/50">
              <div class="text-[10px] font-bold text-slate-400 uppercase">Score</div>
              <div class="text-lg font-black text-slate-800">{score}</div>
            </div>
            
            <div class="bg-slate-50 py-2.5 rounded-2xl border border-slate-100/50 flex flex-col items-center justify-center">
              <div class="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-0.5"><Timer class="w-3 h-3" /> Time</div>
              <div class={`text-lg font-black ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-slate-800'}`}>{timeLeft}s</div>
            </div>

            <div class="bg-slate-50 py-2.5 rounded-2xl border border-slate-100/50">
              <div class="text-[10px] font-bold text-slate-400 uppercase">Level</div>
              <div class="text-lg font-black text-violet-600">{level}</div>
            </div>
          </div>

          {/* Action Directive Banner */}
          <div class="bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-center mb-4 transition-all duration-300">
            <span class="text-sm font-bold text-slate-500">INSTRUCTION: </span>
            <span
              class="font-black text-lg tracking-wider transition-colors duration-300"
              style={{ color: targetHex }}
            >
              TAP {targetColor} CIRCLES!
            </span>
          </div>

          {/* Canvas Gameplay Board */}
          <div
            ref={gameAreaRef}
            onClick={handleMissTap}
            class="relative w-full h-[320px] rounded-3xl bg-slate-900 border border-slate-950 overflow-hidden shadow-inner cursor-pointer"
          >
            {circles.map((circle) => (
              <button
                key={circle.id}
                onClick={(e) => handleCircleTap(circle, e)}
                style={{
                  position: 'absolute',
                  left: `${circle.x}%`,
                  top: `${circle.y}%`,
                  width: `${circle.size}px`,
                  height: `${circle.size}px`,
                  backgroundColor: circle.hex,
                  transform: 'translate(-50%, -50%)',
                }}
                class="rounded-full shadow-lg border-2 border-white/40 active:scale-90 transition-transform duration-100 hover:brightness-110 flex items-center justify-center cursor-pointer animate-scale-up"
              >
                {/* Dot inner core for neat aesthetic */}
                <div class="w-1/4 h-1/4 rounded-full bg-white/60"></div>
              </button>
            ))}

            {circles.length === 0 && (
              <div class="absolute inset-0 flex items-center justify-center text-slate-600 text-xs italic pointer-events-none">
                Get ready...
              </div>
            )}
          </div>
          <p class="text-center text-[10px] text-slate-400 mt-2">
            Tip: Tapping the dark background or the wrong color subtracts points!
          </p>
        </div>
      )}
    </div>
  );
}
