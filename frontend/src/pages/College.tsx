import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Heart, TrendingUp, Eye, LogOut, Shield, Calendar, Activity, School } from 'lucide-react';

interface MoodData {
  mood: string;
  count: number;
  percentage: number;
  color: string;
}

interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  journalEntries: number;
  moodDistribution: MoodData[];
  weeklyGrowth: number;
  departmentBreakdown: { department: string; userCount: number }[];
}

interface CollegeAdmin {
  name: string;
  collegeName: string;
  email: string;
}

const CollegeDashboard: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setAdmin] = useState<CollegeAdmin | null>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '', collegeName: '' });
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Mock data - in real app, this would come from API with sentiment analysis
  const mockStats: DashboardStats = {
    totalStudents: 1247,
    activeStudents: 892,
    journalEntries: 3456,
    moodDistribution: [
      { mood: 'Happy', count: 428, percentage: 34.3, color: 'bg-green-500' },
      { mood: 'Neutral', count: 312, percentage: 25.0, color: 'bg-amber-500' },
      { mood: 'Anxious', count: 289, percentage: 23.2, color: 'bg-orange-500' },
      { mood: 'Sad', count: 156, percentage: 12.5, color: 'bg-blue-500' },
      { mood: 'Stressed', count: 62, percentage: 5.0, color: 'bg-red-500' }
    ],
    weeklyGrowth: 12.5,
    departmentBreakdown: [
      { department: 'Engineering', userCount: 345 },
      { department: 'Business', userCount: 298 },
      { department: 'Arts & Sciences', userCount: 267 },
      { department: 'Medicine', userCount: 189 },
      { department: 'Law', userCount: 148 }
    ]
  };

  useEffect(() => {
    // Check if admin is already logged in
    const savedAdmin = localStorage.getItem('college-admin');
    if (savedAdmin) {
      const adminData = JSON.parse(savedAdmin);
      setAdmin(adminData);
      setIsLoggedIn(true);
      setStats(mockStats);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock login validation
    if (loginForm.email && loginForm.password.length >= 6 && loginForm.collegeName) {
      const adminData: CollegeAdmin = {
        name: 'Admin Dashboard',
        collegeName: loginForm.collegeName,
        email: loginForm.email
      };

      setAdmin(adminData);
      setIsLoggedIn(true);
      setStats(mockStats);
      localStorage.setItem('college-admin', JSON.stringify(adminData));
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdmin(null);
    setStats(null);
    localStorage.removeItem('college-admin');
  };

  // Login Form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="p-3 bg-teal-100 rounded-full w-fit mx-auto mb-4">
              <School className="w-8 h-8 text-teal-600" />
            </div>
            <h1 className="text-2xl font-bold text-stone-800">College Dashboard</h1>
            <p className="text-stone-600 mt-2">Student Mental Health Analytics Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">College Name</label>
              <input
                type="text"
                value={loginForm.collegeName}
                onChange={(e) => setLoginForm({...loginForm, collegeName: e.target.value})}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your college name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Admin Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="admin@college.edu"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your password"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Access Dashboard
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 mb-2"><strong>Demo Login:</strong></p>
            <p className="text-xs text-blue-700">College: Delhi University</p>
            <p className="text-xs text-blue-700">Email: admin@du.ac.in</p>
            <p className="text-xs text-blue-700">Password: admin123</p>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <School className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-stone-800">{admin?.collegeName}</h1>
                <p className="text-sm text-stone-600">Student Mental Health Analytics</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-stone-600">Total Students</p>
                <p className="text-2xl font-bold text-stone-800">{stats?.totalStudents.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-stone-600">Active Users</p>
                <p className="text-2xl font-bold text-stone-800">{stats?.activeStudents.toLocaleString()}</p>
                <p className="text-xs text-green-600">71.5% engagement</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Heart className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-stone-600">Journal Entries</p>
                <p className="text-2xl font-bold text-stone-800">{stats?.journalEntries.toLocaleString()}</p>
                <p className="text-xs text-amber-600">2.8 avg per student</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-stone-600">Weekly Growth</p>
                <p className="text-2xl font-bold text-stone-800">+{stats?.weeklyGrowth}%</p>
                <p className="text-xs text-teal-600">New registrations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Mood Distribution */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-stone-200">
            <h2 className="text-lg font-semibold text-stone-800 mb-6">Student Mood Distribution</h2>
            <div className="space-y-4">
              {stats?.moodDistribution.map((mood, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-stone-700">{mood.mood}</span>
                    <span className="text-sm text-stone-600">{mood.percentage}%</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${mood.color} transition-all duration-500`}
                      style={{ width: `${mood.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-stone-500">{mood.count} students</div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
            <h2 className="text-lg font-semibold text-stone-800 mb-6">Department Usage</h2>
            <div className="space-y-4">
              {stats?.departmentBreakdown.map((dept, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-stone-700">{dept.department}</span>
                  <span className="text-sm font-semibold text-stone-800">{dept.userCount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200 mb-8">
          <h2 className="text-lg font-semibold text-stone-800 mb-6">Campus Mental Health Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-green-100 rounded">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">Positive Campus Climate</p>
                    <p className="text-xs text-green-700">59.3% of students report positive/neutral moods</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-amber-100 rounded">
                    <Eye className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-800">Intervention Opportunity</p>
                    <p className="text-xs text-amber-700">23.2% experiencing anxiety - consider counseling workshops</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-blue-100 rounded">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">High Engagement</p>
                    <p className="text-xs text-blue-700">71.5% active participation in mental health tracking</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-red-100 rounded">
                    <Shield className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-800">Priority Support</p>
                    <p className="text-xs text-red-700">5% stressed students need immediate counseling resources</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Compliance */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-stone-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-stone-800 mb-2">Student Privacy Protection</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                All student data is completely anonymized and aggregated for institutional analysis only. 
                Individual student identities and personal journal content are never accessible through this dashboard. 
                Sentiment analysis provides insights while maintaining complete student confidentiality and FERPA compliance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDashboard;