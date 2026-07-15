import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, BrainCircuit, Check } from 'lucide-react';

const MOOD_OPTIONS = [
  { name: 'Very Happy', emoji: '😆', desc: 'Feeling fantastic & energetic', color: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-600 border-yellow-200' },
  { name: 'Happy', emoji: '😊', desc: 'Content, peaceful, or joyful', color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200' },
  { name: 'Neutral', emoji: '😐', desc: 'Just a normal, steady day', color: 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200' },
  { name: 'Tired', emoji: '🥱', desc: 'Low energy or needing rest', color: 'bg-sky-50 hover:bg-sky-100 text-sky-600 border-sky-200' },
  { name: 'Sad', emoji: '😢', desc: 'Feeling down, heavy, or blue', color: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200' },
  { name: 'Stressed', emoji: '🤯', desc: 'Overwhelmed or highly pressured', color: 'bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200' },
  { name: 'Angry', emoji: '😡', desc: 'Frustrated, annoyed, or heated', color: 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200' },
  { name: 'Anxious', emoji: '🥺', desc: 'Nervous, worried, or uneasy', color: 'bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200' }
];

const COLOR_OPTIONS = [
  { name: 'Yellow', hex: '#FFD966', desc: 'Warm, positive energy' },
  { name: 'Blue', hex: '#6C9BCF', desc: 'Calm, tranquil vibe' },
  { name: 'Purple', hex: '#A78BFA', desc: 'Creative, dreamy flow' },
  { name: 'Green', hex: '#81C784', desc: 'Restful, healing growth' },
  { name: 'Pink', hex: '#F48FB1', desc: 'Gentle, loving care' },
  { name: 'Orange', hex: '#FFB74D', desc: 'Creative, playful spark' },
  { name: 'Gray', hex: '#B0BEC5', desc: 'Quiet, reflective shadow' },
  { name: 'Red', hex: '#E57373', desc: 'Intense, active fire' }
];

const TAG_OPTIONS = [
  'Tired', 'Anxious', 'Happy', 'Creative', 
  'Lonely', 'Grateful', 'Angry', 'Focused', 
  'Excited', 'Peaceful', 'Bored', 'Stressed'
];

export default function MoodCheck() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // Mood check-in state
  const [mood, setMood] = useState('');
  const [color, setColor] = useState('');
  const [tags, setTags] = useState([]);
  const [note, setNote] = useState('');

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleMoodSelect = (moodName) => {
    setMood(moodName);
    setTimeout(nextStep, 250); // Small delay for tactile selection feel
  };

  const handleColorSelect = (colorName) => {
    setColor(colorName);
    setTimeout(nextStep, 250);
  };

  const toggleTag = (tag) => {
    setTags((prev) => 
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAnalyze = () => {
    if (!mood || !color) {
      alert('Please fill out your mood and color first!');
      return;
    }
    // Route to results, passing data in router state
    navigate('/result', {
      state: { mood, color, tags, note }
    });
  };

  const progressPercent = ((step - 1) / 4) * 100;

  return (
    <div class="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6 animate-fade-in">
      {/* Header and Progress Bar */}
      <div class="clay-card p-6 bg-white/70 border-white/60">
        <div class="flex items-center justify-between mb-4">
          <div>
            <span class="text-xs font-bold text-violet-500 uppercase tracking-widest">Check-In Flow</span>
            <h2 class="text-xl font-bold text-slate-800 font-display mt-0.5">How's your day, Buddy?</h2>
          </div>
          <span class="text-sm font-black text-slate-400">{step} / 5</span>
        </div>

        {/* Progress Bar Container */}
        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Dynamic Slide Steps */}
      <div class="clay-card p-8 bg-white/70 border-white/60 min-h-[380px] flex flex-col justify-between">
        
        {/* STEP 1: Select Mood */}
        {step === 1 && (
          <div class="animate-fade-in">
            <h3 class="text-lg font-bold text-slate-800 mb-2">1. How are you feeling today?</h3>
            <p class="text-xs text-slate-500 mb-6">Tap your primary feeling card to continue.</p>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MOOD_OPTIONS.map((opt) => (
                <button
                  key={opt.name}
                  onClick={() => handleMoodSelect(opt.name)}
                  class={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all hover:scale-105 active:scale-95 ${opt.color} ${
                    mood === opt.name ? 'ring-2 ring-violet-500 scale-[1.03] shadow-clay-sm' : 'bg-white shadow-clay-sm'
                  }`}
                >
                  <span class="text-3xl mb-2">{opt.emoji}</span>
                  <span class="font-bold text-xs tracking-tight">{opt.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Select Color Circle */}
        {step === 2 && (
          <div class="animate-fade-in">
            <h3 class="text-lg font-bold text-slate-800 mb-2">2. What color represents your vibe?</h3>
            <p class="text-xs text-slate-500 mb-6">Select a pastel theme that calls to you.</p>
            <div class="grid grid-cols-4 sm:grid-cols-8 gap-4 justify-items-center mb-6">
              {COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt.name}
                  onClick={() => handleColorSelect(opt.name)}
                  style={{ backgroundColor: opt.hex }}
                  class={`w-12 h-12 rounded-full shadow-clay-md transition-all hover:scale-110 active:scale-90 flex items-center justify-center ${
                    color === opt.name ? 'ring-4 ring-violet-500 ring-offset-4 scale-105' : ''
                  }`}
                  title={opt.desc}
                >
                  {color === opt.name && <Check class="w-5 h-5 text-white drop-shadow" />}
                </button>
              ))}
            </div>
            {color && (
              <div class="text-center bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 animate-scale-up">
                <span class="text-xs text-slate-500">Selected vibe: </span>
                <span class="font-bold text-xs text-slate-700">
                  {color} — {COLOR_OPTIONS.find(c => c.name === color)?.desc}
                </span>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Multi-Select Chips */}
        {step === 3 && (
          <div class="animate-fade-in">
            <h3 class="text-lg font-bold text-slate-800 mb-2">3. Any specific feeling tags?</h3>
            <p class="text-xs text-slate-500 mb-6">Choose as many as apply. These help shape the AI's validation.</p>
            <div class="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => {
                const isSelected = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    class={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-violet-500 text-white border-violet-500 shadow-clay-sm scale-[1.02]'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Optional Textarea */}
        {step === 4 && (
          <div class="animate-fade-in">
            <h3 class="text-lg font-bold text-slate-800 mb-2">4. Want to tell MoodBuddy anything?</h3>
            <p class="text-xs text-slate-500 mb-4">Write a short note about your day (optional, max 200 characters).</p>
            
            <div class="relative">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.substring(0, 200))}
                placeholder="Today, I worked on my project and..."
                rows={5}
                class="w-full p-4 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-sm text-slate-700 bg-white/50 shadow-inner"
              />
              <div class="absolute bottom-4 right-4 text-xs font-bold text-slate-400 bg-slate-50/80 px-2 py-1 rounded-lg">
                {note.length} / 200
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Final Confirmation Overview */}
        {step === 5 && (
          <div class="animate-fade-in text-center">
            <div class="w-16 h-16 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center mx-auto mb-4 shadow-clay-sm">
              <BrainCircuit class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">Ready for analysis!</h3>
            <p class="text-xs text-slate-500 mb-6">Our AI buddy will read your entries and stream back encouraging advice.</p>
            
            <div class="clay-card-flat p-4 bg-slate-50/50 max-w-sm mx-auto text-left flex flex-col gap-2 border-slate-200/50">
              <div class="text-xs text-slate-500"><span class="font-bold">Mood:</span> {mood}</div>
              <div class="text-xs text-slate-500"><span class="font-bold">Color Vibe:</span> {color}</div>
              <div class="text-xs text-slate-500"><span class="font-bold">Tags Chosen:</span> {tags.length > 0 ? tags.join(', ') : 'None'}</div>
              <div class="text-xs text-slate-500 truncate"><span class="font-bold">Personal Note:</span> {note ? `"${note}"` : 'None provided'}</div>
            </div>
          </div>
        )}

        {/* Action Buttons Row */}
        <div class="flex items-center justify-between border-t border-slate-100/80 pt-6 mt-8">
          <button
            onClick={prevStep}
            disabled={step === 1}
            class={`flex items-center gap-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all border ${
              step === 1
                ? 'opacity-0 pointer-events-none'
                : 'text-slate-500 border-slate-200 hover:bg-slate-50 bg-white shadow-clay-btn'
            }`}
          >
            <ChevronLeft class="w-4 h-4" /> Back
          </button>

          {step < 5 ? (
            <button
              onClick={nextStep}
              disabled={(step === 1 && !mood) || (step === 2 && !color)}
              class="flex items-center gap-1 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-violet-100"
            >
              Next <ChevronRight class="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleAnalyze}
              class="flex items-center gap-2 px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-xl transition-transform hover:scale-105 shadow-md shadow-violet-200"
            >
              <BrainCircuit class="w-4.5 h-4.5" /> Analyze My Mood
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
