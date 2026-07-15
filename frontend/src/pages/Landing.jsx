import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Shield, BarChart3, ArrowRight } from 'lucide-react';

export default function Landing() {
  const steps = [
    {
      title: 'Check In',
      description: 'Log your mood, choose a color, and pick feelings tags that represent your energy today.',
      icon: Heart,
      color: 'bg-rose-100 text-rose-600',
    },
    {
      title: 'Get AI Support',
      description: 'Receive a supportive, encouragement summary streamed to your screen from our non-clinical AI companion.',
      icon: Sparkles,
      color: 'bg-violet-100 text-violet-600',
    },
    {
      title: 'Play & Relax',
      description: 'Try calming activities like interactive breathing exercises, canvas doodle sketching, and music suggestions.',
      icon: Shield,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'Analyze Trends',
      description: 'View a beautiful history chart tracking your mood scores and entries over the last 7 to 30 days.',
      icon: BarChart3,
      color: 'bg-sky-100 text-sky-600',
    },
  ];

  return (
    <div class="relative overflow-hidden min-h-screen flex flex-col justify-between">
      {/* Decorative ambient blobs */}
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-violet-200/40 rounded-full blur-3xl -z-10"></div>
      <div class="absolute bottom-1/4 right-10 w-80 h-80 bg-pink-100/40 rounded-full blur-3xl -z-10"></div>

      {/* Main Container */}
      <main class="max-w-6xl mx-auto px-4 pt-16 pb-24 flex-1 flex flex-col items-center justify-center text-center">
        {/* Animated Badge */}
        <div class="animate-fade-in inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-violet-50 text-violet-600 text-xs font-bold shadow-clay-sm border border-violet-100/50 mb-6">
          <Sparkles class="w-3.5 h-3.5" /> Welcome to MoodBuddy
        </div>

        {/* Hero Headline */}
        <h1 class="animate-slide-up text-4xl sm:text-6xl font-black tracking-tight text-slate-800 font-display leading-[1.15] max-w-3xl">
          Your friendly space to check in, reflect, and{' '}
          <span class="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
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
            class="flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl shadow-lg shadow-violet-200 hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[1px] transition-all"
          >
            <span>Go to Dashboard</span>
            <ArrowRight class="w-5 h-5" />
          </Link>
          
          <Link
            to="/checkin"
            class="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl border border-slate-200/80 shadow-clay-btn hover:translate-y-[-2px] active:translate-y-[1px] transition-all"
          >
            Check In Now
          </Link>
        </div>

        {/* Features Walkthrough Grid */}
        <div class="animate-fade-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-24">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                class="clay-card p-6 text-left hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 border-white/60"
              >
                <div class={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-clay-sm ${step.color}`}>
                  <Icon class="w-6 h-6" />
                </div>
                <h3 class="font-bold text-slate-800 text-base mb-2">{step.title}</h3>
                <p class="text-xs text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </main>

      {/* Basic non-clinical disclaimer footer */}
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
