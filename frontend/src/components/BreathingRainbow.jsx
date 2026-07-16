import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';

const STAGES = [
  { name: 'Breathe In', duration: 4, text: 'Fill your lungs slowly...', sizeClass: 'scale-150', color: 'from-pink-300 via-purple-300 to-blue-300' },
  { name: 'Hold', duration: 4, text: 'Keep the air inside gently...', sizeClass: 'scale-150 shadow-[0_0_50px_rgba(167,139,250,0.4)]', color: 'from-blue-300 via-green-300 to-yellow-300' },
  { name: 'Breathe Out', duration: 4, text: 'Release the breath completely...', sizeClass: 'scale-100', color: 'from-yellow-300 via-orange-300 to-red-300' },
  { name: 'Hold', duration: 4, text: 'Rest before the next breath...', sizeClass: 'scale-100', color: 'from-red-300 via-pink-300 to-purple-300' }
];

export default function BreathingRainbow() {
  const [isActive, setIsActive] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(STAGES[0].duration);
  const [totalCycles, setTotalCycles] = useState(0);

  useEffect(() => {
    let timer = null;

    if (isActive) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Transition to next stage
            const nextIndex = (stageIndex + 1) % STAGES.length;
            setStageIndex(nextIndex);
            
            // Increment cycles when completing a full round
            if (nextIndex === 0) {
              setTotalCycles((prevCycle) => prevCycle + 1);
            }
            
            return STAGES[nextIndex].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isActive, stageIndex]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setStageIndex(0);
    setSecondsRemaining(STAGES[0].duration);
    setTotalCycles(0);
  };

  const currentStage = STAGES[stageIndex];

  return (
    <div class="clay-card p-8 bg-white/70 max-w-lg mx-auto text-center border-white/60">
      <div class="flex items-center justify-center gap-2 mb-6">
        <Wind class="w-6 h-6 text-violet-500" />
        <h2 class="text-2xl font-bold text-slate-800">Breathing Rainbow</h2>
      </div>
      <p class="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
        Follow the circle to perform a calming box-breathing cycle. Breathe in, hold, breathe out, and hold for 4 seconds each.
      </p>

      {/* Breathing Sphere Area */}
      <div class="relative w-80 h-80 mx-auto flex items-center justify-center mb-10">
        {/* Outer Ring */}
        <div class="absolute inset-0 rounded-full border-2 border-slate-100 scale-100"></div>
        <div class="absolute inset-0 rounded-full border-2 border-slate-200/50 scale-75"></div>

        {/* Breathing Circle with dynamic gradients and scale transitions */}
        <div
          class={`w-44 h-44 rounded-full bg-gradient-to-tr ${
            currentStage.color
          } transition-all duration-[4000ms] ease-in-out flex flex-col items-center justify-center text-white font-semibold text-xl ${
            isActive ? currentStage.sizeClass : 'scale-100 shadow-clay-md'
          }`}
        >
          {isActive ? (
            <div class="animate-fade-in flex flex-col items-center">
              <span class="text-2xl font-extrabold tracking-wide drop-shadow-md">
                {currentStage.name}
              </span>
              <span class="text-4xl font-black mt-2 drop-shadow-md">
                {secondsRemaining}s
              </span>
            </div>
          ) : (
            <span class="text-lg text-slate-700 font-bold bg-white/80 px-4 py-2 rounded-2xl shadow-clay-sm">
              Ready
            </span>
          )}
        </div>
      </div>

      {/* Subtitle Instructions */}
      <div class="h-16 mb-6">
        {isActive ? (
          <div class="animate-fade-in">
            <h3 class="text-lg font-semibold text-slate-700">{currentStage.name}</h3>
            <p class="text-sm text-slate-500 mt-1">{currentStage.text}</p>
          </div>
        ) : (
          <p class="text-slate-600 font-medium">Click "Start Breathing" to begin your relaxation.</p>
        )}
      </div>

      {/* Statistics */}
      {totalCycles > 0 && (
        <div class="text-sm text-slate-500 mb-6 bg-slate-50 py-2 px-4 rounded-xl inline-block">
          Completed cycles: <span class="font-bold text-violet-600">{totalCycles}</span>
        </div>
      )}

      {/* Action Controls */}
      <div class="flex justify-center gap-4">
        <button
          onClick={toggleTimer}
          class={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all ${
            isActive
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg'
              : 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200'
          }`}
        >
          {isActive ? (
            <>
              <Pause class="w-4 h-4 fill-white" /> Pause
            </>
          ) : (
            <>
              <Play class="w-4 h-4 fill-white" /> Start Breathing
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          class="flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-colors"
          title="Reset exercise"
        >
          <RotateCcw class="w-4 h-4" /> Reset
        </button>
      </div>
    </div>
  );
}
