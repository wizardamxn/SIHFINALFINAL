import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  User,
  Settings,
  Calendar,
  MessageCircle,
  TrendingUp,
  Heart,
  Brain,
  Clock,
  Edit3,
  Phone,
  Video,
  ChevronRight,
  Award,
  Target,
  BookOpen,
  Activity,
  Smile,
  Frown,
  Meh,
  Sun,
  Moon,
  Star,
  CheckCircle,
  AlertCircle,
  Plus,
  BarChart3,
  PieChart,
  Calendar as CalendarIcon,
  Users,
  ThumbsUp,
  Eye,
  Share2
} from 'lucide-react';

// Enhanced interfaces for mental health data
interface MoodEntry {
  id: string;
  date: string;
  mood: 'excellent' | 'good' | 'neutral' | 'low' | 'poor';
  energy: number; // 1-10
  anxiety: number; // 1-10
  notes?: string;
  activities: string[];
}

interface MentalHealthMetrics {
  overallWellbeing: number; // 0-100
  moodTrend: 'improving' | 'stable' | 'declining';
  anxietyLevel: number; // 0-100
  sleepQuality: number; // 0-100
  socialConnection: number; // 0-100
  streakDays: number;
  goalsCompleted: number;
  totalGoals: number;
}

interface CounselingSession {
  id: string;
  date: string;
  time: string;
  therapistName: string;
  therapistAvatar?: string;
  type: 'video' | 'audio' | 'in-person';
  status: 'upcoming' | 'completed' | 'cancelled';
  duration: number; // minutes
  notes?: string;
  sessionType: 'individual' | 'group' | 'family';
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
  location: string;
  timezone: string;
  preferences: {
    reminderFrequency: 'daily' | 'weekly' | 'custom';
    privacyLevel: 'public' | 'friends' | 'private';
    notificationSettings: {
      sessions: boolean;
      moodReminders: boolean;
      communityUpdates: boolean;
    };
  };
}

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  upvotes: number;
  comments: number;
  views: number;
  category: string;
  isAnonymous: boolean;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'mood' | 'sleep' | 'exercise' | 'social' | 'mindfulness';
  progress: number; // 0-100
  targetDate: string;
  isCompleted: boolean;
  createdDate: string;
}

// Mock data for demonstration
const mockUserProfile: UserProfile = {
  id: 'user-1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  joinDate: '2024-03-15',
  location: 'San Francisco, CA',
  timezone: 'PST',
  preferences: {
    reminderFrequency: 'daily',
    privacyLevel: 'friends',
    notificationSettings: {
      sessions: true,
      moodReminders: true,
      communityUpdates: false
    }
  }
};

const mockMentalHealthMetrics: MentalHealthMetrics = {
  overallWellbeing: 78,
  moodTrend: 'improving',
  anxietyLevel: 35,
  sleepQuality: 82,
  socialConnection: 68,
  streakDays: 12,
  goalsCompleted: 7,
  totalGoals: 10
};

const mockRecentMoods: MoodEntry[] = [
  { id: '1', date: '2025-09-24', mood: 'good', energy: 7, anxiety: 3, activities: ['meditation', 'walk'], notes: 'Had a productive day' },
  { id: '2', date: '2025-09-23', mood: 'excellent', energy: 9, anxiety: 2, activities: ['exercise', 'socializing'], notes: 'Great therapy session' },
  { id: '3', date: '2025-09-22', mood: 'neutral', energy: 5, anxiety: 6, activities: ['reading', 'journaling'] },
  { id: '4', date: '2025-09-21', mood: 'good', energy: 8, anxiety: 4, activities: ['meditation', 'work'] },
  { id: '5', date: '2025-09-20', mood: 'low', energy: 4, anxiety: 7, activities: ['rest'], notes: 'Challenging day, but practiced self-care' }
];

const mockUpcomingSessions: CounselingSession[] = [
  {
    id: 'session-1',
    date: '2025-09-26',
    time: '10:00 AM',
    therapistName: 'Dr. Emily Chen',
    type: 'video',
    status: 'upcoming',
    duration: 50,
    sessionType: 'individual'
  },
  {
    id: 'session-2',
    date: '2025-10-01',
    time: '2:30 PM',
    therapistName: 'Dr. Michael Rodriguez',
    type: 'in-person',
    status: 'upcoming',
    duration: 60,
    sessionType: 'individual'
  },
  {
    id: 'session-3',
    date: '2025-10-03',
    time: '6:00 PM',
    therapistName: 'Dr. Sarah Kim',
    type: 'video',
    status: 'upcoming',
    duration: 45,
    sessionType: 'group'
  }
];

const mockUserPosts: CommunityPost[] = [
  {
    id: 'post-1',
    title: 'Finding peace in daily meditation',
    content: 'Wanted to share how incorporating 10 minutes of meditation into my morning routine has helped manage my anxiety levels...',
    author: 'Sarah Johnson',
    timestamp: '2 days ago',
    upvotes: 24,
    comments: 8,
    views: 156,
    category: 'Mindfulness',
    isAnonymous: false
  },
  {
    id: 'post-2',
    title: 'Dealing with social anxiety at work',
    content: 'Has anyone found effective strategies for managing social anxiety in professional settings? Looking for practical tips...',
    author: 'Anonymous',
    timestamp: '1 week ago',
    upvotes: 18,
    comments: 12,
    views: 203,
    category: 'Anxiety',
    isAnonymous: true
  }
];

const mockGoals: Goal[] = [
  {
    id: 'goal-1',
    title: 'Daily Meditation Practice',
    description: 'Meditate for 10 minutes every morning',
    category: 'mindfulness',
    progress: 85,
    targetDate: '2025-10-30',
    isCompleted: false,
    createdDate: '2025-09-01'
  },
  {
    id: 'goal-2',
    title: 'Improve Sleep Schedule',
    description: 'Get 7-8 hours of sleep consistently',
    category: 'sleep',
    progress: 92,
    targetDate: '2025-09-30',
    isCompleted: false,
    createdDate: '2025-08-15'
  },
  {
    id: 'goal-3',
    title: 'Weekly Social Activity',
    description: 'Engage in one social activity per week',
    category: 'social',
    progress: 100,
    targetDate: '2025-09-24',
    isCompleted: true,
    createdDate: '2025-08-01'
  }
];

const ProfileSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'sessions' | 'posts' | 'goals'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);


  // Add these new state variables for functionality
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [editingUserProfile, setEditingUserProfile] = useState<UserProfile>(mockUserProfile);
  const [sessions, setSessions] = useState<CounselingSession[]>(mockUpcomingSessions);
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [userPosts, setUserPosts] = useState<CommunityPost[]>(mockUserPosts);



  const handleSaveProfile = useCallback(() => {
    setUserProfile(editingUserProfile);
    setIsEditing(false);
    // Here you would typically make an API call to save the profile
    console.log('Profile saved:', editingUserProfile);
  }, [editingUserProfile]);

  const handleCancelEdit = useCallback(() => {
    setEditingUserProfile(userProfile);
    setIsEditing(false);
  }, [userProfile]);

  // Session booking functionality
  const handleBookSession = useCallback((sessionType: 'video' | 'audio' | 'in-person', therapistName: string) => {
    const newSession: CounselingSession = {
      id: `session-${Date.now()}`,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      time: '10:00 AM',
      therapistName,
      type: sessionType,
      status: 'upcoming',
      duration: 50,
      sessionType: 'individual'
    };
    
    setSessions(prev => [...prev, newSession]);
    setShowBookingModal(false);
    console.log('Session booked:', newSession);
  }, []);

  // Join session functionality
  const handleJoinSession = useCallback((session: CounselingSession) => {
    if (session.type === 'video') {
      // In a real app, this would open a video call interface
      window.open('https://meet.example.com/session/' + session.id, '_blank');
    } else if (session.type === 'audio') {
      // In a real app, this would initiate an audio call
      window.open('tel:+1234567890'); // Placeholder
    } else {
      // For in-person sessions, show directions or address
      alert(`Session with ${session.therapistName} at our clinic. Address: 123 Wellness St, City, State`);
    }
    console.log('Joining session:', session);
  }, []);

  // Goal management functionality
  const handleAddGoal = useCallback((goalData: Partial<Goal>) => {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: goalData.title || '',
      description: goalData.description || '',
      category: goalData.category || 'mindfulness',
      progress: 0,
      targetDate: goalData.targetDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isCompleted: false,
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    setGoals(prev => [...prev, newGoal]);
    setShowNewGoalModal(false);
    console.log('Goal added:', newGoal);
  }, []);

  const handleUpdateGoalProgress = useCallback((goalId: string, newProgress: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, progress: newProgress, isCompleted: newProgress >= 100 }
        : goal
    ));
    console.log('Goal progress updated:', goalId, newProgress);
  }, []);

  // Post functionality
  const handleCreatePost = useCallback((postData: Partial<CommunityPost>) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      title: postData.title || '',
      content: postData.content || '',
      author: userProfile.name,
      timestamp: 'Just now',
      upvotes: 0,
      comments: 0,
      views: 0,
      category: postData.category || 'General',
      isAnonymous: postData.isAnonymous || false
    };
    
    setUserPosts(prev => [newPost, ...prev]);
    setShowNewPostModal(false);
    console.log('Post created:', newPost);
  }, [userProfile.name]);

  // Update mood functionality
  const handleUpdateMood = useCallback((mood: 'excellent' | 'good' | 'neutral' | 'low' | 'poor', energy: number, anxiety: number, notes?: string) => {
    const newMoodEntry: MoodEntry = {
      id: `mood-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mood,
      energy,
      anxiety,
      notes,
      activities: []
    };
    console.log('Mood updated:', newMoodEntry);
    // In a real app, this would update the mood tracking data
  }, []);

  // Now update the JSX to include the functional handlers:


  // Get mood icon based on mood type
  const getMoodIcon = useCallback((mood: string, size: number = 20) => {
    switch (mood) {
      case 'excellent': return <Smile size={size} className="text-green-500" />;
      case 'good': return <Smile size={size} className="text-blue-500" />;
      case 'neutral': return <Meh size={size} className="text-yellow-500" />;
      case 'low': return <Frown size={size} className="text-orange-500" />;
      case 'poor': return <Frown size={size} className="text-red-500" />;
      default: return <Meh size={size} className="text-gray-500" />;
    }
  }, []);

  // Get trend color and icon
  const getTrendDisplay = useCallback((trend: string) => {
    switch (trend) {
      case 'improving':
        return { color: 'text-green-600', bg: 'bg-green-100', icon: <TrendingUp size={16} />, text: 'Improving' };
      case 'stable':
        return { color: 'text-blue-600', bg: 'bg-blue-100', icon: <Activity size={16} />, text: 'Stable' };
      case 'declining':
        return { color: 'text-orange-600', bg: 'bg-orange-100', icon: <TrendingUp size={16} className="rotate-180" />, text: 'Needs Attention' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', icon: <Activity size={16} />, text: 'Unknown' };
    }
  }, []);

  // Get category colors for goals
  const getCategoryColor = useCallback((category: string) => {
    const colors = {
      'mindfulness': 'from-purple-400 to-purple-600',
      'sleep': 'from-indigo-400 to-indigo-600',
      'exercise': 'from-green-400 to-green-600',
      'social': 'from-pink-400 to-pink-600',
      'mood': 'from-yellow-400 to-yellow-600'
    };
    return colors[category as keyof typeof colors] || 'from-gray-400 to-gray-600';
  }, []);

 return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDEBD2] via-[#FEF2E1] to-[#FDEBD2]">
     <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00373E] via-[#004A56] to-[#00373E] opacity-95"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
        
       <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#84DCC6]/20 to-transparent rounded-full blur-3xl transform translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#FFD37D]/20 to-transparent rounded-full blur-3xl transform -translate-x-48 translate-y-48"></div>
        
        <div className="relative z-10 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#84DCC6] to-[#9ADBE8] rounded-3xl flex items-center justify-center shadow-xl">
                  {userProfile.avatar ? (
                    <img src={userProfile.avatar} alt="Profile" className="w-full h-full rounded-3xl object-cover" />
                  ) : (
                    <User size={32} className="text-[#00373E]" />
                  )}
                </div>
                <div>
                  {/* ✅ ADDED: Editable name field */}
                  {isEditing ? (
                    <input
                      type="text"
                      value={editingUserProfile.name}
                      onChange={(e) => setEditingUserProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="text-4xl font-bold text-white mb-2 tracking-tight bg-transparent border-b border-white/50 outline-none"
                    />
                  ) : (
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">{userProfile.name}</h1>
                  )}
                  <div className="flex items-center gap-4 text-[#84DCC6]/80 text-sm">
                    <span>Member since {new Date(userProfile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    <div className="w-1 h-1 bg-[#84DCC6]/60 rounded-full"></div>
                    {/* ✅ ADDED: Editable location field */}
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingUserProfile.location}
                        onChange={(e) => setEditingUserProfile(prev => ({ ...prev, location: e.target.value }))}
                        className="bg-transparent border-b border-white/50 outline-none text-[#84DCC6]/80"
                      />
                    ) : (
                      <span>{userProfile.location}</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* ✅ UPDATED: Working Edit Profile button with save/cancel */}
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full transition-all duration-300 hover:shadow-xl hover:scale-105 font-semibold flex items-center gap-2"
                    >
                      <CheckCircle size={18} />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-full transition-all duration-300 hover:shadow-xl hover:scale-105 font-semibold"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditingUserProfile(userProfile);
                    }}
                    className="group relative overflow-hidden bg-gradient-to-r from-[#FFD37D] to-[#84DCC6] text-[#00373E] px-6 py-3 rounded-full transition-all duration-300 hover:shadow-xl hover:scale-105 font-semibold flex items-center gap-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center gap-2">
                      <Edit3 size={18} />
                      <span>Edit Profile</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-2 mb-8 border border-white/20">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
              { id: 'metrics', label: 'Health Metrics', icon: <Heart size={18} /> },
              { id: 'sessions', label: 'Counseling', icon: <Calendar size={18} /> },
              { id: 'posts', label: 'My Posts', icon: <MessageCircle size={18} /> },
              { id: 'goals', label: 'Goals', icon: <Target size={18} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#00373E] to-[#004A56] text-white shadow-lg'
                    : 'text-[#00373E] hover:bg-[#84DCC6]/20'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

       {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Wellbeing Score Card */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#00373E] flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#84DCC6] to-[#9ADBE8] rounded-lg flex items-center justify-center">
                    <Brain size={18} className="text-[#00373E]" />
                  </div>
                  Wellbeing Overview
                </h2>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getTrendDisplay(mockMentalHealthMetrics.moodTrend).bg}`}>
                  <div className={getTrendDisplay(mockMentalHealthMetrics.moodTrend).color}>
                    {getTrendDisplay(mockMentalHealthMetrics.moodTrend).icon}
                  </div>
                  <span className={`font-semibold text-sm ${getTrendDisplay(mockMentalHealthMetrics.moodTrend).color}`}>
                    {getTrendDisplay(mockMentalHealthMetrics.moodTrend).text}
                  </span>
                </div>
              </div>

              {/* Main Wellbeing Score */}
              <div className="text-center mb-8">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="url(#wellbeingGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${mockMentalHealthMetrics.overallWellbeing * 3.14} 314`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="wellbeingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#84DCC6" />
                        <stop offset="100%" stopColor="#9ADBE8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#00373E]">{mockMentalHealthMetrics.overallWellbeing}</div>
                      <div className="text-sm text-gray-600">Overall</div>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#00373E] mb-2">Wellbeing Score</h3>
                <p className="text-gray-600">You're doing great! Keep up the positive momentum.</p>
              </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-green-800">Streak</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700">{mockMentalHealthMetrics.streakDays}</div>
                  <div className="text-xs text-green-600">days</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={16} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Goals</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700">{mockMentalHealthMetrics.goalsCompleted}/{mockMentalHealthMetrics.totalGoals}</div>
                  <div className="text-xs text-blue-600">completed</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Moon size={16} className="text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Sleep</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-700">{mockMentalHealthMetrics.sleepQuality}%</div>
                  <div className="text-xs text-purple-600">quality</div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl border border-pink-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={16} className="text-pink-600" />
                    <span className="text-sm font-medium text-pink-800">Social</span>
                  </div>
                  <div className="text-2xl font-bold text-pink-700">{mockMentalHealthMetrics.socialConnection}%</div>
                  <div className="text-xs text-pink-600">connection</div>
                </div>
              </div>
            </div>

            {/* Recent Mood & Upcoming Session */}
            <div className="space-y-6">
              {/* Recent Mood */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-[#00373E] mb-4 flex items-center gap-2">
                  <Heart size={18} className="text-pink-500" />
                  Recent Mood
                </h3>
                {mockRecentMoods.slice(0, 5).map((mood, index) => (
                  <div key={mood.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      {getMoodIcon(mood.mood, 18)}
                      <span className="text-sm text-gray-600">{new Date(mood.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="text-sm font-medium text-[#00373E] capitalize">{mood.mood}</div>
                  </div>
                ))}
                {/* ✅ UPDATED: Working View All button */}
                <button 
                  onClick={() => setActiveTab('metrics')}
                  className="w-full mt-3 text-[#00373E] hover:text-[#004A56] text-sm font-medium flex items-center justify-center gap-1"
                >
                  View All <ChevronRight size={14} />
                </button>
              </div>

              {/* Next Session */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-[#00373E] mb-4 flex items-center gap-2">
                  <CalendarIcon size={18} className="text-blue-500" />
                  Next Session
                </h3>
                {mockUpcomingSessions[0] && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#84DCC6] to-[#9ADBE8] rounded-full flex items-center justify-center">
                        <User size={16} className="text-[#00373E]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#00373E]">{mockUpcomingSessions[0].therapistName}</div>
                        <div className="text-sm text-gray-600">{mockUpcomingSessions[0].sessionType} session</div>
                      </div>
                    </div>
                    <div className="bg-[#84DCC6]/10 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-[#00373E]">{mockUpcomingSessions[0].date}</span>
                        <div className="flex items-center gap-1">
                          {mockUpcomingSessions[0].type === 'video' && <Video size={14} className="text-blue-500" />}
                          {mockUpcomingSessions[0].type === 'audio' && <Phone size={14} className="text-green-500" />}
                          <span className="text-sm text-gray-600">{mockUpcomingSessions[0].time}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">Duration: {mockUpcomingSessions[0].duration} minutes</div>
                    </div>
                    {/* ✅ UPDATED: Working Join Session button */}
                    <button 
                      onClick={() => handleJoinSession(mockUpcomingSessions[0])}
                      className="w-full bg-gradient-to-r from-[#00373E] to-[#004A56] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Join Session
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mood Tracking Chart */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-[#00373E] mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center">
                  <Heart size={18} className="text-white" />
                </div>
                Mood Tracking
              </h2>
              
             <div className="h-64 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl border border-pink-200 flex items-center justify-center mb-6">
                <div className="text-center">
                  <BarChart3 size={48} className="text-pink-400 mx-auto mb-2" />
                  <p className="text-gray-600">7-day mood trend visualization</p>
                </div>
              </div>

             <div className="space-y-3">
                <h3 className="font-semibold text-[#00373E]">Recent Entries</h3>
                {mockRecentMoods.slice(0, 3).map((mood) => (
                  <div key={mood.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getMoodIcon(mood.mood)}
                      <div>
                        <div className="font-medium text-[#00373E] capitalize">{mood.mood}</div>
                        <div className="text-sm text-gray-600">{mood.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Energy: {mood.energy}/10</div>
                      <div className="text-sm text-gray-600">Anxiety: {mood.anxiety}/10</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Metrics Dashboard */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-[#00373E] mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <Activity size={18} className="text-white" />
                </div>
                Health Metrics
              </h2>

              <div className="space-y-6">
               <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-[#00373E]">Anxiety Level</span>
                    <span className="text-sm text-gray-600">{mockMentalHealthMetrics.anxietyLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${mockMentalHealthMetrics.anxietyLevel}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Lower is better</p>
                </div>

                {/* Sleep Quality */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-[#00373E]">Sleep Quality</span>
                    <span className="text-sm text-gray-600">{mockMentalHealthMetrics.sleepQuality}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${mockMentalHealthMetrics.sleepQuality}%` }}
                    ></div>
                  </div>
                </div>

                {/* Social Connection */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-[#00373E]">Social Connection</span>
                    <span className="text-sm text-gray-600">{mockMentalHealthMetrics.socialConnection}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-pink-400 to-pink-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${mockMentalHealthMetrics.socialConnection}%` }}
                    ></div>
                  </div>
                </div>

                {/* Weekly Summary */}
                <div className="bg-[#84DCC6]/10 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-[#00373E] mb-2">This Week's Insights</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Mood trending upward (+12% from last week)</li>
                    <li>• Sleep quality improved significantly</li>
                    <li>• Consider increasing social activities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Sessions */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#00373E] flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <Calendar size={18} className="text-white" />
                  </div>
                  Upcoming Sessions
                </h2>
                {/* ✅ UPDATED: Working Schedule New button */}
                <button 
                  onClick={() => setShowBookingModal(true)}
                  className="bg-gradient-to-r from-[#00373E] to-[#004A56] text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus size={16} />
                  Schedule New
                </button>
              </div>

              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#84DCC6] to-[#9ADBE8] rounded-2xl flex items-center justify-center">
                          <User size={20} className="text-[#00373E]" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#00373E] text-lg">{session.therapistName}</h3>
                          <p className="text-gray-600 capitalize">{session.sessionType} therapy session</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-[#00373E]">{session.date}</div>
                        <div className="text-gray-600">{session.time}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {session.type === 'video' && <Video size={16} className="text-blue-500" />}
                          {session.type === 'audio' && <Phone size={16} className="text-green-500" />}
                          {session.type === 'in-person' && <Users size={16} className="text-purple-500" />}
                          <span className="capitalize">{session.type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={16} />
                          <span>{session.duration} min</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {/* ✅ UPDATED: Working Reschedule button */}
                        <button 
                          onClick={() => console.log('Reschedule session:', session.id)}
                          className="text-[#84DCC6] hover:text-[#6BC4B3] font-medium"
                        >
                          Reschedule
                        </button>
                        {/* ✅ UPDATED: Working Join/Get Directions button */}
                        <button 
                          onClick={() => handleJoinSession(session)}
                          className="bg-gradient-to-r from-[#84DCC6] to-[#9ADBE8] text-[#00373E] px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
                        >
                          {session.type === 'video' ? 'Join Call' : session.type === 'audio' ? 'Join Audio' : 'Get Directions'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Statistics */}
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-[#00373E] mb-4 flex items-center gap-2">
                  <PieChart size={18} className="text-green-500" />
                  Session Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Sessions</span>
                    <span className="font-bold text-[#00373E]">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">This Month</span>
                    <span className="font-bold text-[#00373E]">6</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-bold text-green-600">95%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Rating</span>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} size={14} className="text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-[#00373E] mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {/* ✅ UPDATED: Working Emergency Session button */}
                  <button 
                    onClick={() => handleBookSession('video', 'Emergency Counselor')}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:shadow-md transition-all"
                  >
                    Book Emergency Session
                  </button>
                  {/* ✅ UPDATED: Working Message Therapist button */}
                  <button 
                    onClick={() => alert('Message functionality would open chat interface')}
                    className="w-full border-2 border-[#84DCC6] text-[#00373E] py-3 rounded-xl font-semibold hover:bg-[#84DCC6]/10 transition-all"
                  >
                    Message Therapist
                  </button>
                  {/* ✅ UPDATED: Working View Session History button */}
                  <button 
                    onClick={() => console.log('View session history')}
                    className="w-full text-[#00373E] hover:text-[#004A56] py-3 rounded-xl font-medium transition-all"
                  >
                    View Session History
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* My Posts */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#00373E] flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                    <MessageCircle size={18} className="text-white" />
                  </div>
                  My Community Posts
                </h2>
                {/* ✅ UPDATED: Working New Post button */}
                <button 
                  onClick={() => setShowNewPostModal(true)}
                  className="bg-gradient-to-r from-[#00373E] to-[#004A56] text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus size={16} />
                  New Post
                </button>
              </div>

              <div className="space-y-6">
                {userPosts.map((post) => (
                  <div key={post.id} className="bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-[#00373E] text-lg mb-2">{post.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{post.content}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium text-[#00373E] ${
                        post.category === 'Mindfulness' ? 'bg-gradient-to-r from-purple-200 to-purple-300' :
                        post.category === 'Anxiety' ? 'bg-gradient-to-r from-orange-200 to-orange-300' :
                        'bg-gradient-to-r from-blue-200 to-blue-300'
                      }`}>
                        {post.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200/60">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <ThumbsUp size={16} />
                          <span>{post.upvotes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={16} />
                          <span>{post.comments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye size={16} />
                          <span>{post.views}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{post.timestamp}</span>
                        {/* ✅ UPDATED: Working Edit button */}
                        <button 
                          onClick={() => console.log('Edit post:', post.id)}
                          className="text-[#84DCC6] hover:text-[#6BC4B3] font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Post Statistics */}
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-[#00373E] mb-4 flex items-center gap-2">
                  <BarChart3 size={18} className="text-purple-500" />
                  Post Analytics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Posts</span>
                    <span className="font-bold text-[#00373E]">{userPosts.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Upvotes</span>
                    <span className="font-bold text-[#00373E]">{userPosts.reduce((sum, post) => sum + post.upvotes, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Views</span>
                    <span className="font-bold text-[#00373E]">{userPosts.reduce((sum, post) => sum + post.views, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg. Engagement</span>
                    <span className="font-bold text-green-600">
                      {Math.round(userPosts.reduce((sum, post) => sum + (post.upvotes + post.comments), 0) / userPosts.length) || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-[#00373E] mb-4">Community Impact</h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Heart size={16} className="text-green-600" />
                      <span className="font-medium text-green-800">Helpful Member</span>
                    </div>
                    <p className="text-sm text-green-700">Your posts have helped 42+ community members</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Award size={16} className="text-blue-600" />
                      <span className="font-medium text-blue-800">Mindfulness Expert</span>
                    </div>
                    <p className="text-sm text-blue-700">Top contributor in mindfulness topics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Goals List */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#00373E] flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <Target size={18} className="text-white" />
                  </div>
                  My Goals
                </h2>
                {/* ✅ UPDATED: Working Add Goal button */}
                <button 
                  onClick={() => setShowNewGoalModal(true)}
                  className="bg-gradient-to-r from-[#00373E] to-[#004A56] text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Goal
                </button>
              </div>

              <div className="space-y-6">
                {goals.map((goal) => (
                  <div key={goal.id} className="bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(goal.category)} rounded-2xl flex items-center justify-center shadow-md`}>
                          {goal.category === 'mindfulness' && <Brain size={20} className="text-white" />}
                          {goal.category === 'sleep' && <Moon size={20} className="text-white" />}
                          {goal.category === 'social' && <Users size={20} className="text-white" />}
                          {goal.category === 'exercise' && <Activity size={20} className="text-white" />}
                          {goal.category === 'mood' && <Heart size={20} className="text-white" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-[#00373E] text-lg mb-2">{goal.title}</h3>
                          <p className="text-gray-600 mb-3">{goal.description}</p>
                          <div className="text-sm text-gray-500">
                            Target: {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      {goal.isCompleted && (
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <CheckCircle size={14} />
                          Completed
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-[#00373E]">Progress</span>
                        <span className="text-sm text-gray-600">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`bg-gradient-to-r ${getCategoryColor(goal.category)} h-3 rounded-full transition-all duration-1000`}
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4 gap-2">
                      {/* ✅ UPDATED: Working Edit button */}
                      <button 
                        onClick={() => console.log('Edit goal:', goal.id)}
                        className="text-[#84DCC6] hover:text-[#6BC4B3] font-medium"
                      >
                        Edit
                      </button>
                      {/* ✅ UPDATED: Working Update Progress button */}
                      <button 
                        onClick={() => {
                          const newProgress = prompt(`Update progress for "${goal.title}" (0-100):`, goal.progress.toString());
                          if (newProgress !== null && !isNaN(Number(newProgress))) {
                            handleUpdateGoalProgress(goal.id, Math.min(100, Math.max(0, Number(newProgress))));
                          }
                        }}
                        className="bg-gradient-to-r from-[#84DCC6] to-[#9ADBE8] text-[#00373E] px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
                      >
                        Update Progress
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals Statistics */}
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-[#00373E] mb-4 flex items-center gap-2">
                  <Award size={18} className="text-yellow-500" />
                  Goal Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Goals</span>
                    <span className="font-bold text-[#00373E]">{goals.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-bold text-green-600">{goals.filter(g => g.isCompleted).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">In Progress</span>
                    <span className="font-bold text-blue-600">{goals.filter(g => !g.isCompleted).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-bold text-green-600">
                      {Math.round((goals.filter(g => g.isCompleted).length / goals.length) * 100) || 0}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-[#00373E] mb-4">Achievements</h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Star size={16} className="text-yellow-600" />
                      <span className="font-medium text-yellow-800">Goal Setter</span>
                    </div>
                    <p className="text-sm text-yellow-700">Created your first wellness goal</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="font-medium text-green-800">Achiever</span>
                    </div>
                    <p className="text-sm text-green-700">Completed your first goal</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Brain size={16} className="text-purple-600" />
                      <span className="font-medium text-purple-800">Mindful</span>
                    </div>
                    <p className="text-sm text-purple-700">12-day meditation streak</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ✅ ADDED: Modal Components */}
      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-[#00373E] mb-4">Book New Session</h3>
            <div className="space-y-4">
              <button 
                onClick={() => handleBookSession('video', 'Dr. Emily Chen')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Video size={18} />
                Video Session
              </button>
              <button 
                onClick={() => handleBookSession('audio', 'Dr. Michael Rodriguez')}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                Audio Session
              </button>
              <button 
                onClick={() => handleBookSession('in-person', 'Dr. Sarah Kim')}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Users size={18} />
                In-Person Session
              </button>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="w-full bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Goal Modal */}
      {showNewGoalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-[#00373E] mb-4">Add New Goal</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleAddGoal({
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                category: formData.get('category') as any,
                targetDate: formData.get('targetDate') as string,
              });
            }}>
              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Goal title"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84DCC6]"
                />
                <textarea
                  name="description"
                  placeholder="Goal description"
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84DCC6] resize-none"
                />
                <select
                  name="category"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84DCC6]"
                >
                  <option value="mindfulness">Mindfulness</option>
                  <option value="sleep">Sleep</option>
                  <option value="exercise">Exercise</option>
                  <option value="social">Social</option>
                  <option value="mood">Mood</option>
                </select>
                <input
                  type="date"
                  name="targetDate"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84DCC6]"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#00373E] to-[#004A56] text-white py-3 rounded-xl font-semibold hover:shadow-md transition-all"
                  >
                    Add Goal
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewGoalModal(false)}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-[#00373E] mb-4">Create New Post</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleCreatePost({
                title: formData.get('title') as string,
                content: formData.get('content') as string,
                category: formData.get('category') as string,
                isAnonymous: (formData.get('anonymous') as string) === 'on',
              });
            }}>
              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Post title"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84DCC6]"
                />
                <textarea
                  name="content"
                  placeholder="Share your thoughts..."
                  rows={4}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84DCC6] resize-none"
                />
                <select
                  name="category"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84DCC6]"
                >
                  <option value="General">General</option>
                  <option value="Mindfulness">Mindfulness</option>
                  <option value="Anxiety">Anxiety</option>
                  <option value="Depression">Depression</option>
                  <option value="Support">Support</option>
                </select>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="anonymous"
                    className="rounded border-gray-300 text-[#84DCC6] focus:ring-[#84DCC6]"
                  />
                  <span className="text-sm text-gray-700">Post anonymously</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#00373E] to-[#004A56] text-white py-3 rounded-xl font-semibold hover:shadow-md transition-all"
                  >
                    Create Post
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewPostModal(false)}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

};

export default ProfileSection;
