import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Heart, RefreshCw, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { moodService } from '../services/api';

const COLOR_BG_MAP = {
  Yellow: 'bg-yellow-50/50 border-yellow-200/60 shadow-yellow-100/10',
  Blue: 'bg-blue-50/50 border-blue-200/60 shadow-blue-100/10',
  Purple: 'bg-purple-50/50 border-purple-200/60 shadow-purple-100/10',
  Green: 'bg-emerald-50/50 border-emerald-200/60 shadow-emerald-100/10',
  Pink: 'bg-pink-50/50 border-pink-200/60 shadow-pink-100/10',
  Orange: 'bg-orange-50/50 border-orange-200/60 shadow-orange-100/10',
  Gray: 'bg-slate-100/40 border-slate-200/60 shadow-slate-100/10',
  Red: 'bg-rose-50/50 border-rose-200/60 shadow-rose-100/10',
};

const COLOR_TEXT_MAP = {
  Yellow: 'text-amber-800',
  Blue: 'text-blue-800',
  Purple: 'text-purple-800',
  Green: 'text-emerald-800',
  Pink: 'text-pink-800',
  Orange: 'text-orange-800',
  Gray: 'text-slate-800',
  Red: 'text-rose-800',
};

export default function MoodResult() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [streamText, setStreamText] = useState('');
  const [streaming, setStreaming] = useState(true);
  const [error, setError] = useState('');
  const [dbRecord, setDbRecord] = useState(null);

  // Read data passed from checkin page
  const checkInData = location.state;

  useEffect(() => {
    // If user lands here directly without submitting mood, send them to dashboard
    if (!checkInData || !checkInData.mood || !checkInData.color) {
      navigate('/dashboard');
      return;
    }

    let isMounted = true;
    setStreamText('');
    setStreaming(true);
    setError('');

    // Connect to backend stream API
    moodService.streamAnalysis(
      checkInData,
      // onChunk
      (chunk) => {
        if (isMounted) {
          setStreamText((prev) => prev + chunk);
        }
      },
      // onDone
      (savedEntry) => {
        if (isMounted) {
          setStreaming(false);
          setDbRecord(savedEntry);
          
          // Trigger confetti explosion for premium feel
          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 }
            });
          } catch (e) {
            console.warn('Confetti blocked or failed:', e);
          }
        }
      },
      // onError
      (err) => {
        if (isMounted) {
          console.error('Streaming API error:', err);
          setError(err.message || 'Failed to complete analysis.');
          setStreaming(false);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [checkInData, navigate]);

  if (!checkInData) return null;

  const bgStyle = COLOR_BG_MAP[checkInData.color] || 'bg-white/70 border-white/60';
  const textStyle = COLOR_TEXT_MAP[checkInData.color] || 'text-slate-800';

  return (
    <div class="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6 animate-fade-in">
      
      {/* AI Streaming Card */}
      <div class={`clay-card p-6 md:p-8 border ${bgStyle}`}>
        <div class="flex items-center justify-between border-b border-slate-200/40 pb-4 mb-6">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-clay-sm animate-pulse">
              <Sparkles class="w-4.5 h-4.5 text-violet-500 fill-violet-400" />
            </div>
            <div>
              <h2 class="text-base font-bold text-slate-800 font-display">MoodBuddy Advice</h2>
              <span class="text-[10px] text-slate-400 font-bold uppercase">Non-clinical AI Companion</span>
            </div>
          </div>
          <span class="text-xs font-semibold bg-white/80 py-1 px-3 rounded-full text-slate-500 shadow-clay-sm border border-white/50">
            {checkInData.mood} check-in
          </span>
        </div>

        {/* Streaming text panel */}
        <div class="min-h-[160px] text-sm md:text-base leading-relaxed whitespace-pre-line text-slate-700 bg-white/65 p-6 rounded-2xl border border-white/40 shadow-inner">
          {streamText ? (
            <div>
              {streamText}
              {streaming && (
                <span class="inline-block w-2.5 h-4 ml-1 bg-violet-600 animate-pulse rounded-sm align-middle"></span>
              )}
            </div>
          ) : (
            !error && (
              <div class="flex flex-col items-center justify-center gap-2 py-6 text-slate-400">
                <RefreshCw class="w-6 h-6 animate-spin text-slate-300" />
                <span class="text-xs font-bold">Assembling details and connecting...</span>
              </div>
            )
          )}

          {error && (
            <div class="flex items-center gap-2 text-rose-500 text-xs font-semibold py-4 bg-rose-50/50 px-4 rounded-xl border border-rose-100">
              <AlertCircle class="w-4.5 h-4.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Small encouragement tag */}
        {!streaming && !error && (
          <div class="flex items-center gap-1.5 mt-5 text-[10px] text-slate-400 font-semibold bg-white/30 px-3.5 py-1.5 rounded-full w-max border border-white/20">
            <Heart class="w-3.5 h-3.5 text-rose-400 fill-rose-300" /> Validation and exercises complete
          </div>
        )}
      </div>

      {/* Suggested Activities Portal */}
      {!streaming && (
        <div class="clay-card p-6 bg-white/70 border-white/60 animate-slide-up">
          <h3 class="text-base font-bold text-slate-800 mb-2">Recommended Next Step</h3>
          <p class="text-xs text-slate-500 mb-6">
            Take a few minutes for yourself with one of MoodBuddy's play activities.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Link
              to="/activities"
              class="clay-card-flat p-4 bg-violet-50/50 hover:bg-violet-50 hover:scale-[1.01] transition-all border border-violet-100 flex items-center justify-between text-slate-700"
            >
              <div>
                <h4 class="font-bold text-sm text-violet-700">Calming Exercises</h4>
                <p class="text-[10px] text-slate-500 mt-0.5">Doodle, Breathe, Game, or Music</p>
              </div>
              <ArrowRight class="w-4 h-4 text-violet-500" />
            </Link>

            <Link
              to="/dashboard"
              class="clay-card-flat p-4 bg-slate-50/50 hover:bg-slate-50 hover:scale-[1.01] transition-all border border-slate-200/50 flex items-center justify-between text-slate-700"
            >
              <div>
                <h4 class="font-bold text-sm text-slate-700">Back to Dashboard</h4>
                <p class="text-[10px] text-slate-500 mt-0.5">View your updated history chart</p>
              </div>
              <ArrowRight class="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
