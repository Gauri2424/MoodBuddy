import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Shield, BarChart3, ArrowRight, CheckCircle2, ChevronDown, BookOpen, Smile, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

const PREVIEW_MOODS = [
  {
    emoji: '😆',
    name: 'Very Happy',
    quote: "Sensational vibes! I am so happy to see you feeling this way. Let's play a round of Color Match Rush to celebrate this energy!",
    color: 'from-pink-200 via-rose-100 to-amber-100',
    blobColors: ['bg-pink-300/30', 'bg-rose-200/30'],
    textColor: 'text-rose-800 border-rose-200 bg-rose-50/70',
  },
  {
    emoji: '🥺',
    name: 'Anxious',
    quote: "It's completely okay to feel uneasy. Let's hit the pause button. Slow down, take a deep breath, and let's try the Breathing Rainbow.",
    color: 'from-pink-200 via-purple-100 to-rose-100',
    blobColors: ['bg-pink-300/30', 'bg-purple-200/30'],
    textColor: 'text-pink-800 border-pink-200 bg-pink-50/70',
  },
  {
    emoji: '🥱',
    name: 'Tired',
    quote: "You have been working hard, buddy. Let's listen to your body and rest. Let's load up Peaceful Piano music to recharge.",
    color: 'from-rose-150 via-pink-100 to-sky-100',
    blobColors: ['bg-rose-200/30', 'bg-pink-100/30'],
    textColor: 'text-rose-800 border-rose-200 bg-rose-50/70',
  },
  {
    emoji: '😢',
    name: 'Sad',
    quote: "I am right here with you. Your feelings are valid and normal. Why not express them with colors on the Mood Doodle pad?",
    color: 'from-pink-200 via-rose-100 to-indigo-100',
    blobColors: ['bg-pink-300/30', 'bg-rose-100/30'],
    textColor: 'text-pink-800 border-pink-200 bg-pink-50/70',
  },
  {
    emoji: '🤯',
    name: 'Stressed',
    quote: "Your mind is rushing right now. Let's breathe out that tension. Take 4 seconds to center yourself. You can do this.",
    color: 'from-rose-200 via-amber-100 to-pink-100',
    blobColors: ['bg-rose-300/30', 'bg-amber-200/30'],
    textColor: 'text-rose-900 border-rose-200 bg-rose-50/70',
  },
];

const SELF_CARE_ITEMS = [
  { id: 'water', text: 'Drink a glass of refreshing water 💧' },
  { id: 'breath', text: 'Take 5 slow, deep breaths in and out 🌬️' },
  { id: 'stretch', text: 'Stand up and stretch your arms and back 🧘' },
  { id: 'smile', text: 'Think of one thing you are grateful for today 🌸' },
];

const FAQ_ITEMS = [
  {
    q: "Is MoodBuddy a mental health or medical diagnostic tool?",
    a: "No. MoodBuddy is a light-hearted supportive college project. It does not diagnose, treat, or manage clinical conditions like depression or anxiety. It is simply a safe space to check in on daily feelings."
  },
  {
    q: "Where is my mood history data stored?",
    a: "All your check-ins are saved in your local PostgreSQL database on your machine. Your personal notes, colors, and mood choices remain strictly private and local to your system."
  },
  {
    q: "What if I do not have a Gemini API key configured?",
    a: "MoodBuddy features an automatic mock streaming fallback. If no key is configured in your backend `.env` file, the app simulates streamed validation so the interface remains fully interactive and testable!"
  }
];

export default function Landing() {
  const [activePreview, setActivePreview] = useState(PREVIEW_MOODS[0]);
  
  // Checklist State
  const [checkedItems, setCheckedItems] = useState({});
  
  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const toggleChecklist = (id) => {
    setCheckedItems((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      
      // If all items checked, fire off celebratory confetti!
      const allChecked = SELF_CARE_ITEMS.every(item => updated[item.id]);
      if (allChecked) {
        confetti({
          particleCount: 120,
          spread: 80,
          colors: ['#f43f5e', '#fda4af', '#fecdd3', '#fff1f2', '#FFD966']
        });
      }
      return updated;
    });
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const steps = [
    {
      title: 'Quick Check In',
      description: 'Choose a primary mood, select a color theme, and pick tags that represent your energy levels.',
      icon: Heart,
      color: 'bg-rose-100 text-rose-600',
    },
    {
      title: 'Comforting AI Advice',
      description: 'Receive encouraging validation text generated and streamed character-by-character from our non-clinical AI.',
      icon: Sparkles,
      color: 'bg-pink-100 text-pink-600',
    },
    {
      title: 'Mindfulness Activities',
      description: 'Practice 16-second box-breathing, draw on a digital sketchpad, listen to lo-fi, or play a quick color rush game.',
      icon: Shield,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'Self-Care Habits',
      description: 'Maintain streaks, edit your user profile, and develop positive check-in habits day by day.',
      icon: BarChart3,
      color: 'bg-sky-100 text-sky-600',
    },
  ];

  return (
    <div class="relative overflow-hidden min-h-screen flex flex-col justify-between transition-colors duration-1000">
      
      {/* Dynamic Floating Backdrop Blobs (Pinkish Theme) */}
      <div class={`absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[100px] transition-all duration-1000 -z-10 animate-float-slow ${activePreview.blobColors[0]}`}></div>
      <div class={`absolute bottom-1/3 right-10 w-[400px] h-[400px] rounded-full blur-[80px] transition-all duration-1000 -z-10 animate-float-medium ${activePreview.blobColors[1]}`}></div>

      {/* Main Container */}
      <main class="max-w-6xl mx-auto px-4 pt-16 pb-24 flex-grow flex flex-col items-center">
        
        {/* HERO SECTION */}
        <section class="text-center max-w-4xl mx-auto flex flex-col items-center mb-16">
          {/* Animated Badge */}
          <div class="animate-fade-in inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-pink-50 text-pink-600 text-xs font-black shadow-clay-sm border border-pink-100/50 mb-6">
            <Sparkles class="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} /> Welcome to MoodBuddy
          </div>

          {/* Hero Headline */}
          <h1 class="animate-slide-up text-4xl sm:text-6xl font-black tracking-tight text-slate-800 font-display leading-[1.15] max-w-3xl">
            Your friendly space to check in, reflect, and{' '}
            <span class="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 bg-clip-text text-transparent">
              find comfort
            </span>
          </h1>

          <p class="animate-slide-up text-sm sm:text-base text-slate-500 max-w-lg mt-6 leading-relaxed">
            MoodBuddy is a warm, interactive space designed to help you process feelings. Tell us how your day is, read comforting words, and try simple mini-games to lift your mood.
          </p>

          {/* Call to Actions */}
          <div class="animate-slide-up flex flex-wrap items-center justify-center gap-4 mt-10">
            <Link
              to="/dashboard"
              class="flex items-center gap-2 px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-100 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span>Go to Dashboard</span>
              <ArrowRight class="w-5 h-5" />
            </Link>
            
            <Link
              to="/checkin"
              class="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl border border-slate-200 shadow-clay-btn hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Check In Now
            </Link>
          </div>
        </section>

        {/* EMOJI MOOD PREVIEWER (Tactile & Pinkish) */}
        <section class="w-full max-w-2xl mb-24 animate-fade-in">
          <div class="clay-card p-6 md:p-8 bg-white/75 border-white/60">
            <h3 class="text-xs font-bold text-pink-500 uppercase tracking-widest mb-3 text-center">Interactive Vibe Tester</h3>
            <h4 class="text-lg font-black text-slate-800 mb-6 text-center">How are you feeling at this moment?</h4>
            
            {/* Row of Emojis */}
            <div class="flex justify-center items-center gap-3 sm:gap-6 mb-8">
              {PREVIEW_MOODS.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActivePreview(item)}
                  class={`text-4xl sm:text-5xl p-2.5 rounded-2xl transition-all bounce-hover ${
                    activePreview.name === item.name
                      ? 'bg-white border-2 border-pink-400 scale-110 shadow-clay-md'
                      : 'hover:bg-white/40'
                  }`}
                  title={`Preview: ${item.name}`}
                >
                  {item.emoji}
                </button>
              ))}
            </div>

            {/* Simulated Response Bubble */}
            <div class={`clay-card-flat p-5 border text-left flex gap-4 items-start transition-all duration-500 animate-scale-up ${activePreview.textColor}`}>
              <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-clay-sm flex-shrink-0">
                🦊
              </div>
              <div>
                <div class="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1">MoodBuddy Companion</div>
                <p class="text-xs sm:text-sm font-medium leading-relaxed">
                  "{activePreview.quote}"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PLAYFUL DAILY CHECKLIST SECTION (New!) */}
        <section class="w-full max-w-2xl mb-24 animate-fade-in">
          <div class="clay-card p-6 md:p-8 bg-white/70 border-white/60">
            <div class="flex items-center gap-2 mb-3 justify-center">
              <CheckCircle2 class="w-6 h-6 text-pink-500" />
              <h3 class="text-lg font-black text-slate-800 font-display">Daily Self-Care Checkoff</h3>
            </div>
            <p class="text-xs text-slate-500 text-center mb-8 max-w-sm mx-auto">
              Small actions build happy minds. Complete all four items for a tiny burst of joy!
            </p>

            <div class="flex flex-col gap-3">
              {SELF_CARE_ITEMS.map((item) => {
                const isChecked = checkedItems[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    class={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
                      isChecked
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-inner translate-y-[1px]'
                        : 'bg-white border-slate-100 hover:border-pink-200 text-slate-700 shadow-clay-sm hover:scale-[1.01]'
                    }`}
                  >
                    <div class={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                    }`}>
                      {isChecked && <span class="text-xs">✓</span>}
                    </div>
                    <span class={`text-xs sm:text-sm font-semibold ${isChecked ? 'line-through opacity-75' : ''}`}>
                      {item.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section class="w-full mb-24 animate-fade-in">
          <h2 class="text-2xl font-black text-slate-800 text-center mb-4">How MoodBuddy Works</h2>
          <p class="text-xs text-slate-500 text-center max-w-sm mx-auto mb-12">
            A simple, friendly three-step check-in routine designed to keep your mind supported.
          </p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  class="clay-card p-6 text-left hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 border-white/60 bg-white/70"
                >
                  <div class={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-clay-sm ${step.color.replace('rose', 'pink').replace('violet', 'pink')}`}>
                    <Icon class="w-6 h-6 text-pink-500" />
                  </div>
                  <h3 class="font-bold text-slate-800 text-base mb-2">{step.title}</h3>
                  <p class="text-xs text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* WHY PAUSING MATTERS SECTION (New!) */}
        <section class="w-full mb-24 animate-fade-in bg-pink-500/5 rounded-3xl p-8 border border-pink-100">
          <div class="flex items-center gap-2 mb-6 justify-center">
            <BookOpen class="w-6 h-6 text-pink-500" />
            <h2 class="text-2xl font-black text-slate-800 text-center">Why Small Pauses Matter</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white/80 p-5 rounded-2xl border border-white">
              <h3 class="font-bold text-slate-800 text-sm mb-2 flex items-center gap-1">
                <span>🌬️</span> Micro-Breathing
              </h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                Stopping for just 60 seconds to practice rhythmic breathing stimulates the vagus nerve, signaling your nervous system to calm down instantly.
              </p>
            </div>
            
            <div class="bg-white/80 p-5 rounded-2xl border border-white">
              <h3 class="font-bold text-slate-800 text-sm mb-2 flex items-center gap-1">
                <span>🎨</span> Doodling & Flow
              </h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                Creative drawing activates your brain's default mode network. It allows your thoughts to wander freely, releasing locked stress and emotion.
              </p>
            </div>

            <div class="bg-white/80 p-5 rounded-2xl border border-white">
              <h3 class="font-bold text-slate-800 text-sm mb-2 flex items-center gap-1">
                <span>🎵</span> Sound Grounding
              </h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                Calming beats like lo-fi and rain sounds mask sharp, distracting ambient noises, helping you ground yourself and focus on the present moment.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION SECTION (New!) */}
        <section class="w-full max-w-2xl mb-12 animate-fade-in">
          <h2 class="text-2xl font-black text-slate-800 text-center mb-8">Frequently Asked Questions</h2>
          
          <div class="flex flex-col gap-3">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} class="clay-card overflow-hidden bg-white/70 border-white/60 transition-all duration-300">
                  <button
                    onClick={() => toggleFaq(idx)}
                    class="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-slate-700 hover:bg-slate-50/50"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown class={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {isOpen && (
                    <div class="px-5 pb-5 text-xs text-slate-500 leading-relaxed border-t border-slate-100/50 pt-3 animate-slide-up">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer class="w-full bg-slate-50 border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} MoodBuddy College Project. Build with ❤️.</p>
          <p class="max-w-sm sm:text-right">
            <strong>Disclaimer:</strong> MoodBuddy is a light-hearted, non-clinical supportive exercise tool. It is not intended for medical diagnoses or mental health crises.
          </p>
        </div>
      </footer>
    </div>
  );
}
