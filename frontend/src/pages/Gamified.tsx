import React, { useState, useEffect } from 'react';
import { CheckCircle, Target, Calendar, Heart, Brain, Sun } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  icon: React.ReactNode;
  category: 'mood' | 'wellness' | 'mindfulness';
}

interface ChallengeProgress {
  [key: string]: {
    completed: boolean;
    progress: number;
    completedAt?: string;
  };
}

const GamifiedChallenges: React.FC = () => {
  const [progress, setProgress] = useState<ChallengeProgress>({});

  const challenges: Challenge[] = [
    {
      id: 'mood-tracker',
      title: 'Daily Mood Check',
      description: 'Write your mood 5 days in a row',
      target: 5,
      icon: <Heart className="w-6 h-6" />,
      category: 'mood'
    },
    {
      id: 'mindful-minutes',
      title: 'Mindful Moments',
      description: 'Practice mindfulness for 3 consecutive days',
      target: 3,
      icon: <Brain className="w-6 h-6" />,
      category: 'mindfulness'
    },
    {
      id: 'gratitude-journal',
      title: 'Gratitude Practice',
      description: "Write 3 things you're grateful for, 7 days",
      target: 7,
      icon: <Sun className="w-6 h-6" />,
      category: 'wellness'
    },
    {
      id: 'wellness-goals',
      title: 'Weekly Wellness',
      description: 'Complete wellness check-in 4 times',
      target: 4,
      icon: <Target className="w-6 h-6" />,
      category: 'wellness'
    },
    {
      id: 'reflection-time',
      title: 'Self Reflection',
      description: 'Journal your thoughts for 5 days',
      target: 5,
      icon: <Calendar className="w-6 h-6" />,
      category: 'mood'
    },
    {
      id: 'breathing-exercise',
      title: 'Breathing Practice',
      description: 'Complete breathing exercises 6 times',
      target: 6,
      icon: <Brain className="w-6 h-6" />,
      category: 'mindfulness'
    }
  ];

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('challenge-progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('challenge-progress', JSON.stringify(progress));
  }, [progress]);

  const handleProgressUpdate = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const currentProgress = progress[challengeId] || { completed: false, progress: 0 };
    const newProgress = Math.min(currentProgress.progress + 1, challenge.target);
    const isCompleted = newProgress >= challenge.target;

    setProgress(prev => ({
      ...prev,
      [challengeId]: {
        ...currentProgress,
        progress: newProgress,
        completed: isCompleted,
        completedAt: isCompleted ? new Date().toISOString() : currentProgress.completedAt
      }
    }));
  };

  const resetChallenge = (challengeId: string) => {
    setProgress(prev => ({
      ...prev,
      [challengeId]: {
        completed: false,
        progress: 0
      }
    }));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mood': return 'from-amber-50 to-orange-50 border-amber-200';
      case 'wellness': return 'from-green-50 to-emerald-50 border-green-200';
      case 'mindfulness': return 'from-teal-50 to-cyan-50 border-teal-200';
      default: return 'from-stone-50 to-gray-50 border-stone-200';
    }
  };

  const getCategoryIconColor = (category: string) => {
    switch (category) {
      case 'mood': return 'text-amber-600';
      case 'wellness': return 'text-green-600';
      case 'mindfulness': return 'text-teal-600';
      default: return 'text-stone-600';
    }
  };

  const getProgressBarColor = (category: string) => {
    switch (category) {
      case 'mood': return 'bg-amber-400';
      case 'wellness': return 'bg-green-400';
      case 'mindfulness': return 'bg-teal-400';
      default: return 'bg-stone-400';
    }
  };

  return (
    <div className="min-h-screen bg-orange-25 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-2">Wellness Challenges</h1>
          <p className="text-stone-600">Complete daily challenges to build healthy habits</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-stone-600">Completed</p>
                <p className="text-2xl font-bold text-stone-800">
                  {Object.values(progress).filter(p => p.completed).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Target className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-stone-600">In Progress</p>
                <p className="text-2xl font-bold text-stone-800">
                  {Object.values(progress).filter(p => p.progress > 0 && !p.completed).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Calendar className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-stone-600">Total Challenges</p>
                <p className="text-2xl font-bold text-stone-800">{challenges.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => {
            const challengeProgress = progress[challenge.id] || { completed: false, progress: 0 };
            const progressPercentage = (challengeProgress.progress / challenge.target) * 100;

            return (
              <div
                key={challenge.id}
                className={`relative overflow-hidden rounded-xl border-2 bg-gradient-to-br ${getCategoryColor(challenge.category)} transition-all duration-300 hover:shadow-lg hover:scale-105`}
              >
                {/* Completion Badge */}
                {challengeProgress.completed && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-green-500 text-white rounded-full p-2 shadow-lg">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Challenge Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-white shadow-sm ${getCategoryIconColor(challenge.category)}`}>
                      {challenge.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-stone-800 text-lg mb-1">
                        {challenge.title}
                      </h3>
                      <p className="text-stone-600 text-sm leading-relaxed">
                        {challenge.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-stone-700">
                        Progress: {challengeProgress.progress}/{challenge.target}
                      </span>
                      <span className="text-sm font-semibold text-stone-800">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full ${getProgressBarColor(challenge.category)} rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>

                    {/* Completion Status */}
                    {challengeProgress.completed ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700">Completed!</span>
                        </div>
                        <button
                          onClick={() => resetChallenge(challenge.id)}
                          className="text-xs text-stone-500 hover:text-stone-700 underline"
                        >
                          Reset
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleProgressUpdate(challenge.id)}
                          className="flex-1 bg-white hover:bg-stone-50 text-stone-700 font-medium py-2 px-4 rounded-lg border border-stone-200 transition-colors duration-200"
                        >
                          Mark Progress +1
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Message */}
        <div className="text-center mt-12 p-6 bg-white rounded-xl border border-stone-200">
          <p className="text-stone-600">
            Build healthy habits one step at a time. Every small action counts towards your wellness journey! 🌱
          </p>
        </div>
      </div>
    </div>
  );
};

export default GamifiedChallenges;