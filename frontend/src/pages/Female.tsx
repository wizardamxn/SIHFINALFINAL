'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Heart, BookOpen, MessageCircle, 
  User, Bell, Settings, Plus, ChevronRight, 
  Droplets, Moon, Sun, Activity, Coffee, 
  Flower2, Shield, Brain, Users, Save, X, Check,
  Star, ArrowLeft, ArrowRight, Edit, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PeriodData {
  id: string;
  startDate: string;
  endDate: string | null;
  flow: 'light' | 'medium' | 'heavy';
  symptoms: string[];
  mood: number;
  notes: string;
}

interface ExamData {
  id: string;
  examName: string;
  examDate: string;
  subject: string;
  predictedPeriodDate: string;
  conflictLevel: 'none' | 'possible' | 'likely';
}

interface CounselorData {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  availability: string[];
  price: number;
  image: string;
}

interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  intensity: number;
  cycleDay: number;
  notes: string;
}

interface Appointment {
  id: string;
  counselorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
}

const FemCareApp: React.FC = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentCycle, setCurrentCycle] = useState<number>(1);
  const [nextPeriod, setNextPeriod] = useState<Date>(new Date());
  const [periodsData, setPeriodsData] = useState<PeriodData[]>([]);
  const [examsData, setExamsData] = useState<ExamData[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showPeriodForm, setShowPeriodForm] = useState(false);
  const [showExamForm, setShowExamForm] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState<CounselorData | null>(null);
  const [currentPeriodForm, setCurrentPeriodForm] = useState({
    startDate: '',
    endDate: '',
    flow: 'medium' as 'light' | 'medium' | 'heavy',
    symptoms: [] as string[],
    mood: 5,
    notes: ''
  });
  const [currentExamForm, setCurrentExamForm] = useState({
    examName: '',
    examDate: '',
    subject: ''
  });

  // Sample data
  const symptoms = [
    { id: 'cramps', icon: '🤕', name: 'Cramps', color: 'bg-rose-100' },
    { id: 'mood', icon: '😔', name: 'Mood Swings', color: 'bg-orange-100' },
    { id: 'fatigue', icon: '😴', name: 'Fatigue', color: 'bg-blue-100' },
    { id: 'cravings', icon: '🍫', name: 'Cravings', color: 'bg-purple-100' },
    { id: 'bloating', icon: '💧', name: 'Bloating', color: 'bg-cyan-100' },
    { id: 'anxiety', icon: '😰', name: 'Anxiety', color: 'bg-yellow-100' }
  ];

  const counselors: CounselorData[] = [
    {
      id: '1',
      name: "Dr. Priya Sharma",
      specialty: "Women's Mental Health",
      rating: 4.9,
      experience: "8 years",
      availability: ['Monday', 'Tuesday', 'Thursday'],
      price: 1500,
      image: "👩‍⚕️"
    },
    {
      id: '2',
      name: "Dr. Anjali Gupta",
      specialty: "Reproductive Health",
      rating: 4.8,
      experience: "12 years",
      availability: ['Wednesday', 'Friday', 'Saturday'],
      price: 2000,
      image: "👩‍⚕️"
    },
    {
      id: '3',
      name: "Dr. Meera Patel",
      specialty: "Adolescent Counseling",
      rating: 4.9,
      experience: "6 years",
      availability: ['Monday', 'Wednesday', 'Friday'],
      price: 1200,
      image: "👩‍⚕️"
    },
    {
      id: '4',
      name: "Dr. Kavya Reddy",
      specialty: "Hormonal Health",
      rating: 4.7,
      experience: "10 years",
      availability: ['Tuesday', 'Thursday', 'Saturday'],
      price: 1800,
      image: "👩‍⚕️"
    }
  ];

  const crampRemedies = [
    { id: '1', title: "Heat Therapy", description: "Apply heating pad for 15-20 minutes", icon: "🔥", effectiveness: 4.5, tried: false },
    { id: '2', title: "Gentle Exercise", description: "Light yoga or walking", icon: "🧘‍♀️", effectiveness: 4.2, tried: false },
    { id: '3', title: "Herbal Teas", description: "Chamomile or ginger tea", icon: "🫖", effectiveness: 4.0, tried: false },
    { id: '4', title: "Magnesium", description: "Natural muscle relaxant", icon: "💊", effectiveness: 4.3, tried: false }
  ];

  // Utility Functions
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const calculateCycleDay = () => {
    if (periodsData.length === 0) return 1;
    
    const lastPeriod = periodsData[periodsData.length - 1];
    const lastStartDate = new Date(lastPeriod.startDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastStartDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const predictNextPeriod = () => {
    if (periodsData.length < 2) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek;
    }

    // Calculate average cycle length
    let totalDays = 0;
    for (let i = 1; i < periodsData.length; i++) {
      const current = new Date(periodsData[i].startDate);
      const previous = new Date(periodsData[i-1].startDate);
      const diff = (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24);
      totalDays += diff;
    }
    
    const avgCycle = Math.round(totalDays / (periodsData.length - 1));
    const lastPeriod = new Date(periodsData[periodsData.length - 1].startDate);
    
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(lastPeriod.getDate() + avgCycle);
    
    return nextPeriod;
  };

  const checkExamConflicts = () => {
    const nextPeriodDate = predictNextPeriod();
    const conflicts = examsData.filter(exam => {
      const examDate = new Date(exam.examDate);
      const timeDiff = Math.abs(examDate.getTime() - nextPeriodDate.getTime());
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return daysDiff <= 3; // Within 3 days
    });
    return conflicts;
  };

  // Event Handlers
  const handlePeriodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPeriod: PeriodData = {
      id: Date.now().toString(),
      ...currentPeriodForm
    };
    setPeriodsData([...periodsData, newPeriod]);
    setCurrentPeriodForm({
      startDate: '',
      endDate: '',
      flow: 'medium',
      symptoms: [],
      mood: 5,
      notes: ''
    });
    setShowPeriodForm(false);
  };

  const handleExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExam: ExamData = {
      id: Date.now().toString(),
      ...currentExamForm,
      predictedPeriodDate: predictNextPeriod().toISOString().split('T')[0],
      conflictLevel: 'possible'
    };
    setExamsData([...examsData, newExam]);
    setCurrentExamForm({
      examName: '',
      examDate: '',
      subject: ''
    });
    setShowExamForm(false);
  };

  const handleSymptomToggle = (symptomId: string) => {
    const newSymptoms = currentPeriodForm.symptoms.includes(symptomId)
      ? currentPeriodForm.symptoms.filter(s => s !== symptomId)
      : [...currentPeriodForm.symptoms, symptomId];
    
    setCurrentPeriodForm({
      ...currentPeriodForm,
      symptoms: newSymptoms
    });
  };

  const bookAppointment = (counselorId: string, date: string, time: string) => {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      counselorId,
      date,
      time,
      status: 'scheduled',
      notes: ''
    };
    setAppointments([...appointments, newAppointment]);
    setShowBookingModal(false);
    setSelectedCounselor(null);
  };

  const logMoodEntry = (mood: string, intensity: number) => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood,
      intensity,
      cycleDay: calculateCycleDay(),
      notes: ''
    };
    setMoodEntries([...moodEntries, newEntry]);
  };

  // Initialize data
  useEffect(() => {
    setCurrentCycle(calculateCycleDay());
    setNextPeriod(predictNextPeriod());
  }, [periodsData]);

  const TabButton = ({ id, label, icon, isActive, onClick }: any) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
        isActive 
          ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
          : 'text-stone-600 hover:bg-stone-50'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-stone-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-stone-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-stone-800 mb-1">
                Hello, Beautiful! 🌸
              </h1>
              <p className="text-stone-600">Taking care of your wellness journey</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 bg-emerald-50 rounded-xl text-emerald-600 relative">
                <Bell className="w-5 h-5" />
                {checkExamConflicts().length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </button>
              <button className="p-2 bg-stone-50 rounded-xl text-stone-600">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <TabButton id="dashboard" label="Dashboard" icon={<Calendar className="w-4 h-4" />} isActive={activeTab === 'dashboard'} onClick={setActiveTab} />
          <TabButton id="tracking" label="Period Tracker" icon={<Droplets className="w-4 h-4" />} isActive={activeTab === 'tracking'} onClick={setActiveTab} />
          <TabButton id="exams" label="Exam Alerts" icon={<BookOpen className="w-4 h-4" />} isActive={activeTab === 'exams'} onClick={setActiveTab} />
          <TabButton id="counselor" label="Counselors" icon={<Users className="w-4 h-4" />} isActive={activeTab === 'counselor'} onClick={setActiveTab} />
          <TabButton id="resources" label="Resources" icon={<Heart className="w-4 h-4" />} isActive={activeTab === 'resources'} onClick={setActiveTab} />
          <TabButton id="wellness" label="Mental Health" icon={<Brain className="w-4 h-4" />} isActive={activeTab === 'wellness'} onClick={setActiveTab} />
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Cycle Overview */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-rose-100 rounded-xl">
                    <Moon className="w-5 h-5 text-rose-600" />
                  </div>
                  <h3 className="font-semibold text-stone-800">Current Cycle</h3>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-rose-600 mb-2">Day {currentCycle}</div>
                  <p className="text-stone-600 text-sm">
                    Next period: {formatDate(nextPeriod)}
                    <br />
                    <span className="text-xs">
                      ({Math.ceil((nextPeriod.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days)
                    </span>
                  </p>
                  <div className="w-full bg-stone-100 rounded-full h-2 mt-4">
                    <div 
                      className="bg-rose-400 h-2 rounded-full transition-all" 
                      style={{width: `${Math.min((currentCycle / 28) * 100, 100)}%`}}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Recent Symptoms */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <Activity className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-stone-800">Log Symptoms</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {symptoms.map((symptom, index) => (
                    <button 
                      key={symptom.id} 
                      onClick={() => handleSymptomToggle(symptom.id)}
                      className={`p-3 rounded-xl ${symptom.color} hover:scale-105 transition-all ${
                        currentPeriodForm.symptoms.includes(symptom.id) ? 'ring-2 ring-emerald-400' : ''
                      }`}
                    >
                      <div className="text-lg mb-1">{symptom.icon}</div>
                      <div className="text-xs text-stone-700">{symptom.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <h3 className="font-semibold text-stone-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowPeriodForm(true)}
                    className="w-full flex items-center gap-3 p-3 bg-emerald-50 rounded-xl text-emerald-700 hover:bg-emerald-100 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Log Period</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('counselor')}
                    className="w-full flex items-center gap-3 p-3 bg-blue-50 rounded-xl text-blue-700 hover:bg-blue-100 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">Book Counselor</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('wellness')}
                    className="w-full flex items-center gap-3 p-3 bg-purple-50 rounded-xl text-purple-700 hover:bg-purple-100 transition-all"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">Mood Check-in</span>
                  </button>
                </div>
              </div>

              {/* Exam Conflicts Alert */}
              {checkExamConflicts().length > 0 && (
                <div className="md:col-span-2 lg:col-span-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-800">Period-Exam Conflict Alert!</h4>
                      <p className="text-amber-700 text-sm">
                        Your period might coincide with {checkExamConflicts()[0].examName}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('exams')}
                    className="text-amber-700 text-sm font-medium hover:text-amber-800"
                  >
                    View Details →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Period Tracking */}
          {activeTab === 'tracking' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-stone-800">Period Tracking</h2>
                <button 
                  onClick={() => setShowPeriodForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Log Period
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <h3 className="font-semibold text-stone-800 mb-4">Recent Periods</h3>
                  {periodsData.length === 0 ? (
                    <div className="text-center py-8 text-stone-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 text-stone-300" />
                      <p>No periods logged yet</p>
                      <button 
                        onClick={() => setShowPeriodForm(true)}
                        className="mt-3 text-emerald-600 hover:text-emerald-700"
                      >
                        Log your first period
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {periodsData.slice(-5).reverse().map((period) => (
                        <div key={period.id} className="p-4 border border-stone-200 rounded-xl">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-stone-800">
                                {formatDate(period.startDate)}
                                {period.endDate && ` - ${formatDate(period.endDate)}`}
                              </p>
                              <p className="text-sm text-stone-600 capitalize">
                                {period.flow} flow • Mood: {period.mood}/10
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button className="p-1 text-stone-400 hover:text-stone-600">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setPeriodsData(periodsData.filter(p => p.id !== period.id))}
                                className="p-1 text-red-400 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          {period.symptoms.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {period.symptoms.map((symptomId) => {
                                const symptom = symptoms.find(s => s.id === symptomId);
                                return symptom ? (
                                  <span key={symptomId} className="px-2 py-1 bg-stone-100 rounded text-xs">
                                    {symptom.icon} {symptom.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          )}
                          {period.notes && (
                            <p className="text-sm text-stone-600 mt-2 italic">"{period.notes}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <h3 className="font-semibold text-stone-800 mb-4">Cycle Insights</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-rose-50 rounded-xl">
                      <span className="text-stone-700">Current Cycle Day</span>
                      <span className="font-semibold text-rose-600">{currentCycle}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                      <span className="text-stone-700">Average Cycle</span>
                      <span className="font-semibold text-blue-600">
                        {periodsData.length >= 2 ? '28 days' : 'Not enough data'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
                      <span className="text-stone-700">Next Period</span>
                      <span className="font-semibold text-emerald-600">
                        {formatDate(nextPeriod)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                      <span className="text-stone-700">Periods Logged</span>
                      <span className="font-semibold text-purple-600">{periodsData.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Exam Alerts */}
          {activeTab === 'exams' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-stone-800">Exam Period Coordinator</h2>
                <button 
                  onClick={() => setShowExamForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Exam
                </button>
              </div>

              {checkExamConflicts().length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-800">Upcoming Conflicts</h4>
                      <p className="text-amber-700 text-sm">
                        {checkExamConflicts().length} exam(s) might coincide with your period
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-amber-800">
                    <p>• Pack extra supplies in your exam bag</p>
                    <p>• Consider pain relief options beforehand</p>
                    <p>• Inform a trusted friend or teacher if needed</p>
                    <p>• Practice relaxation techniques</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <h3 className="font-semibold text-stone-800 mb-4">Upcoming Exams</h3>
                  {examsData.length === 0 ? (
                    <div className="text-center py-8 text-stone-500">
                      <BookOpen className="w-12 h-12 mx-auto mb-3 text-stone-300" />
                      <p>No exams added yet</p>
                      <button 
                        onClick={() => setShowExamForm(true)}
                        className="mt-3 text-blue-600 hover:text-blue-700"
                      >
                        Add your first exam
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {examsData.map((exam) => {
                        const isConflict = checkExamConflicts().some(c => c.id === exam.id);
                        return (
                          <div key={exam.id} className={`p-4 border rounded-xl ${
                            isConflict ? 'border-amber-300 bg-amber-50' : 'border-stone-200'
                          }`}>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-stone-800">{exam.examName}</h4>
                                <p className="text-sm text-stone-600">{exam.subject}</p>
                                <p className="text-sm text-stone-600">{formatDate(exam.examDate)}</p>
                              </div>
                              {isConflict && (
                                <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs rounded">
                                  ⚠️ Conflict
                                </span>
                              )}
                            </div>
                            <button 
                              onClick={() => setExamsData(examsData.filter(e => e.id !== exam.id))}
                              className="text-red-400 hover:text-red-600 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <h3 className="font-semibold text-stone-800 mb-4">Exam Preparation Tips</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-xl">
                      <h4 className="font-medium text-green-800 mb-2">🎒 Exam Day Prep</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Pack period supplies (pads, tampons)</li>
                        <li>• Carry pain relief medication</li>
                        <li>• Bring a water bottle</li>
                        <li>• Wear comfortable clothes</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-medium text-blue-800 mb-2">🧘‍♀️ Stress Management</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Practice deep breathing</li>
                        <li>• Get adequate sleep</li>
                        <li>• Do light stretching</li>
                        <li>• Stay positive and confident</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Female Counselors */}
          {activeTab === 'counselor' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-stone-800">Female Counselors & Specialists</h2>
                <div className="text-sm text-stone-600">
                  {appointments.filter(a => a.status === 'scheduled').length} appointments scheduled
                </div>
              </div>

              {/* Upcoming Appointments */}
              {appointments.filter(a => a.status === 'scheduled').length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h3 className="font-medium text-green-800 mb-3">📅 Upcoming Appointments</h3>
                  <div className="space-y-2">
                    {appointments.filter(a => a.status === 'scheduled').map(appointment => {
                      const counselor = counselors.find(c => c.id === appointment.counselorId);
                      return (
                        <div key={appointment.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div>
                            <p className="font-medium text-stone-800">{counselor?.name}</p>
                            <p className="text-sm text-stone-600">
                              {formatDate(appointment.date)} at {appointment.time}
                            </p>
                          </div>
                          <button 
                            onClick={() => setAppointments(appointments.filter(a => a.id !== appointment.id))}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {counselors.map((counselor) => (
                  <div key={counselor.id} className="p-6 bg-white border border-stone-200 rounded-xl hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-2xl">
                        {counselor.image}
                      </div>
                      <div>
                        <h4 className="font-medium text-stone-800">{counselor.name}</h4>
                        <p className="text-sm text-stone-600">{counselor.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-stone-600 ml-1">{counselor.rating}</span>
                          </div>
                          <span className="text-stone-400">•</span>
                          <span className="text-sm text-stone-600">{counselor.experience}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-stone-600 mb-2">Available:</p>
                      <div className="flex flex-wrap gap-1">
                        {counselor.availability.map(day => (
                          <span key={day} className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded">
                            {day}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-stone-600 mt-2">₹{counselor.price}/session</p>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setSelectedCounselor(counselor);
                        setShowBookingModal(true);
                      }}
                      className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition-all"
                    >
                      Book Appointment
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cramp Resources */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-stone-800">Period Cramp Relief</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {crampRemedies.map((remedy) => (
                  <div key={remedy.id} className="p-6 bg-white border border-stone-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{remedy.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-stone-800">{remedy.title}</h4>
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[1,2,3,4,5].map(star => (
                              <Star 
                                key={star} 
                                className={`w-3 h-3 ${
                                  star <= remedy.effectiveness ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-stone-600">{remedy.effectiveness}/5</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const updatedRemedies = crampRemedies.map(r => 
                            r.id === remedy.id ? {...r, tried: !r.tried} : r
                          );
                          // In a real app, you'd update state here
                        }}
                        className={`p-2 rounded-full transition-all ${
                          remedy.tried 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-stone-600">{remedy.description}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100">
                <h3 className="font-semibold text-rose-800 mb-4">🌸 Self-Care Rituals</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: "🛁", title: "Warm Bath", desc: "Add Epsom salts", completed: false },
                    { icon: "🕯️", title: "Aromatherapy", desc: "Lavender or chamomile", completed: false },
                    { icon: "🧘‍♀️", title: "Gentle Yoga", desc: "Child's pose, cat-cow", completed: false },
                    { icon: "☕", title: "Herbal Tea", desc: "Ginger or raspberry leaf", completed: false }
                  ].map((item, index) => (
                    <button 
                      key={index} 
                      className="text-center p-4 bg-white rounded-xl border border-rose-100 hover:shadow-md transition-all group"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
                      <h4 className="font-medium text-stone-800 text-sm">{item.title}</h4>
                      <p className="text-xs text-stone-600">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mental Health */}
          {activeTab === 'wellness' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-stone-800">Period & Mental Health</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <h4 className="font-medium text-blue-800 mb-2">🧠 Did You Know?</h4>
                <p className="text-blue-700 text-sm">
                  Hormonal changes during your cycle can affect mood, anxiety levels, and cognitive function. 
                  You're not imagining it - it's science!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <h4 className="font-medium text-stone-800 mb-4">Quick Mood Check-in</h4>
                  <div className="space-y-3">
                    {['😊 Happy', '😔 Sad', '😰 Anxious', '😴 Tired', '😡 Irritated'].map((mood, index) => (
                      <button 
                        key={mood}
                        onClick={() => logMoodEntry(mood.split(' ')[1], Math.floor(Math.random() * 5) + 1)}
                        className="w-full flex items-center gap-3 p-3 border border-stone-200 rounded-lg hover:bg-stone-50 transition-all group"
                      >
                        <span className="group-hover:scale-110 transition-transform">{mood}</span>
                        <div className="flex-1 bg-stone-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-400 h-2 rounded-full transition-all"
                            style={{width: `${(index + 1) * 20}%`}}
                          ></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <h4 className="font-medium text-stone-800 mb-4">Recent Mood Entries</h4>
                  {moodEntries.length === 0 ? (
                    <div className="text-center py-8 text-stone-500">
                      <Brain className="w-12 h-12 mx-auto mb-3 text-stone-300" />
                      <p>No mood entries yet</p>
                      <p className="text-sm">Start tracking your mood above</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {moodEntries.slice(-5).reverse().map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                          <div>
                            <p className="font-medium text-stone-800">{entry.mood}</p>
                            <p className="text-sm text-stone-600">
                              {formatDate(entry.date)} • Day {entry.cycleDay}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex">
                              {[1,2,3,4,5].map(star => (
                                <Star 
                                  key={star} 
                                  className={`w-3 h-3 ${
                                    star <= entry.intensity ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <h4 className="font-medium text-emerald-800 mb-4">💚 Wellness Tips</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Practice deep breathing exercises during PMS",
                    "Keep a mood journal to track patterns",
                    "Maintain regular sleep schedule",
                    "Stay hydrated and eat balanced meals",
                    "Consider meditation or mindfulness apps",
                    "Exercise regularly, even light walking helps"
                  ].map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-emerald-800">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Period Form Modal */}
      <AnimatePresence>
        {showPeriodForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-stone-800">Log Period</h3>
                <button 
                  onClick={() => setShowPeriodForm(false)}
                  className="p-2 hover:bg-stone-100 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handlePeriodSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={currentPeriodForm.startDate}
                    onChange={(e) => setCurrentPeriodForm({...currentPeriodForm, startDate: e.target.value})}
                    className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    End Date (optional)
                  </label>
                  <input
                    type="date"
                    value={currentPeriodForm.endDate}
                    onChange={(e) => setCurrentPeriodForm({...currentPeriodForm, endDate: e.target.value})}
                    className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Flow Intensity
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['light', 'medium', 'heavy'] as const).map((flow) => (
                      <button
                        key={flow}
                        type="button"
                        onClick={() => setCurrentPeriodForm({...currentPeriodForm, flow})}
                        className={`p-3 border rounded-lg text-sm capitalize transition-all ${
                          currentPeriodForm.flow === flow
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {flow}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Symptoms
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {symptoms.map((symptom) => (
                      <button
                        key={symptom.id}
                        type="button"
                        onClick={() => handleSymptomToggle(symptom.id)}
                        className={`p-3 border rounded-lg text-sm transition-all ${
                          currentPeriodForm.symptoms.includes(symptom.id)
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {symptom.icon} {symptom.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Mood (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentPeriodForm.mood}
                    onChange={(e) => setCurrentPeriodForm({...currentPeriodForm, mood: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-stone-500">
                    <span>😞 Poor</span>
                    <span className="font-medium">{currentPeriodForm.mood}/10</span>
                    <span>😊 Great</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={currentPeriodForm.notes}
                    onChange={(e) => setCurrentPeriodForm({...currentPeriodForm, notes: e.target.value})}
                    placeholder="How are you feeling? Any additional notes..."
                    className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPeriodForm(false)}
                    className="flex-1 py-3 border border-stone-200 rounded-lg hover:bg-stone-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all"
                  >
                    Save Period
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exam Form Modal */}
      <AnimatePresence>
        {showExamForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-stone-800">Add Exam</h3>
                <button 
                  onClick={() => setShowExamForm(false)}
                  className="p-2 hover:bg-stone-100 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleExamSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Exam Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentExamForm.examName}
                    onChange={(e) => setCurrentExamForm({...currentExamForm, examName: e.target.value})}
                    placeholder="e.g., Mathematics Final"
                    className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentExamForm.subject}
                    onChange={(e) => setCurrentExamForm({...currentExamForm, subject: e.target.value})}
                    placeholder="e.g., Mathematics"
                    className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Exam Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={currentExamForm.examDate}
                    onChange={(e) => setCurrentExamForm({...currentExamForm, examDate: e.target.value})}
                    className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowExamForm(false)}
                    className="flex-1 py-3 border border-stone-200 rounded-lg hover:bg-stone-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                  >
                    Add Exam
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && selectedCounselor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-stone-800">Book Appointment</h3>
                <button 
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 hover:bg-stone-100 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-4 p-4 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{selectedCounselor.image}</div>
                  <div>
                    <h4 className="font-medium text-emerald-800">{selectedCounselor.name}</h4>
                    <p className="text-sm text-emerald-600">{selectedCounselor.specialty}</p>
                    <p className="text-sm text-emerald-600">₹{selectedCounselor.price}/session</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          bookAppointment(selectedCounselor.id, selectedDate, time);
                        }}
                        disabled={!selectedDate}
                        className="p-3 border border-stone-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 py-3 border border-stone-200 rounded-lg hover:bg-stone-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FemCareApp;
