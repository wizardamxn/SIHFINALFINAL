import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Video, Phone, MapPin, Search, Star, Globe, Languages, Heart, Sparkles, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Therapist {
  id: string;
  name: string;
  specialty: string;
  location: string;
  languages: string[];
  rating: number;
  fee: number;
  avatar?: string;
}

const mockTherapists: Therapist[] = [
  { id: "t1", name: "Dr. Priya Sharma", specialty: "Cognitive Behavioral Therapy", location: "Mumbai", languages: ["English", "Hindi"], rating: 4.9, fee: 1500 },
  { id: "t2", name: "Dr. Arjun Mehta", specialty: "Anxiety & Stress", location: "Delhi", languages: ["English", "Hindi"], rating: 4.8, fee: 1200 },
  { id: "t3", name: "Dr. Kavya Iyer", specialty: "Adolescent Counseling", location: "Chennai", languages: ["English", "Tamil"], rating: 4.7, fee: 1000 },
  { id: "t4", name: "Dr. Aisha Khan", specialty: "Trauma-Informed Care", location: "Bengaluru", languages: ["English", "Kannada", "Hindi"], rating: 4.8, fee: 1800 },
  { id: "t5", name: "Dr. Rohan Desai", specialty: "Depression Management", location: "Ahmedabad", languages: ["English", "Gujarati", "Hindi"], rating: 4.6, fee: 1100 },
  { id: "t6", name: "Dr. Nisha Verma", specialty: "Relationship Counseling", location: "Pune", languages: ["English", "Hindi", "Marathi"], rating: 4.7, fee: 1400 },
  { id: "t7", name: "Dr. Sameer Kulkarni", specialty: "Mindfulness-Based Therapy", location: "Bengaluru", languages: ["English", "Hindi", "Marathi"], rating: 4.5, fee: 900 },
  { id: "t8", name: "Dr. Meera Nair", specialty: "Grief Counseling", location: "Kochi", languages: ["English", "Malayalam"], rating: 4.8, fee: 1600 },
  { id: "t9", name: "Dr. Tanvi Gupta", specialty: "Child Psychology", location: "Jaipur", languages: ["English", "Hindi"], rating: 4.6, fee: 1300 },
  { id: "t10", name: "Dr. Aditya Rao", specialty: "Addiction Counseling", location: "Hyderabad", languages: ["English", "Telugu", "Hindi"], rating: 4.7, fee: 1700 },
  { id: "t11", name: "Dr. Sanya Malhotra", specialty: "Eating Disorders", location: "Delhi", languages: ["English", "Hindi"], rating: 4.9, fee: 1900 },
  { id: "t12", name: "Dr. Vivek Reddy", specialty: "Sleep Disorders", location: "Hyderabad", languages: ["English", "Telugu"], rating: 4.4, fee: 1000 },
  { id: "t13", name: "Dr. Pooja Banerjee", specialty: "Perinatal Mental Health", location: "Kolkata", languages: ["English", "Bengali", "Hindi"], rating: 4.8, fee: 1800 },
  { id: "t14", name: "Dr. Imran Sheikh", specialty: "PTSD", location: "Lucknow", languages: ["English", "Hindi", "Urdu"], rating: 4.5, fee: 1200 },
  { id: "t15", name: "Dr. Neha Joshi", specialty: "Workplace Stress", location: "Mumbai", languages: ["English", "Hindi", "Marathi"], rating: 4.7, fee: 1500 },
  { id: "t16", name: "Dr. Rahul Singh", specialty: "Anger Management", location: "Noida", languages: ["English", "Hindi"], rating: 4.3, fee: 900 },
  { id: "t17", name: "Dr. Aditi Menon", specialty: "Family Therapy", location: "Thiruvananthapuram", languages: ["English", "Malayalam"], rating: 4.6, fee: 1400 },
  { id: "t18", name: "Dr. Karan Patel", specialty: "OCD Treatment", location: "Surat", languages: ["English", "Gujarati", "Hindi"], rating: 4.5, fee: 1100 },
  { id: "t19", name: "Dr. Shreya Sood", specialty: "Bipolar Disorder", location: "Chandigarh", languages: ["English", "Hindi", "Punjabi"], rating: 4.7, fee: 1600 },
  { id: "t20", name: "Dr. Farah Ali", specialty: "LGBTQ+ Affirmative Therapy", location: "Pune", languages: ["English", "Hindi"], rating: 4.9, fee: 2000 },
];

