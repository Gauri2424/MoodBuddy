import React, { useState, useEffect } from 'react';
import { User, Award, Flame, Calendar, Save, CheckCircle } from 'lucide-react';
import { profileService } from '../services/api';

const AVATAR_OPTIONS = ['🦊', '🦁', '🐻', '🐼', '🐨', '🐱', '🐶', '🐸', '🦄', '🐰', '🐯', '🦉'];

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await profileService.get();
        if (data.success) {
          setProfile(data.profile);
          setName(data.profile.name);
          setAvatar(data.profile.avatar);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to connect to the backend server.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSaving(true);
      setError('');
      setSuccessMsg('');
      const data = await profileService.update({ name: name.trim(), avatar });
      if (data.success) {
        setProfile(data.profile);
        setSuccessMsg('Profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div class="max-w-xl mx-auto px-4 py-20 flex justify-center items-center">
        <div class="flex flex-col items-center gap-4">
          <div class="w-10 h-10 rounded-full border-4 border-slate-200 border-t-violet-600 animate-spin"></div>
          <span class="text-xs font-bold text-slate-400">Loading profile metrics...</span>
        </div>
      </div>
    );
  }

  const joinDate = profile ? new Date(profile.createdAt).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : '';

  return (
    <div class="max-w-xl mx-auto px-4 py-8 flex flex-col gap-6 animate-fade-in">
      {/* Profile Metrics Overview */}
      <div class="clay-card p-6 md:p-8 bg-gradient-to-br from-violet-500/10 via-pink-500/10 to-transparent border-white/60 text-center">
        <div class="w-24 h-24 rounded-full bg-white flex items-center justify-center text-5xl shadow-clay-lg mx-auto mb-4 border border-white">
          {profile?.avatar}
        </div>
        <h2 class="text-2xl font-black text-slate-800 font-display">{profile?.name}</h2>
        <div class="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">
          <User class="w-3.5 h-3.5" /> Registered Student Profile
        </div>

        {/* Dynamic HUD stat display */}
        <div class="grid grid-cols-3 gap-3 mt-8 text-center bg-white/50 p-4 rounded-3xl border border-white/40 shadow-clay-sm">
          <div class="flex flex-col items-center justify-center">
            <Flame class="w-5 h-5 text-orange-500 fill-orange-400 mb-1" />
            <span class="text-lg font-black text-slate-800">{profile?.streak}</span>
            <span class="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Day Streak</span>
          </div>

          <div class="flex flex-col items-center justify-center border-x border-slate-200/50">
            <Award class="w-5 h-5 text-violet-500 mb-1" />
            <span class="text-lg font-black text-slate-800">{profile?.totalCheckIns}</span>
            <span class="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Check-ins</span>
          </div>

          <div class="flex flex-col items-center justify-center">
            <Calendar class="w-5 h-5 text-emerald-500 mb-1" />
            <span class="text-[10px] font-black text-slate-800 leading-tight truncate max-w-full px-1">
              {joinDate.split(',')[0]}
            </span>
            <span class="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Join Date</span>
          </div>
        </div>
      </div>

      {/* Editing Form */}
      <div class="clay-card p-6 md:p-8 bg-white/70 border-white/60">
        <h3 class="text-lg font-bold text-slate-800 mb-6">Edit Profile</h3>

        <form onSubmit={handleSave} class="flex flex-col gap-6">
          {/* Success / Error Banners */}
          {successMsg && (
            <div class="flex items-center gap-2 text-emerald-600 bg-emerald-50/50 border border-emerald-100 rounded-2xl py-3 px-4 text-xs font-bold animate-scale-up">
              <CheckCircle class="w-4.5 h-4.5" /> {successMsg}
            </div>
          )}
          {error && (
            <div class="text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl py-3 px-4 text-xs font-bold animate-scale-up">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-wide">Profile Nickname</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={30}
              class="w-full p-3.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-sm text-slate-700 bg-white/50"
              required
            />
          </div>

          {/* Avatar Grids */}
          <div class="flex flex-col gap-2.5">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-wide">Choose Buddy Avatar</label>
            <div class="grid grid-cols-6 gap-3">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setAvatar(emoji)}
                  class={`text-3xl p-2 rounded-2xl border transition-all hover:scale-110 active:scale-90 ${
                    avatar === emoji
                      ? 'bg-violet-50 border-violet-300 ring-2 ring-violet-500 ring-offset-2 scale-105 shadow-clay-sm'
                      : 'bg-white/40 border-slate-200/50 shadow-clay-sm'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving || !name.trim()}
            class="flex items-center justify-center gap-2 w-full py-4 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 text-white font-bold rounded-2xl shadow-md shadow-violet-100 hover:shadow-lg transition-all mt-2"
          >
            <Save class="w-4.5 h-4.5" />
            <span>{saving ? 'Saving changes...' : 'Save Profile Details'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
