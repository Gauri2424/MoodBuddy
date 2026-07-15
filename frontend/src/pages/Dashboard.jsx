import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Filler, 
  Legend 
} from 'chart.js';
import { Smile, Calendar, Sparkles, Flame, CheckCircle2, ChevronRight, BarChart } from 'lucide-react';
import { profileService, moodService } from '../services/api';

// Register ChartJS plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const MOOD_SCORES = {
  'Very Happy': 5,
  'Happy': 4,
  'Neutral': 3,
  'Tired': 2,
  'Sad': 1,
  'Stressed': 1,
  'Angry': 1,
  'Anxious': 1,
};

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

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkedInToday, setCheckedInToday] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Load profile and stats
        const profileData = await profileService.get();
        if (profileData.success) {
          setProfile(profileData.profile);
        }

        // Load 30 day history
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
          <div class="w-12 h-12 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin"></div>
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

  // Format Chart data chronologically (oldest to newest)
  const chartEntries = [...history].reverse();
  const labels = chartEntries.map(e => {
    const date = new Date(e.createdAt);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  const dataPoints = chartEntries.map(e => MOOD_SCORES[e.mood] || 3);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Mood Level',
        data: dataPoints,
        fill: true,
        borderColor: '#8B5CF6', // Violet 500
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.35,
        pointBackgroundColor: '#8B5CF6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const score = context.raw;
            const moodName = Object.keys(MOOD_SCORES).find(key => MOOD_SCORES[key] === score);
            return ` Mood: ${moodName || 'Neutral'} (${score}/5)`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: (value) => {
            if (value === 5) return '😆 Very Happy';
            if (value === 4) return '😊 Happy';
            if (value === 3) return '😐 Neutral';
            if (value === 2) return '🥱 Tired';
            if (value === 1) return '😢 Sad';
            return '';
          },
          font: { size: 10 }
        },
        grid: { color: 'rgba(0, 0, 0, 0.03)' }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } }
      }
    }
  };

  const latestEntry = history[0];

  return (
    <div class="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8 animate-fade-in">
      {/* Top Greeting Block */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <div class="md:col-span-2 clay-card p-6 md:p-8 bg-gradient-to-r from-violet-500/10 to-pink-500/10 border-white/60 flex items-center justify-between">
          <div>
            <h2 class="text-2xl md:text-3xl font-black text-slate-800 font-display">
              Hey {profile?.name || 'Buddy'}! {profile?.avatar}
            </h2>
            <p class="text-sm text-slate-500 mt-2">
              {checkedInToday 
                ? "You have checked in today! Scroll down to see your analysis."
                : "Welcome back! Take a second to check in and share how you are feeling."}
            </p>
            {!checkedInToday && (
              <Link
                to="/checkin"
                class="inline-flex items-center gap-1.5 px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-violet-100 hover:shadow-lg transition-all mt-5"
              >
                <span>Check In Now</span>
                <ChevronRight class="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Stats Column */}
        <div class="grid grid-cols-2 gap-4">
          {/* Streak Card */}
          <div class="clay-card p-5 bg-white/70 flex flex-col justify-between border-white/60">
            <div class="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-clay-sm">
              <Flame class="w-4.5 h-4.5 fill-current" />
            </div>
            <div>
              <div class="text-2xl font-black text-slate-800 mt-4">{profile?.streak || 0}</div>
              <div class="text-xs font-semibold text-slate-400 mt-0.5">Day Streak</div>
            </div>
          </div>

          {/* Total Logs Card */}
          <div class="clay-card p-5 bg-white/70 flex flex-col justify-between border-white/60">
            <div class="w-8 h-8 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shadow-clay-sm">
              <Smile class="w-4.5 h-4.5" />
            </div>
            <div>
              <div class="text-2xl font-black text-slate-800 mt-4">{profile?.totalCheckIns || 0}</div>
              <div class="text-xs font-semibold text-slate-400 mt-0.5">Total Logs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkin and Chart Section */}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today status panel */}
        <div class="clay-card p-6 bg-white/70 border-white/60 flex flex-col justify-between">
          <div class="mb-6">
            <h3 class="text-lg font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 class="w-5 h-5 text-violet-500" /> Today's Check-In
            </h3>
            <div class="h-[1px] bg-slate-100 my-3"></div>

            {checkedInToday && latestEntry ? (
              <div class="bg-violet-50/50 rounded-2xl p-4 border border-violet-100/50">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">{MOOD_EMOJIS[latestEntry.mood]}</span>
                  <div>
                    <h4 class="font-bold text-slate-800 text-sm">{latestEntry.mood}</h4>
                    <span class="text-[10px] text-slate-400">
                      Logged {new Date(latestEntry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <p class="text-xs text-slate-600 mt-3 line-clamp-4 italic border-l-2 border-violet-300 pl-3">
                  "{latestEntry.aiSummary.substring(0, 150)}..."
                </p>
                <Link
                  to="/activities"
                  class="flex items-center gap-1 mt-4 text-xs font-bold text-violet-600 hover:text-violet-700"
                >
                  <Sparkles class="w-3.5 h-3.5" /> Open relaxing activities
                </Link>
              </div>
            ) : (
              <div class="text-center py-6 text-slate-500 text-sm">
                <span class="text-3xl block mb-2">🌱</span>
                You haven't recorded a mood for today yet.
              </div>
            )}
          </div>
          
          {!checkedInToday && (
            <Link
              to="/checkin"
              class="w-full text-center py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all"
            >
              Start Mood Check-In
            </Link>
          )}
        </div>

        {/* Chart Panel */}
        <div class="lg:col-span-2 clay-card p-6 bg-white/70 border-white/60 flex flex-col">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-slate-800 flex items-center gap-1.5">
              <BarChart class="w-5 h-5 text-violet-500" /> Mood Trend (Last 30 Logs)
            </h3>
            <span class="text-[10px] bg-slate-100 text-slate-500 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Line Graph
            </span>
          </div>

          <div class="h-[250px] w-full flex-1">
            {history.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div class="h-full flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
                <Calendar class="w-10 h-10 text-slate-300" />
                <span>No history available yet. Logs will plot here as you check in.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History table list */}
      <div class="clay-card p-6 bg-white/70 border-white/60">
        <h3 class="text-lg font-bold text-slate-800 mb-4">Recent History</h3>
        
        {history.length > 0 ? (
          <div class="overflow-x-auto no-scrollbar">
            <table class="w-full text-left text-sm border-collapse">
              <thead>
                <tr class="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
                  <th class="py-3 px-4">Date</th>
                  <th class="py-3 px-4">Mood</th>
                  <th class="py-3 px-4">Color</th>
                  <th class="py-3 px-4">Tags</th>
                  <th class="py-3 px-4">Personal Note</th>
                  <th class="py-3 px-4">Comfort Summary</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50 text-xs text-slate-600">
                {history.slice(0, 5).map((entry) => (
                  <tr key={entry.id} class="hover:bg-slate-50/50 transition-colors">
                    <td class="py-4 px-4 font-medium text-slate-500 whitespace-nowrap">
                      {new Date(entry.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: '2-digit',
                      })}
                    </td>
                    <td class="py-4 px-4 whitespace-nowrap">
                      <span class="inline-flex items-center gap-1 bg-slate-100 py-1 px-2.5 rounded-full font-bold text-slate-700">
                        <span>{MOOD_EMOJIS[entry.mood]}</span>
                        <span>{entry.mood}</span>
                      </span>
                    </td>
                    <td class="py-4 px-4 whitespace-nowrap">
                      <span class="inline-flex items-center gap-1.5">
                        <span
                          class="w-3 h-3 rounded-full shadow-sm"
                          style={{
                            backgroundColor:
                              entry.color === 'Yellow' ? '#FFD966' :
                              entry.color === 'Blue' ? '#6C9BCF' :
                              entry.color === 'Purple' ? '#A78BFA' :
                              entry.color === 'Green' ? '#81C784' :
                              entry.color === 'Pink' ? '#F48FB1' :
                              entry.color === 'Orange' ? '#FFB74D' :
                              entry.color === 'Gray' ? '#B0BEC5' :
                              entry.color === 'Red' ? '#E57373' : '#B0BEC5',
                          }}
                        ></span>
                        <span>{entry.color}</span>
                      </span>
                    </td>
                    <td class="py-4 px-4 max-w-[150px] truncate">
                      {entry.tags.join(', ')}
                    </td>
                    <td class="py-4 px-4 max-w-[150px] truncate italic text-slate-400">
                      {entry.note ? `"${entry.note}"` : '—'}
                    </td>
                    <td class="py-4 px-4 max-w-sm truncate text-slate-500">
                      {entry.aiSummary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div class="text-center py-10 text-slate-400 text-sm">
            You haven't completed any mood checks yet. Start your first log!
          </div>
        )}
      </div>
    </div>
  );
}