const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "16:00", "16:30", "17:00", "17:30"];

const next7Days = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return d;
});

// Organic shape components
const FloatingShape = ({ className, children }: { className: string, children: React.ReactNode }) => (
  <div className={`absolute rounded-full ${className}`}>
    {children}
  </div>
);

const Bookings: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState<string>("");
  const [cityFilter, setCityFilter] = useState<string>("");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("");
  const [sortKey, setSortKey] = useState<"relevance" | "rating_desc" | "fee_asc" | "fee_desc">("relevance");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(next7Days[0]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [mode, setMode] = useState<"video" | "voice">("video");
  const [reminder, setReminder] = useState<boolean>(true);

  // persist favorites in localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("favoriteTherapists");
      if (raw) setFavorites(new Set(JSON.parse(raw)));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("favoriteTherapists", JSON.stringify(Array.from(favorites)));
    } catch {}
  }, [favorites]);

  // Lock page scroll when booking modal is open
  useEffect(() => {
    const original = document.body.style.overflow;
    if (selectedTherapist) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = original || '';
    }
    return () => {
      document.body.style.overflow = original || '';
    };
  }, [selectedTherapist]);

  const uniqueLanguages = useMemo(
    () => Array.from(new Set(mockTherapists.flatMap(t => t.languages))).sort(),
    []
  );
  const uniqueSpecialties = useMemo(
    () => Array.from(new Set(mockTherapists.map(t => t.specialty))).sort(),
    []
  );

  const baseFiltered = mockTherapists.filter(t =>
    (!query || t.name.toLowerCase().includes(query.toLowerCase()) || t.specialty.toLowerCase().includes(query.toLowerCase())) &&
    (!languageFilter || t.languages.includes(languageFilter)) &&
    (!cityFilter || t.location.toLowerCase().includes(cityFilter.toLowerCase())) &&
    (!specialtyFilter || t.specialty === specialtyFilter) &&
    (!favoritesOnly || favorites.has(t.id))
  );

  const filtered = [...baseFiltered].sort((a, b) => {
    switch (sortKey) {
      case "rating_desc":
        return b.rating - a.rating;
      case "fee_asc":
        return a.fee - b.fee;
      case "fee_desc":
        return b.fee - a.fee;
      default:
        return 0; // relevance (keep original order)
    }
  });

  const handleConfirm = () => {
    if (!selectedTherapist || !selectedDate || !selectedTime) return;
    alert(`Booked ${mode} session with ${selectedTherapist.name} on ${selectedDate.toDateString()} at ${selectedTime}${reminder ? " with reminder" : ""}.`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFF5E6 0%, #F0F8FF 50%, #E8F5E8 100%)' }}>
      {/* Decorative floating shapes */}
      <FloatingShape className="w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-500 top-10 left-10 opacity-80 animate-pulse">
        <div className="w-full h-full flex items-center justify-center text-4xl">😊</div>
      </FloatingShape>
      
      <FloatingShape className="w-28 h-28 md:w-36 md:h-36 bg-gradient-to-br from-pink-400 to-pink-500 top-6 right-6 md:top-20 md:right-20 opacity-90 shadow-2xl ring-2 ring-white/40 z-40">
        <button
          type="button"
          onClick={() => navigate('/bot')}
          className="w-full h-full rounded-full flex flex-col gap-1 items-center justify-center text-white font-semibold text-[11px] md:text-sm leading-tight focus:outline-none focus:ring-4 focus:ring-pink-300 hover:scale-105 active:scale-95 transition-transform cursor-pointer select-none"
          aria-label="Chat with bot"
          title="Chat with bot"
        >
          <span className="text-2xl md:text-3xl drop-shadow-sm">🤖</span>
          <span className="drop-shadow">Chat with Bot</span>
        </button>
      </FloatingShape>
      
      <FloatingShape className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-500 bottom-32 left-20 opacity-60">
        <div className="w-full h-full flex items-center justify-center text-xl">💚</div>
      </FloatingShape>
      
      <FloatingShape className="w-28 h-28 bg-gradient-to-br from-blue-400 to-blue-500 bottom-20 right-32 opacity-50">
        <div className="w-full h-full flex items-center justify-center text-3xl">✨</div>
      </FloatingShape>

      {/* Organic blob shapes */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10" viewBox="0 0 1000 1000">
        <path d="M200,300 Q400,200 600,350 Q800,500 700,700 Q500,800 300,650 Q100,500 200,300" fill="#84DCC6" />
        <path d="M700,150 Q900,250 850,450 Q800,650 600,600 Q400,550 450,350 Q500,150 700,150" fill="#FFB366" />
        <path d="M150,600 Q350,550 400,750 Q450,950 250,900 Q50,850 100,650 Q150,450 150,600" fill="#FF9999" />
      </svg>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-lg border border-white/50">
            <Heart className="w-6 h-6 text-pink-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-700 to-blue-700 bg-clip-text text-transparent">WellNest</span>
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-700 via-blue-700 to-purple-700 bg-clip-text text-transparent leading-tight">
            Support for Your
            <br />
            <span className="text-6xl md:text-7xl">Mental Well-being</span>
          </h1>
          
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto font-medium">
            Connect with licensed therapists, counselors, and wellness coaches to support your journey towards better mental health.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-teal-700 font-semibold">
            <Users className="w-5 h-5" />
            <span>Trusted by 10,000+ clients</span>
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <span>4.9/5 average rating</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Filters */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Find Your Perfect Match</h2>
            </div>
            
            <div className="space-y-6">
              <div className="relative">
                <Search className="w-5 h-5 text-teal-500 absolute left-4 top-4" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name or specialty"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-gray-700 font-medium"
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block">Preferred Language</label>
                <div className="relative">
                  <Languages className="w-5 h-5 text-teal-500 absolute left-4 top-4" />
                  <select
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-gray-700 font-medium"
                  >
                    <option value="">Any Language</option>
                    {uniqueLanguages.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block">Specialty</label>
                <div className="relative">
                  <select
                    value={specialtyFilter}
                    onChange={(e) => setSpecialtyFilter(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-gray-700 font-medium"
                  >
                    <option value="">Any Specialty</option>
                    {uniqueSpecialties.map((sp) => (
                      <option key={sp} value={sp}>{sp}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block">City</label>
                <input
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  placeholder="e.g., Mumbai, Delhi, Chennai"
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-gray-700 font-medium"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={favoritesOnly}
                    onChange={(e) => setFavoritesOnly(e.target.checked)}
                    className="w-5 h-5 text-teal-500 rounded focus:ring-2 focus:ring-teal-400"
                  />
                  <span className="text-gray-700 font-medium">Favorites only</span>
                </label>
                <button
                  type="button"
                  onClick={() => { setQuery(""); setLanguageFilter(""); setCityFilter(""); setSpecialtyFilter(""); setFavoritesOnly(false); setSortKey("relevance"); }}
                  className="text-teal-700 font-semibold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            </div>
          </div>

          {/* Middle & Right: Directory */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Our Verified Therapists</h2>
                <div className="ml-auto flex items-center gap-3">
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                    {filtered.length} available
                  </div>
                  <select
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value as any)}
                    className="px-3 py-2 rounded-xl border-2 border-gray-200 text-gray-700 font-medium bg-white"
                    title="Sort by"
                  >
                    <option value="relevance">Sort: Relevance</option>
                    <option value="rating_desc">Sort: Rating (High → Low)</option>
                    <option value="fee_asc">Sort: Fee (Low → High)</option>
                    <option value="fee_desc">Sort: Fee (High → Low)</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((t, index) => (
                  <div
                    key={t.id}
                    className="group p-6 rounded-3xl border-2 border-gray-100 bg-white hover:shadow-2xl hover:border-teal-200 transition-all duration-300 transform hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {t.name.split(" ").map(s => s[0]).slice(0,2).join("")}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg group-hover:text-teal-700 transition-colors">{t.name}</h3>
                            <p className="text-gray-600 font-medium">{t.specialty}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              aria-label={favorites.has(t.id) ? 'Remove from favorites' : 'Add to favorites'}
                              onClick={() => setFavorites(prev => {
                                const n = new Set(prev);
                                if (n.has(t.id)) n.delete(t.id); else n.add(t.id);
                                return n;
                              })}
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-rose-50 transition-colors"
                            >
                              <Heart className={`w-5 h-5 ${favorites.has(t.id) ? 'text-rose-500 fill-current' : 'text-gray-300'}`} />
                            </button>
                            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                              <Star className="w-4 h-4 fill-current" />
                              {t.rating.toFixed(1)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">{t.location}</span>
                          {t.languages.map(l => (
                            <span key={l} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{l}</span>
                          ))}
                          <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 rounded-full text-sm font-bold">₹{t.fee}</span>
                        </div>
                        
                        <button 
                          onClick={() => setSelectedTherapist(t)} 
                          className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold hover:from-teal-600 hover:to-blue-600 transform transition-all duration-200 hover:scale-105 shadow-lg"
                        >
                          Book Session
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Modal */}
            {selectedTherapist && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedTherapist(null)} />
                <div className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Book with {selectedTherapist.name}</h3>
                      <p className="text-gray-600 font-medium">{selectedTherapist.specialty} • {selectedTherapist.location}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedTherapist(null)} 
                      className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all"
                    >
                      ×
                    </button>
                  </div>

                  {/* Mode Selection */}
                  <div className="flex gap-4 mb-8">
                    <button 
                      onClick={() => setMode("video")} 
                      className={`flex-1 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                        mode==='video' 
                          ? 'bg-gradient-to-r from-teal-400 to-teal-500 text-white shadow-lg transform scale-105' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Video className="w-5 h-5" />
                      Video Session
                    </button>
                    <button 
                      onClick={() => setMode("voice")} 
                      className={`flex-1 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                        mode==='voice' 
                          ? 'bg-gradient-to-r from-teal-400 to-teal-500 text-white shadow-lg transform scale-105' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Phone className="w-5 h-5" />
                      Voice Call
                    </button>
                  </div>

                  {/* Calendar & Time Selection */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 mb-4">Select Date</h4>
                        <div className="grid grid-cols-7 gap-3">
                          {next7Days.map((d) => (
                            <button
                              key={d.toDateString()}
                              onClick={() => setSelectedDate(d)}
                              className={`p-4 rounded-2xl border-2 text-center transition-all transform hover:scale-105 ${
                                selectedDate?.toDateString()===d.toDateString() 
                                  ? 'bg-gradient-to-br from-blue-400 to-purple-500 border-transparent text-white shadow-lg' 
                                  : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-md'
                              }`}
                            >
                              <div className="font-bold text-sm">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                              <div className="text-lg font-bold">{d.getDate()}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-gray-800 mb-4">Available Time Slots</h4>
                        <div className="grid grid-cols-4 gap-3">
                          {timeSlots.map((t) => (
                            <button
                              key={t}
                              onClick={() => setSelectedTime(t)}
                              className={`px-4 py-3 rounded-2xl border-2 font-semibold transition-all transform hover:scale-105 ${
                                selectedTime===t 
                                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 border-transparent text-white shadow-lg' 
                                  : 'bg-white border-gray-200 text-gray-700 hover:border-yellow-300 hover:shadow-md'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-6 border-2 border-orange-200">
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-orange-500" />
                        Booking Summary
                      </h4>
                      <div className="space-y-3 text-gray-700">
                        <div className="flex justify-between">
                          <span className="font-medium">Therapist:</span>
                          <span className="font-bold">{selectedTherapist.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Date:</span>
                          <span className="font-bold">{selectedDate?.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Time:</span>
                          <span className="font-bold">{selectedTime || 'Not selected'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Mode:</span>
                          <span className="font-bold capitalize">{mode}</span>
                        </div>
                        <div className="flex justify-between text-lg">
                          <span className="font-bold">Total Fee:</span>
                          <span className="font-bold text-orange-600">₹{selectedTherapist.fee}</span>
                        </div>
                        
                        <label className="flex items-center gap-3 mt-4 p-3 bg-white rounded-2xl">
                          <input 
                            type="checkbox" 
                            checked={reminder} 
                            onChange={(e) => setReminder(e.target.checked)} 
                            className="w-5 h-5 text-teal-500 rounded focus:ring-2 focus:ring-teal-400"
                          />
                          <span className="font-medium">Send me a reminder</span>
                        </label>
                      </div>
                      
                      <button 
                        onClick={handleConfirm} 
                        disabled={!selectedTime} 
                        className="mt-6 w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-teal-600 hover:to-blue-600 transform transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        {selectedTime ? 'Confirm Booking ✨' : 'Select Time Slot'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;