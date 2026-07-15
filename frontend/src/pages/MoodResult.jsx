import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Sparkles, Heart, RefreshCw, AlertCircle, Wind, Palette, Disc, Zap } from 'lucide-react';
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

const GAME_CARDS = [
  {
    id: 'breathe',
    name: 'Breathing Rainbow',
    desc: 'Deep box-breathing cycle',
    icon: Wind,
    colorClass: 'bg-pink-50 border-pink-100 hover:border-pink-300 text-pink-600',
    glowClass: 'ring-2 ring-pink-400 glow-pulse-pink',
    keywords: ['breath', 'breathing', 'rainbow', 'lungs'],
  },
  {
    id: 'music',
    name: 'Music Suggestions',
    desc: 'calming lofi & piano streams',
    icon: Disc,
    colorClass: 'bg-indigo-50 border-indigo-100 hover:border-indigo-300 text-indigo-600',
    glowClass: 'ring-2 ring-indigo-400 glow-pulse-indigo',
    keywords: ['music', 'lo-fi', 'lofi', 'ambient', 'piano', 'sound', 'rain'],
  },
  {
    id: 'doodle',
    name: 'Mood Doodle',
    desc: 'Digital feeling drawing pad',
    icon: Palette,
    colorClass: 'bg-emerald-50 border-emerald-100 hover:border-emerald-300 text-emerald-600',
    glowClass: 'ring-2 ring-emerald-400 glow-pulse-emerald',
    keywords: ['doodle', 'draw', 'sketch', 'paint', 'canvas', 'feeling doodle'],
  },
  {
    id: 'game',
    name: 'Color Match Rush',
    desc: 'Reflex reaction matching game',
    icon: Zap,
    colorClass: 'bg-amber-50 border-amber-100 hover:border-amber-300 text-amber-600',
    glowClass: 'ring-2 ring-amber-400 glow-pulse-amber',
    keywords: ['game', 'match', 'rush', 'color match', 'reflex', 'reaction'],
  },
];

export default function MoodResult() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [streamText, setStreamText] = useState('');
  const [streaming, setStreaming] = useState(true);
  const [error, setError] = useState('');
  const [dbRecord, setDbRecord] = useState(null);
  const [recommendedActivity, setRecommendedActivity] = useState(null);

  // Read data passed from checkin page
  const checkInData = location.state;

  useEffect(() => {
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
          
          // Trigger confetti explosion
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            console.warn('Confetti blocked:', e);
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

  // Scan AI text response to auto-recommend a game card
  useEffect(() => {
    if (!streaming && streamText) {
      const lowerText = streamText.toLowerCase();
      
      // Match keywords
      const matched = GAME_CARDS.find(card => 
        card.keywords.some(keyword => lowerText.includes(keyword))
      );

      if (matched) {
        setRecommendedActivity(matched.id);
      }
    }
  }, [streaming, streamText]);

  if (!checkInData) return null;

  const bgStyle = COLOR_BG_MAP[checkInData.color] || 'bg-white/70 border-white/60';

  return (
    <div class="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6 animate-fade-in">
      
      {/* AI Streaming Card */}
      <div class={`clay-card p-6 md:p-8 border ${bgStyle}`}>
        <div class="flex items-center justify-between border-b border-slate-200/40 pb-4 mb-6">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-clay-sm animate-pulse">
              <Sparkles class="w-4.5 h-4.5 text-pink-500 fill-pink-400" />
            </div>
            <div>
              <h2 class="text-base font-bold text-slate-800 font-display">MoodBuddy Insights</h2>
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
                <span class="inline-block w-2.5 h-4 ml-1 bg-pink-500 animate-pulse rounded-sm align-middle"></span>
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

        {!streaming && !error && (
          <div class="flex items-center gap-1.5 mt-5 text-[10px] text-slate-400 font-semibold bg-white/30 px-3.5 py-1.5 rounded-full w-max border border-white/20">
            <Heart class="w-3.5 h-3.5 text-rose-400 fill-rose-300" /> Analysis Complete
          </div>
        )}
      </div>

      {/* Suggested Activities Portal with Glowing Recommendation Highlight */}
      {!streaming && (
        <div class="clay-card p-6 md:p-8 bg-white/70 border-white/60 animate-slide-up">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-bold text-slate-800">Your Calming Hub</h3>
              <p class="text-xs text-slate-500 mt-0.5">
                {recommendedActivity 
                  ? "Based on your reflection, we highlighted an activity to try below."
                  : "Pick an activity to help rest your mind and shift your energy."}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {GAME_CARDS.map((card) => {
              const Icon = card.icon;
              const isRecommended = recommendedActivity === card.id;
              
              // Custom floating/pulse styles for the recommended card
              const pulseStyle = isRecommended 
                ? 'ring-2 ring-pink-500 shadow-xl scale-[1.01] animate-pulse'
                : 'shadow-clay-sm hover:scale-[1.01]';
              
              // Spin the disk, flash the zap, wave the doodle, or pulse the breathing ring
              const iconAnimClass = isRecommended
                ? card.id === 'music' ? 'animate-spin'
                  : card.id === 'game' ? 'animate-bounce'
                  : card.id === 'breathe' ? 'animate-pulse'
                  : 'animate-bounce' // Doodle
                : '';

              return (
                <Link
                  key={card.id}
                  to="/activities"
                  class={`clay-card p-5 border text-left flex gap-4 items-start transition-all duration-300 ${card.colorClass} ${pulseStyle}`}
                >
                  <div class={`w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-clay-sm flex-shrink-0 ${iconAnimClass}`}>
                    <Icon class="w-5.5 h-5.5" />
                  </div>
                  <div>
                    {isRecommended && (
                      <span class="inline-block bg-pink-500 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-1">
                        Recommended
                      </span>
                    )}
                    <h4 class="font-bold text-sm text-slate-800">{card.name}</h4>
                    <p class="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{card.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div class="h-[1px] bg-slate-100 my-6"></div>

          <div class="flex justify-end">
            <Link
              to="/dashboard"
              class="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-clay-btn transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
