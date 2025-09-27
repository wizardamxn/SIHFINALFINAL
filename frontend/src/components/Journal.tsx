import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Heart, Plus, BookOpen, BarChart3, List } from 'lucide-react';

interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-5 scale
  moodEmoji: string;
  moodLabel: string;
  note?: string;
  timestamp: number;
}

const MoodJournal: React.FC = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [currentMood, setCurrentMood] = useState<number>(3);
  const [currentNote, setCurrentNote] = useState<string>('');
  const [viewMode, setViewMode] = useState<'form' | 'history'>('form');
  const [displayType, setDisplayType] = useState<'list' | 'chart'>('list');

  const moodOptions = [
    { value: 1, emoji: '😢', label: 'Very Sad', color: 'bg-blue-500' },
    { value: 2, emoji: '😔', label: 'Sad', color: 'bg-blue-400' },
    { value: 3, emoji: '😐', label: 'Neutral', color: 'bg-amber-500' },
    { value: 4, emoji: '😊', label: 'Happy', color: 'bg-green-400' },
    { value: 5, emoji: '😄', label: 'Very Happy', color: 'bg-green-500' }
  ];

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('mood-journal-entries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('mood-journal-entries', JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedMood = moodOptions.find(m => m.value === currentMood)!;
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];

    // Check if there's already an entry for today
    const existingEntryIndex = entries.findIndex(entry => entry.date === dateString);

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: dateString,
      mood: currentMood,
      moodEmoji: selectedMood.emoji,
      moodLabel: selectedMood.label,
      note: currentNote.trim() || undefined,
      timestamp: Date.now()
    };

    if (existingEntryIndex >= 0) {
      // Update existing entry for today
      const updatedEntries = [...entries];
      updatedEntries[existingEntryIndex] = newEntry;
      setEntries(updatedEntries);
    } else {
      // Add new entry
      setEntries([...entries, newEntry]);
    }

    // Reset form
    setCurrentNote('');
    setViewMode('history');
  };

  const getLast7Days = (): MoodEntry[] => {
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const entry = entries.find(e => e.date === dateString);
      if (entry) {
        last7Days.push(entry);
      }
    }

    return last7Days.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTodaysEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    return entries.find(entry => entry.date === today);
  };

  const getAverageMood = (entries: MoodEntry[]) => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, entry) => acc + entry.mood, 0);
    return (sum / entries.length).toFixed(1);
  };

  const last7DaysEntries = getLast7Days();
  const todaysEntry = getTodaysEntry();

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-stone-800">Mood Journal</h1>
          </div>
          <p className="text-stone-600">Track your daily emotions and discover patterns</p>
        </div>

        {/* Navigation */}
        <div className="flex mb-8">
          <button
            onClick={() => setViewMode('form')}
            className={`flex-1 py-3 px-6 font-medium rounded-l-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
              viewMode === 'form'
                ? 'bg-green-600 text-white'
                : 'bg-white text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`flex-1 py-3 px-6 font-medium rounded-r-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
              viewMode === 'history'
                ? 'bg-green-600 text-white'
                : 'bg-white text-stone-600 hover:bg-stone-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            View History
          </button>
        </div>

        {/* Mood Entry Form */}
        {viewMode === 'form' && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-stone-200 mb-6">
            {todaysEntry && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Already logged today:</strong> {todaysEntry.moodEmoji} {todaysEntry.moodLabel}
                  {todaysEntry.note && ` - "${todaysEntry.note}"`}
                </p>
                <p className="text-xs text-blue-600 mt-1">Submitting will update today's entry.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-stone-800 mb-6">How are you feeling today?</h2>

                {/* Emoji Picker */}
                <div className="grid grid-cols-5 gap-4 mb-6">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setCurrentMood(mood.value)}
                      className={`p-4 rounded-xl transition-all duration-200 border-2 ${
                        currentMood === mood.value
                          ? 'border-green-500 bg-green-50 scale-110'
                          : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{mood.emoji}</div>
                      <div className="text-xs font-medium text-stone-700">{mood.label}</div>
                    </button>
                  ))}
                </div>

                {/* Mood Scale Indicator */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-stone-600">Very Sad</span>
                    <span className="text-sm font-semibold text-stone-800">
                      {moodOptions.find(m => m.value === currentMood)?.label}
                    </span>
                    <span className="text-sm text-stone-600">Very Happy</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        moodOptions.find(m => m.value === currentMood)?.color
                      }`}
                      style={{ width: `${(currentMood / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Optional Note */}
              <div>
                <label htmlFor="note" className="block text-sm font-medium text-stone-700 mb-2">
                  Add a note (optional)
                </label>
                <textarea
                  id="note"
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  className="w-full px-3 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="What's on your mind? Any specific events or feelings you'd like to remember..."
                  maxLength={200}
                />
                <div className="text-xs text-stone-500 mt-1">{currentNote.length}/200 characters</div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                {todaysEntry ? "Update Today's Entry": 'Save Mood Entry'}
              </button>
            </form>
          </div>
        )}

        {/* History View */}
        {viewMode === 'history' && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-stone-600">Average Mood (7 days)</p>
                    <p className="text-lg font-bold text-stone-800">{getAverageMood(last7DaysEntries)}/5.0</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-stone-600">Entries This Week</p>
                    <p className="text-lg font-bold text-stone-800">{last7DaysEntries.length}/7</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-stone-600">Total Entries</p>
                    <p className="text-lg font-bold text-stone-800">{entries.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Display Toggle */}
            <div className="flex justify-center">
              <div className="flex bg-white rounded-lg shadow-sm border border-stone-200 p-1">
                <button
                  onClick={() => setDisplayType('list')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                    displayType === 'list'
                      ? 'bg-green-100 text-green-700'
                      : 'text-stone-600 hover:text-stone-800'
                  }`}
                >
                  <List className="w-4 h-4" />
                  List View
                </button>
                <button
                  onClick={() => setDisplayType('chart')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                    displayType === 'chart'
                      ? 'bg-green-100 text-green-700'
                      : 'text-stone-600 hover:text-stone-800'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Chart View
                </button>
              </div>
            </div>

            {/* Last 7 Days Display */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
              <h3 className="text-lg font-semibold text-stone-800 mb-4">Last 7 Days</h3>

              {last7DaysEntries.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                  <p className="text-stone-600">No mood entries yet. Start tracking your mood today!</p>
                </div>
              ) : displayType === 'list' ? (
                <div className="space-y-4">
                  {last7DaysEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg">
                      <div className="text-3xl">{entry.moodEmoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-stone-800">{entry.moodLabel}</span>
                          <span className="text-sm text-stone-500">({entry.mood}/5)</span>
                        </div>
                        <div className="text-sm text-stone-600 mb-1">{formatDate(entry.date)}</div>
                        {entry.note && (
                          <div className="text-sm text-stone-600 italic">"{entry.note}"</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Simple Chart */}
                  <div className="space-y-2">
                    {last7DaysEntries.map((entry) => (
                      <div key={entry.id} className="flex items-center gap-3">
                        <div className="w-20 text-sm text-stone-600">{formatDate(entry.date)}</div>
                        <div className="flex-1 bg-stone-200 rounded-full h-6 relative">
                          <div
                            className={`h-6 rounded-full ${moodOptions.find(m => m.value === entry.mood)?.color} transition-all duration-300 flex items-center justify-center`}
                            style={{ width: `${(entry.mood / 5) * 100}%` }}
                          >
                            <span className="text-xs font-medium text-white">{entry.mood}/5</span>
                          </div>
                        </div>
                        <div className="w-8 text-lg">{entry.moodEmoji}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodJournal;