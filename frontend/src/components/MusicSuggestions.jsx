import React, { useState } from 'react';
import { Music, CloudRain, Volume2, Waves, Trees, Compass, Play, Disc } from 'lucide-react';

const MUSIC_CATEGORIES = [
  {
    id: 'lofi',
    name: 'Lo-Fi Beats',
    description: 'Chill, nostalgic beats to help you relax, focus, or wind down.',
    icon: Music,
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator',
    color: 'bg-indigo-50 border-indigo-100 hover:border-indigo-300',
    iconColor: 'text-indigo-600',
  },
  {
    id: 'rain',
    name: 'Rain & Storm',
    description: 'The soothing sound of raindrops falling on leaves and pavement.',
    icon: CloudRain,
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Ueb7mYr81G?utm_source=generator',
    color: 'bg-sky-50 border-sky-100 hover:border-sky-300',
    iconColor: 'text-sky-600',
  },
  {
    id: 'piano',
    name: 'Peaceful Piano',
    description: 'Soft, slow classical piano pieces that quiet the mind.',
    icon: Volume2,
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator',
    color: 'bg-violet-50 border-violet-100 hover:border-violet-300',
    iconColor: 'text-violet-600',
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    description: 'Deep, rhythmic ocean tides to carry away stress and anxiety.',
    icon: Waves,
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdE6UK29V2wU?utm_source=generator',
    color: 'bg-teal-50 border-teal-100 hover:border-teal-300',
    iconColor: 'text-teal-600',
  },
  {
    id: 'forest',
    name: 'Forest Walk',
    description: 'Rustling trees, soft wind, and wilderness soundscapes.',
    icon: Trees,
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX2Ry92uX5q1K?utm_source=generator',
    color: 'bg-emerald-50 border-emerald-100 hover:border-emerald-300',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'nature',
    name: 'Nature Ambient',
    description: 'Gentle morning birds and natural flow for grounding.',
    icon: Compass,
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX1tuUiirZtSG?utm_source=generator',
    color: 'bg-amber-50 border-amber-100 hover:border-amber-300',
    iconColor: 'text-amber-600',
  },
];

export default function MusicSuggestions() {
  const [selectedCategory, setSelectedCategory] = useState(MUSIC_CATEGORIES[0]);

  return (
    <div class="clay-card p-6 md:p-8 bg-white/70 max-w-4xl mx-auto border-white/60">
      <div class="flex items-center gap-2 mb-6">
        <Disc class="w-6 h-6 text-violet-500 animate-spin" style={{ animationDuration: '3s' }} />
        <h2 class="text-2xl font-bold text-slate-800">Calming Music Hub</h2>
      </div>
      <p class="text-sm text-slate-500 mb-8 max-w-lg">
        Pick a category below to load a curated music player. Let the ambient sounds help settle your mind.
      </p>

      <div class="grid md:grid-cols-2 gap-6 items-start">
        {/* Playlists Selection Grid */}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
          {MUSIC_CATEGORIES.map((category) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory.id === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                class={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${category.color} ${
                  isSelected 
                    ? 'ring-2 ring-violet-500 bg-white shadow-clay-md scale-[1.01]' 
                    : 'bg-white/40 shadow-clay-sm hover:scale-[1.01]'
                }`}
              >
                <div class={`w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-clay-sm ${category.iconColor}`}>
                  <IconComponent class="w-6 h-6" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-slate-800 text-sm">{category.name}</h3>
                  <p class="text-xs text-slate-500 truncate mt-0.5">{category.description}</p>
                </div>
                <div class={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-violet-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Play class="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Player Panel */}
        <div class="clay-card-flat p-4 bg-white/90 border-white/60 sticky top-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <span class="text-xs font-bold text-violet-500 uppercase tracking-wider">Now Playing</span>
              <h3 class="text-lg font-bold text-slate-800">{selectedCategory.name}</h3>
            </div>
            <div class={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 ${selectedCategory.iconColor}`}>
              {React.createElement(selectedCategory.icon, { class: 'w-5 h-5' })}
            </div>
          </div>
          
          {/* Iframe Embed */}
          <div class="w-full rounded-2xl overflow-hidden bg-slate-50 aspect-[3/4] sm:aspect-auto sm:h-[352px] shadow-inner">
            <iframe
              src={selectedCategory.embedUrl}
              width="100%"
              height="352"
              style={{ border: 0 }}
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title={`${selectedCategory.name} Player`}
            ></iframe>
          </div>
          <p class="text-center text-[10px] text-slate-400 mt-3 italic">
            Playback is streamed directly from Spotify. Free users may hear occasional ad breaks.
          </p>
        </div>
      </div>
    </div>
  );
}
