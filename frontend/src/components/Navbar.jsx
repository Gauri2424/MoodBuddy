import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Home, Sparkles, Smile, User2, Menu, X } from 'lucide-react';
import { profileService } from '../services/api';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [avatar, setAvatar] = useState('🦊');

  // Load profile avatar dynamically on render / page changes
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await profileService.get();
        if (res.success && res.profile) {
          setAvatar(res.profile.avatar);
        }
      } catch (err) {
        console.warn('Navbar failed to load profile avatar:', err.message);
      }
    };
    loadProfile();
  }, [location.pathname]); // Update avatar when navigating

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Check In', path: '/checkin', icon: Smile },
    { name: 'Activities', path: '/activities', icon: Sparkles },
    { name: 'Profile', path: '/profile', icon: User2 },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav class="sticky top-4 z-50 max-w-7xl mx-auto px-4 w-full">
      <div class="clay-card px-6 py-4 flex items-center justify-between bg-white/80 border-white/60">
        {/* Logo */}
        <Link to="/dashboard" class="flex items-center gap-2 group">
          <div class="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center shadow-clay-sm group-hover:scale-105 transition-transform duration-200">
            <Heart class="w-5 h-5 text-violet-500 fill-violet-400 animate-pulse" />
          </div>
          <span class="font-display font-semibold text-lg tracking-tight bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
            MoodBuddy
          </span>
        </Link>

        {/* Desktop Links */}
        <div class="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                class={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-violet-500 text-white shadow-clay-btn scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon class="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          
          {/* Quick Profile Circle */}
          <Link
            to="/profile"
            class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg border border-white hover:scale-105 transition-transform duration-200 ml-2"
          >
            {avatar}
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          class="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X class="w-6 h-6" /> : <Menu class="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div class="md:hidden mt-2 clay-card p-4 bg-white/95 flex flex-col gap-2 border-white/60 animate-scale-up">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                class={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  active
                    ? 'bg-violet-500 text-white shadow-clay-btn'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon class="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div class="h-[1px] bg-slate-100 my-2"></div>
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm"
          >
            <span class="text-xl">{avatar}</span>
            <span>View Profile Details</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
