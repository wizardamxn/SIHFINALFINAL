import React, { useState, useEffect } from 'react';
import { Heart, Headphones, BookOpen, Wind, Coffee, Phone, Users, Smile, CheckCircle, RefreshCw } from 'lucide-react';

interface CopingStrategy {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  category: 'breathing' | 'movement' | 'creative' | 'social' | 'mindfulness' | 'distraction';
}

interface MoodStrategies {
  [key: string]: CopingStrategy[];
}

const CopingStrategies: React.FC<{ 
  mood?: string; 
  moodValue?: number; 
  onClose?: () => void;
  standalone?: boolean;
}> = ({ 
  mood = 'sad', 
  moodValue = 2, 
  onClose,
  standalone = true 
}) => {
  const [completedStrategies, setCompletedStrategies] = useState<string[]>([]);
  const [currentMood, setCurrentMood] = useState(mood);

  const allStrategies: CopingStrategy[] = [
    // Breathing & Relaxation
    {
      id: 'deep-breathing',
      title: 'Take 5 Deep Breaths',
      description: 'Breathe in for 4 counts, hold for 4, exhale for 6 counts',
      duration: '2 minutes',
      icon: <Wind className="w-5 h-5" />,
      category: 'breathing'
    },
    {
      id: 'progressive-relaxation',
      title: 'Progressive Muscle Relaxation',
      description: 'Tense and release each muscle group starting from your toes',
      duration: '10 minutes',
      icon: <Heart className="w-5 h-5" />,
      category: 'breathing'
    },

    // Creative & Expression
    {
      id: 'journaling',
      title: 'Write Your Thoughts',
      description: 'Express your feelings on paper without judgment',
      duration: '5-10 minutes',
      icon: <BookOpen className="w-5 h-5" />,
      category: 'creative'
    },
    {
      id: 'listen-music',
      title: 'Listen to Calming Music',
      description: 'Choose soothing instrumental or nature sounds',
      duration: '10-15 minutes',
      icon: <Headphones className="w-5 h-5" />,
      category: 'creative'
    },
    {
      id: 'creative-activity',
      title: 'Try a Creative Activity', 
      description: 'Draw, color, craft, or engage in any creative expression',
      duration: '15-30 minutes',
      icon: <Smile className="w-5 h-5" />,
      category: 'creative'
    },

    // Movement & Physical
    {
      id: 'gentle-walk',
      title: 'Take a Gentle Walk',
      description: 'Step outside or walk around your space mindfully',
      duration: '10-20 minutes',
      icon: <RefreshCw className="w-5 h-5" />,
      category: 'movement'
    },
    {
      id: 'stretching',
      title: 'Simple Stretching',
      description: 'Gentle neck, shoulder, and back stretches',
      duration: '5-10 minutes',
      icon: <Heart className="w-5 h-5" />,
      category: 'movement'
    },

    // Social & Connection
    {
      id: 'call-friend',
      title: 'Call a Trusted Friend',
      description: 'Reach out to someone who makes you feel supported',
      duration: '10-30 minutes',
      icon: <Phone className="w-5 h-5" />,
      category: 'social'
    },
    {
      id: 'hug-pet',
      title: 'Spend Time with a Pet',
      description: 'Pet therapy can provide comfort and reduce stress',
      duration: '5-15 minutes',
      icon: <Users className="w-5 h-5" />,
      category: 'social'
    },

    // Mindfulness & Grounding
    {
      id: 'mindful-tea',
      title: 'Make Mindful Tea/Coffee',
      description: 'Focus on the process: smell, warmth, and taste',
      duration: '10 minutes',
      icon: <Coffee className="w-5 h-5" />,
      category: 'mindfulness'
    },
    {
      id: 'grounding-5-4-3-2-1',
      title: '5-4-3-2-1 Grounding',
      description: 'Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste',
      duration: '3-5 minutes',
      icon: <Heart className="w-5 h-5" />,
      category: 'mindfulness'
    },

    // Distraction & Comfort
    {
      id: 'favorite-show',
      title: 'Watch Comfort Content',
      description: 'A favorite movie, comedy show, or uplifting videos',
      duration: '20-60 minutes',
      icon: <Smile className="w-5 h-5" />,
      category: 'distraction'
    },
    {
      id: 'warm-shower',
      title: 'Take a Warm Shower/Bath',
      description: 'Let the warm water help you relax and reset',
      duration: '10-20 minutes',
      icon: <RefreshCw className="w-5 h-5" />,
      category: 'distraction'
    }
  ];

  const moodStrategies: MoodStrategies = {
    'sad': [
      allStrategies.find(s => s.id === 'deep-breathing')!,
      allStrategies.find(s => s.id === 'call-friend')!,
      allStrategies.find(s => s.id === 'listen-music')!,
      allStrategies.find(s => s.id === 'journaling')!
    ],
    'anxious': [
      allStrategies.find(s => s.id === 'grounding-5-4-3-2-1')!,
      allStrategies.find(s => s.id === 'deep-breathing')!,
      allStrategies.find(s => s.id === 'progressive-relaxation')!,
      allStrategies.find(s => s.id === 'gentle-walk')!
    ],
    'stressed': [
      allStrategies.find(s => s.id === 'progressive-relaxation')!,
      allStrategies.find(s => s.id === 'stretching')!,
      allStrategies.find(s => s.id === 'mindful-tea')!,
      allStrategies.find(s => s.id === 'warm-shower')!
    ],
    'angry': [
      allStrategies.find(s => s.id === 'deep-breathing')!,
      allStrategies.find(s => s.id === 'gentle-walk')!,
      allStrategies.find(s => s.id === 'journaling')!,
      allStrategies.find(s => s.id === 'creative-activity')!
    ],
    'overwhelmed': [
      allStrategies.find(s => s.id === 'grounding-5-4-3-2-1')!,
      allStrategies.find(s => s.id === 'deep-breathing')!,
      allStrategies.find(s => s.id === 'favorite-show')!,
      allStrategies.find(s => s.id === 'hug-pet')!
    ]
  };

  // Load completed strategies from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('completed-coping-strategies');
    if (saved) {
      setCompletedStrategies(JSON.parse(saved));
    }
  }, []);

  // Save completed strategies to localStorage
  useEffect(() => {
    localStorage.setItem('completed-coping-strategies', JSON.stringify(completedStrategies));
  }, [completedStrategies]);

  const getMoodStrategies = () => {
    // Map mood values to mood names
    if (moodValue !== undefined) {
      if (moodValue <= 2) return moodStrategies['sad'] || [];
      if (moodValue === 3) return moodStrategies['overwhelmed'] || [];
    }
    return moodStrategies[currentMood.toLowerCase()] || moodStrategies['sad'];
  };

  const handleStrategyComplete = (strategyId: string) => {
    if (!completedStrategies.includes(strategyId)) {
      setCompletedStrategies([...completedStrategies, strategyId]);
    }
  };

  const resetCompletedStrategies = () => {
    setCompletedStrategies([]);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'breathing': return 'from-blue-50 to-cyan-50 border-blue-200';
      case 'creative': return 'from-purple-50 to-indigo-50 border-purple-200';
      case 'movement': return 'from-green-50 to-emerald-50 border-green-200';
      case 'social': return 'from-orange-50 to-amber-50 border-orange-200';
      case 'mindfulness': return 'from-teal-50 to-cyan-50 border-teal-200';
      case 'distraction': return 'from-amber-50 to-yellow-50 border-amber-200';
      default: return 'from-stone-50 to-gray-50 border-stone-200';
    }
  };

  const getCategoryIconColor = (category: string) => {
    switch (category) {
      case 'breathing': return 'text-blue-600';
      case 'creative': return 'text-purple-600';
      case 'movement': return 'text-green-600';
      case 'social': return 'text-orange-600';
      case 'mindfulness': return 'text-teal-600';
      case 'distraction': return 'text-amber-600';
      default: return 'text-stone-600';
    }
  };

  const strategies = getMoodStrategies();
  const moodDisplayName = moodValue !== undefined 
    ? (moodValue <= 2 ? 'down' : 'overwhelmed')
    : currentMood;

  return (
    <div className={`${standalone ? 'min-h-screen bg-orange-50 p-6' : 'bg-orange-50 rounded-xl p-6'}`}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-stone-800">Coping Strategies</h1>
          </div>
          <p className="text-stone-600 text-lg mb-2">
            You're feeling {moodDisplayName}. Here are some activities that might help:
          </p>
          <p className="text-sm text-stone-500">
            Try one or more of these gentle strategies. Remember, it's okay to take things one step at a time.
          </p>
        </div>

        {/* Progress Indicator */}
        {completedStrategies.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  Great job! You've tried {completedStrategies.length} strateg{completedStrategies.length === 1 ? 'y' : 'ies'}.
                </span>
              </div>
              <button
                onClick={resetCompletedStrategies}
                className="text-sm text-green-600 hover:text-green-700 underline"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Strategies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {strategies.map((strategy) => {
            const isCompleted = completedStrategies.includes(strategy.id);

            return (
              <div
                key={strategy.id}
                className={`relative p-6 rounded-xl border-2 bg-gradient-to-br transition-all duration-300 hover:shadow-md ${
                  isCompleted 
                    ? 'from-green-50 to-emerald-50 border-green-300'
                    : getCategoryColor(strategy.category)
                }`}
              >
                {/* Completion Badge */}
                {isCompleted && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-white shadow-sm ${
                    isCompleted 
                      ? 'text-green-600' 
                      : getCategoryIconColor(strategy.category)
                  }`}>
                    {strategy.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-stone-800 text-lg mb-2">
                      {strategy.title}
                    </h3>
                    <p className="text-stone-600 text-sm mb-3 leading-relaxed">
                      {strategy.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span>⏱️ {strategy.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!isCompleted ? (
                    <button
                      onClick={() => handleStrategyComplete(strategy.id)}
                      className="flex-1 bg-white hover:bg-stone-50 text-stone-700 font-medium py-2 px-4 rounded-lg border border-stone-200 transition-colors duration-200"
                    >
                      Try This
                    </button>
                  ) : (
                    <div className="flex-1 bg-green-100 text-green-700 font-medium py-2 px-4 rounded-lg text-center">
                      ✓ Completed
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button for Embedded Mode */}
        {!standalone && onClose && (
          <div className="text-center">
            <button
              onClick={onClose}
              className="bg-stone-600 hover:bg-stone-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Close
            </button>
          </div>
        )}

        {/* Mood Selector for Standalone Mode */}
        {standalone && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">Try Different Strategies</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(moodStrategies).map((moodOption) => (
                <button
                  key={moodOption}
                  onClick={() => setCurrentMood(moodOption)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    currentMood === moodOption
                      ? 'bg-blue-600 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {moodOption.charAt(0).toUpperCase() + moodOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Encouragement Footer */}
        <div className="text-center mt-8 p-6 bg-white rounded-xl border border-stone-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-stone-800">Remember</span>
          </div>
          <p className="text-stone-600 text-sm">
            It's completely normal to have difficult days. These strategies are tools to help you feel better, 
            but if you continue to struggle, please consider reaching out to a counselor or trusted person.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CopingStrategies;