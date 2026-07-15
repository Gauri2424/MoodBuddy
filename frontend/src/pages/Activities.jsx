import React, { useState } from 'react';
import { Wind, Palette, Disc, Zap, ArrowLeft, HelpCircle } from 'lucide-react';
import BreathingRainbow from '../components/BreathingRainbow';
import MusicSuggestions from '../components/MusicSuggestions';
import MoodDoodle from '../components/MoodDoodle';
import ColorMatchRush from '../components/ColorMatchRush';

const HUB_ACTIVITIES = [
  {
    id: 'breathe',
    name: 'Breathing Rainbow',
    description: 'An animated visual guide for slow, rhythmic box-breathing to calm your nerves.',
    icon: Wind,
    color: 'bg-pink-50 text-pink-600 border-pink-100 hover:border-pink-300',
    component: BreathingRainbow,
  },
  {
    id: 'music',
    name: 'Music Suggestions',
    description: 'Curated calming playlists (Lo-Fi, rain, ocean) streamed directly on the page.',
    icon: Disc,
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:border-indigo-300',
    component: MusicSuggestions,
  },
  {
    id: 'doodle',
    name: 'Mood Doodle',
    description: 'A freehand sketching canvas with preset colors to draw out your feelings.',
    icon: Palette,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-300',
    component: MoodDoodle,
  },
  {
    id: 'game',
    name: 'Color Match Rush',
    description: 'A quick reaction game to test your focus and matching speed as levels get faster.',
    icon: Zap,
    color: 'bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-300',
    component: ColorMatchRush,
  },
];

export default function Activities() {
  const [activeActivity, setActiveActivity] = useState(null);

  const handleBackToHub = () => {
    setActiveActivity(null);
  };

  if (activeActivity) {
    const SelectedComponent = activeActivity.component;
    return (
      <div class="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-4 animate-fade-in">
        {/* Navigation back to Hub */}
        <button
          onClick={handleBackToHub}
          class="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 bg-white shadow-clay-btn border border-slate-200/50 py-2 px-4 rounded-xl w-max transition-colors"
        >
          <ArrowLeft class="w-4 h-4" /> Back to Activities Hub
        </button>

        {/* Mount Selected Activity */}
        <div class="mt-2 animate-scale-up">
          <SelectedComponent />
        </div>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6 animate-fade-in">
      {/* Header Banner */}
      <div class="clay-card p-6 md:p-8 bg-white/70 border-white/60">
        <h2 class="text-2xl md:text-3xl font-black text-slate-800 font-display">Playful Activities</h2>
        <p class="text-sm text-slate-500 mt-2">
          Choose a relaxing, interactive activity below to help lift your spirits and practice mindfulness.
        </p>
      </div>

      {/* Grid of activities */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {HUB_ACTIVITIES.map((activity) => {
          const Icon = activity.icon;
          return (
            <button
              key={activity.id}
              onClick={() => setActiveActivity(activity)}
              class={`clay-card p-6 text-left hover:scale-[1.015] hover:-translate-y-0.5 border flex flex-col justify-between transition-all duration-200 cursor-pointer h-56 ${activity.color}`}
            >
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-clay-sm flex-shrink-0">
                  <Icon class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="font-bold text-slate-800 text-base">{activity.name}</h3>
                  <p class="text-xs text-slate-500 mt-2 leading-relaxed">{activity.description}</p>
                </div>
              </div>
              
              <div class="flex items-center gap-1 text-xs font-bold mt-4 justify-end text-slate-700 bg-white/50 px-3 py-1.5 rounded-xl border border-white/40 shadow-clay-btn hover:bg-white transition-colors w-max self-end">
                <span>Start Exercise</span>
                <Zap class="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
