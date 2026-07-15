import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Smile, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Wind, 
  Disc, 
  Palette, 
  Zap, 
  Heart,
  Plus
} from 'lucide-react';
import { moodService } from '../services/api';

const MOOD_EMOJIS = {
  'Very Happy': '😆',
  'Happy': '😊',
  'Neutral': '😐',
  'Tired': '🥱',
  'Sad': '😢',
  'Stressed': '😰',
  'Angry': '😡',
  'Anxious': '😰',
};

const DYNAMIC_ACTIVITIES = [
  {
    id: 'breathe',
    name: 'Breathing Rainbow',
    desc: 'Guided deep box-breathing',
    icon: Wind,
    color: 'bg-pink-50 border-pink-100 hover:border-pink-300 text-pink-600',
  },
  {
    id: 'music',
    name: 'Music Suggestions',
    desc: 'calming soundscapes & lofi',
    icon: Disc,
    color: 'bg-rose-50 border-rose-100 hover:border-rose-300 text-rose-600',
  },
  {
    id: 'doodle',
    name: 'Mood Doodle',
    desc: 'Digital sketching paint pad',
    icon: Palette,
    color: 'bg-emerald-50 border-emerald-100 hover:border-emerald-300 text-emerald-600',
  },
  {
    id: 'game',
    name: 'Color Match Rush',
    desc: 'Focus & reaction reflex game',
    icon: Zap,
    color: 'bg-amber-50 border-amber-100 hover:border-amber-300 text-amber-600',
  },
];

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkedInToday, setCheckedInToday] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Load history logs to check for today's check-in
        const historyData = await moodService.getHistory(30);
        if (historyData.success) {
          setHistory(historyData.history);

          // Check if checked in today
          const todayStr = new Date().toLocaleDateString('en-CA');
          const hasToday = historyData.history.some(entry => {
            const entryDate = new Date(entry.createdAt).toLocaleDateString('en-CA');
            return entryDate === todayStr;
          });
          setCheckedInToday(hasToday);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to connect to the database. Make sure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div class="max-w-7xl mx-auto px-4 py-20 flex justify-center items-center">
        <div class="flex flex-col items-center gap-4">
          <div class="w-12 h-12 rounded-full border-4 border-pink-200 border-t-pink-600 animate-spin"></div>
          <span class="text-sm font-semibold text-slate-500">Syncing with MoodBuddy database...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div class="max-w-xl mx-auto px-4 py-20 text-center">
        <div class="clay-card p-8 bg-rose-50 border-rose-200">
          <span class="text-4xl">⚠️</span>
          <h3 class="text-lg font-bold text-rose-800 mt-4 mb-2">Connection Issue</h3>
          <p class="text-xs text-rose-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            class="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl shadow-md transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const latestEntry = history[0];

  return (
    <div class="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8 animate-fade-in">
      
      {/* Top Greeting Block (Full Width, No Stats Side panel) */}
      <div class="clay-card p-6 md:p-8 bg-gradient-to-r from-pink-500/10 to-rose-500/5 border-white/60 flex items-center justify-between">
        <div>
          <h2 class="text-2xl md:text-3xl font-black text-slate-800 font-display flex items-center gap-2">
            Welcome to MoodBuddy! 🦊
          </h2>
          <p class="text-sm text-slate-500 mt-2 font-medium">
            {checkedInToday 
              ? "You have checked in today! See your comforting analysis below."
              : "Hello there! Take a second to check in and share how you are feeling."}
          </p>
          {!checkedInToday && (
            <Link
              to="/checkin"
              class="inline-flex items-center gap-1.5 px-5 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm rounded-2xl shadow-md shadow-pink-100 hover:scale-[1.02] active:scale-95 transition-all mt-5"
            >
              <span>Check In Now</span>
              <ChevronRight class="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Main Grid: Today's Status & Quick Launcher */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Today's Status Card */}
        <div class="clay-card p-6 bg-white/80 border-white/60 flex flex-col justify-between h-[340px]">
          <div class="mb-4">
            <h3 class="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 class="w-5 h-5 text-pink-500" /> Today's Check-In
            </h3>
            <div class="h-[1px] bg-slate-100/50 my-3"></div>

            {checkedInToday && latestEntry ? (
              <div class="bg-pink-50/40 rounded-2xl p-4 border border-pink-100/50">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">{MOOD_EMOJIS[latestEntry.mood]}</span>
                  <div>
                    <h4 class="font-bold text-slate-800 text-sm">{latestEntry.mood}</h4>
                    <span class="text-[10px] text-slate-400 font-medium">
                      Logged {new Date(latestEntry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <p class="text-xs text-slate-500 mt-3 line-clamp-4 italic border-l-2 border-pink-300 pl-3">
                  "{latestEntry.aiSummary.substring(0, 150)}..."
                </p>
              </div>
            ) : (
              <div class="text-center py-8 text-slate-400 text-sm flex flex-col items-center justify-center gap-2">
                <span class="text-3xl block mb-1">🌱</span>
                <span>You haven't checked in yet today.</span>
              </div>
            )}
          </div>
          
          {checkedInToday ? (
            <Link
              to="/result"
              state={latestEntry}
              class="w-full text-center py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl shadow-clay-btn transition-colors flex items-center justify-center gap-1"
            >
              <Sparkles class="w-3.5 h-3.5 text-pink-500 fill-pink-300" />
              <span>View Full AI Summary</span>
            </Link>
          ) : (
            <Link
              to="/checkin"
              class="w-full text-center py-3.5 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1"
            >
              <Plus class="w-4 h-4" />
              <span>Log Today's Mood</span>
            </Link>
          )}
        </div>

        {/* Activity Quick-Launcher Panel */}
        <div class="md:col-span-2 clay-card p-6 bg-white/80 border-white/60 flex flex-col justify-between h-[340px]">
          <div>
            <h3 class="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <Heart class="w-5 h-5 text-pink-500 fill-pink-400" /> Playful Exercises
            </h3>
            <p class="text-xs text-slate-500 mt-1">
              Select a relaxation widget below to quiet your mind and release tension.
            </p>
            <div class="h-[1px] bg-slate-100/50 my-3"></div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow content-center py-2">
            {DYNAMIC_ACTIVITIES.map((act) => {
              const Icon = act.icon;
              return (
                <Link
                  key={act.id}
                  to="/activities"
                  class={`clay-card-flat p-4 border text-left flex gap-3.5 items-center transition-all hover:scale-[1.015] ${act.color}`}
                >
                  <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-clay-sm flex-shrink-0">
                    <Icon class="w-5 h-5" />
                  </div>
                  <div>
                    <h4 class="font-bold text-xs text-slate-800">{act.name}</h4>
                    <p class="text-[10px] text-slate-500 mt-0.5 truncate">{act.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
