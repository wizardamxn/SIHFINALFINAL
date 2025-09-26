import React, { useState, useEffect } from "react";
import {
  Flame,
  Monitor,
  Waves,
  User,
  MapPin,
  Apple,
  Circle,
  Pen,
  Image,
  Bed,
  Leaf,
  Heart,
  Wind,
  Mountain,
  Music,
  BookOpen,
  Smile,
  Zap,
  Users,
  Brain,
  Palette,
  Coffee,
  Sun,
  Moon,
  Headphones,
  Camera,
  Gamepad2,
  TreePine,
  Star,
  Play,
  Pause,
  ChevronRight,
  Timer,
  Target,
  Award,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";

// YouTube Embed Component
const YouTubeEmbed = ({ embedId, onClose }) => (
  <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold text-[#00373E]">Video Player</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="video-responsive">
        <iframe
          width="853"
          height="480"
          src={`https://www.youtube.com/embed/${embedId}?autoplay=1&rel=0`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Mental Health Video"
        />
      </div>
    </div>
  </div>
);

// Vimeo Embed Component
const VimeoEmbed = ({ embedId, onClose }) => (
  <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold text-[#00373E]">Video Player</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="video-responsive">
        <iframe
          src={`https://player.vimeo.com/video/${embedId}?autoplay=1&title=0&byline=0&portrait=0`}
          width="640"
          height="360"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Mental Health Video"
        />
      </div>
    </div>
  </div>
);

const MentalHealthResources = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentTip, setCurrentTip] = useState(0);
  const [activeVideo, setActiveVideo] = useState(null);

  // Add CSS for responsive video
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .video-responsive {
        overflow: hidden;
        padding-bottom: 56.25%;
        position: relative;
        height: 0;
      }
      .video-responsive iframe {
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        position: absolute;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Rotating tips animation
  const quickTips = [
    "Take 10 deep breaths to reset your nervous system",
    "Practice the 5-4-3-2-1 grounding technique",
    "Step outside for 5 minutes of sunlight",
    "Call someone who makes you smile",
    "Write down 3 things you're grateful for",
    "Do a 2-minute body stretch",
    "Listen to your favorite calming song",
    "Drink water mindfully, focusing on each sip",
    "Practice progressive muscle relaxation",
    "Try the 4-7-8 breathing technique",
    "Take a mindful walk around the block",
    "Do 10 jumping jacks to boost endorphins",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % quickTips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    {
      id: "all",
      name: "All Resources",
      icon: <Sparkles className="w-5 h-5" />,
    },
    { id: "breathing", name: "Breathing", icon: <Wind className="w-5 h-5" /> },
    {
      id: "movement",
      name: "Movement",
      icon: <Mountain className="w-5 h-5" />,
    },
    {
      id: "mindfulness",
      name: "Mindfulness",
      icon: <Heart className="w-5 h-5" />,
    },
    { id: "creative", name: "Creative", icon: <Palette className="w-5 h-5" /> },
    { id: "social", name: "Social", icon: <Users className="w-5 h-5" /> },
    { id: "cognitive", name: "Cognitive", icon: <Brain className="w-5 h-5" /> },
  ];

  // Enhanced resources with real video IDs
  const resources = [
    // Breathing Exercises with YouTube videos
    {
      id: 1,
      title: "Box Breathing",
      category: "breathing",
      description:
        "4-4-4-4 breathing pattern used by Navy SEALs for instant calm",
      icon: <Wind className="w-6 h-6" />,
      bgColor: "bg-[#84DCC6]",
      duration: "3-5 min",
      difficulty: "Beginner",
      type: "video",
      videoType: "youtube",
      videoId: "tEmt1Znux58",
    },
    {
      id: 2,
      title: "4-7-8 Sleep Breathing",
      category: "breathing",
      description: "Dr. Weil's technique to fall asleep in under 60 seconds",
      icon: <Moon className="w-6 h-6" />,
      bgColor: "bg-[#9ADBE8]",
      duration: "2-4 min",
      difficulty: "Beginner",
      type: "video",
      videoType: "youtube",
      videoId: "YRPh_GaiL8s",
    },
    {
      id: 3,
      title: "Wim Hof Method",
      category: "breathing",
      description: "Power breathing technique to boost energy and immunity",
      icon: <Zap className="w-6 h-6" />,
      bgColor: "bg-[#FFD37D]",
      duration: "15-20 min",
      difficulty: "Advanced",
      type: "video",
      videoType: "youtube",
      videoId: "tybOi4hjZFQ",
    },
    {
      id: 4,
      title: "Deep Breathing Exercise",
      category: "breathing",
      description: "15-minute guided deep breathing for anxiety relief",
      icon: <Heart className="w-6 h-6" />,
      bgColor: "bg-[#84DCC6]",
      duration: "15 min",
      difficulty: "Beginner",
      type: "video",
      videoType: "youtube",
      videoId: "F28MGLlpP90",
    },
    {
      id: 5,
      title: "5-Minute Quick Reset",
      category: "breathing",
      description: "Perfect for busy schedules - instant stress relief",
      icon: <Timer className="w-6 h-6" />,
      bgColor: "bg-[#9ADBE8]",
      duration: "5 min",
      difficulty: "Beginner",
      type: "video",
      videoType: "youtube",
      videoId: "inpok4MKVLM",
    },
    {
      id: 20,
      title: "Alternate Nostril Breathing",
      category: "breathing",
      description: "Pranayama technique to balance nervous system",
      icon: <Wind className="w-6 h-6" />,
      bgColor: "bg-[#FFD37D]",
      duration: "8-10 min",
      difficulty: "Intermediate",
      type: "video",
      videoType: "youtube",
      videoId: "8VwufJrUhic",
    },
    {
      id: 21,
      title: "Breath of Fire",
      category: "breathing",
      description: "Kundalini breathing for energy and focus",
      icon: <Flame className="w-6 h-6" />,
      bgColor: "bg-[#84DCC6]",
      duration: "5-7 min",
      difficulty: "Advanced",
      type: "video",
      videoType: "youtube",
      videoId: "TYCcJ9A--dw",
    },
    {
      id: 22,
      title: "Coherent Breathing",
      category: "breathing",
      description: "5-second inhale, 5-second exhale for heart coherence",
      icon: <Heart className="w-6 h-6" />,
      bgColor: "bg-[#9ADBE8]",
      duration: "10-15 min",
      difficulty: "Beginner",
      type: "video",
      videoType: "youtube",
      videoId: "fKtAiKKHJMU",
    },

    // Movement & Exercise with YouTube videos
    {
      id: 6,
      title: "Morning Yoga Flow",
      category: "movement",
      description: "Gentle 15-minute sequence to energize your day",
      icon: <Sun className="w-6 h-6" />,
      bgColor: "bg-[#FFD37D]",
      duration: "15 min",
      difficulty: "Beginner",
      type: "video",
      videoType: "youtube",
      videoId: "VaoV1PrYft4",
    },
    {
      id: 7,
      title: "Anxiety Relief Yoga",
      category: "movement",
      description: "Specific poses and flows designed to calm anxiety",
      icon: <Mountain className="w-6 h-6" />,
      bgColor: "bg-[#84DCC6]",
      duration: "20-30 min",
      difficulty: "Beginner",
      type: "video",
      videoType: "youtube",
      videoId: "hJbRpHZr_d0",
    },
    {
      id: 23,
      title: "Evening Restorative Yoga",
      category: "movement",
      description: "Wind down with gentle poses and deep stretches",
      icon: <Moon className="w-6 h-6" />,
      bgColor: "bg-[#9ADBE8]",
      duration: "25 min",
      difficulty: "Beginner",
      type: "video",
      videoType: "youtube",
      videoId: "BiWnaZ2nUzA",
    },
    {
      id: 24,
      title: "Chair Yoga for Work",
      category: "movement",
      description: "Desk-friendly stretches to relieve tension",
      icon: <Monitor className="w-6 h-6" />,
      bgColor: "bg-[#FFD37D]",
      duration: "12 min",
      difficulty: "Beginner",
      type: "video",
      videoType: "youtube",
      videoId: "M-8DvmItodQ",
    },
    {
      id: 25,
      title: "Tai Chi for Beginners",
      category: "movement",
      description: "Slow, meditative movements for inner peace",
      icon: <Waves className="w-6 h-6" />,
      bgColor: "bg-[#84DCC6]",
      duration: "30 min",
      difficulty: "Beginner",
      type: "video",
      videoType: "youtube",
      videoId: "vTKPcf7LAUE",
    },
    {
      id: 26,
      title: "Gentle Stretching Flow",
      category: "movement",
      description: "Full body stretches for flexibility and relaxation",
      icon: <Users className="w-6 h-6" />,
      bgColor: "bg-[#9ADBE8]",
      duration: "18 min",
      difficulty: "Beginner",
      type: "video",
      videoType: "youtube",
      videoId: "g_tea8ZNk5A",
    },
    {
      id: 27,
      title: "Qigong Energy Flow",
      category: "movement",
      description: "Traditional Chinese exercises for vitality",
      icon: <Sparkles className="w-6 h-6" />,
      bgColor: "bg-[#FFD37D]",
      duration: "20 min",
      difficulty: "Intermediate",
      type: "video",
      videoType: "youtube",
      videoId: "cwlvTcWR3Gs",
    },

    // Mindfulness & Meditation
    {
      id: 11,
      title: "Guided Meditation for Balance",
      category: "mindfulness",
      description: "17-minute practice for mental balance and grounding",
      icon: <Timer className="w-6 h-6" />,
      bgColor: "bg-[#9ADBE8]",
      duration: "17 min",
      difficulty: "Beginner",
      type: "video",
      videoType: "youtube",
      videoId: "x0nZ1ZLephQ",
    },
    {
      id: 12,
      title: "Isha Kriya Meditation",
      category: "mindfulness",
      description: "Sadhguru's guided 15-minute meditation for wellbeing",
      icon: <Heart className="w-6 h-6" />,
      bgColor: "bg-[#FFD37D]",
      duration: "15 min",
      difficulty: "Beginner",
      type: "video",
      videoType: "youtube",
      videoId: "EwQkfoKxRvo",
    },
    {
      id: 13,
      title: "10-Minute Guided Imagery",
      category: "mindfulness",
      description: "Visualization meditation to reduce anxiety and stress",
      icon: <Smile className="w-6 h-6" />,
      bgColor: "bg-[#84DCC6]",
      duration: "10 min",
      difficulty: "Intermediate",
      type: "video",
      videoType: "youtube",
      videoId: "t1rRo6cgM_E",
    },
    {
      id: 14,
      title: "Stress Relief Meditation",
      category: "mindfulness",
      description: "Headspace's 10-minute meditation for stress management",
      icon: <Coffee className="w-6 h-6" />,
      bgColor: "bg-[#9ADBE8]",
      duration: "10 min",
      difficulty: "Beginner",
      type: "video",
      videoType: "youtube",
      videoId: "lS0kcSNlULw",
    },
    {
      id: 15,
      title: "Mental Clarity Meditation",
      category: "mindfulness",
      description: "Clear your mind and start fresh with this guided practice",
      icon: <Brain className="w-6 h-6" />,
      bgColor: "bg-[#FFD37D]",
      duration: "10 min",
      difficulty: "Beginner",
      type: "video",
      videoType: "youtube",
      videoId: "uTN29kj7e-w",
    },
    {
      id: 28,
      title: "Body Scan Meditation",
      category: "mindfulness",
      description: "Progressive relaxation through body awareness",
      icon: <User className="w-6 h-6" />,
      bgColor: "bg-[#84DCC6]",
      duration: "25 min",
      difficulty: "Beginner",
      type: "video",
      videoType: "youtube",
      videoId: "15q-N-_kkrU",
    },
    {
      id: 29,
      title: "Loving Kindness Meditation",
      category: "mindfulness",
      description: "Cultivate compassion for self and others",
      icon: <Heart className="w-6 h-6" />,
      bgColor: "bg-[#9ADBE8]",
      duration: "12 min",
      difficulty: "Beginner",
      type: "video",
      videoType: "youtube",
      videoId: "sz7cpV7ERsM",
    },
    {
      id: 30,
      title: "Walking Meditation Guide",
      category: "mindfulness",
      description: "Mindful movement practice for any space",
      icon: <MapPin className="w-6 h-6" />,
      bgColor: "bg-[#FFD37D]",
      duration: "15 min",
      difficulty: "Beginner",
      type: "video",
      videoType: "youtube",
      videoId: "vW6qDBtcg9Y",
    },
    {
      id: 31,
      title: "Mindful Eating Practice",
      category: "mindfulness",
      description: "Transform meals into meditation moments",
      icon: <Apple className="w-6 h-6" />,
      bgColor: "bg-[#84DCC6]",
      duration: "20 min",
      difficulty: "Intermediate",
      type: "video",
      videoType: "youtube",
      videoId: "KZzER1UpMxo",
    },
    {
      id: 32,
      title: "Morning Mindfulness Routine",
      category: "mindfulness",
      description: "Start your day with intention and awareness",
      icon: <Sun className="w-6 h-6" />,
      bgColor: "bg-[#9ADBE8]",
      duration: "8 min",
      difficulty: "Beginner",
      type: "video",
      videoType: "youtube",
      videoId: "wfDTp2GogaQ",
    },

    // Vimeo Content
    {
      id: 16,
      title: "Guided Meditation for Positivity",
      category: "mindfulness",
      description:
        "Professional quality meditation focusing on positive energy",
      icon: <Sparkles className="w-6 h-6" />,
      bgColor: "bg-[#84DCC6]",
      duration: "20 min",
      difficulty: "All levels",
      type: "video",
      videoType: "vimeo",
      videoId: "159619218",
    },
    {
      id: 17,
      title: "Chakra Meditation",
      category: "mindfulness",
      description: "Sahaja Yoga meditation for spiritual wellbeing",
      icon: <Star className="w-6 h-6" />,
      bgColor: "bg-[#9ADBE8]",
      duration: "30 min",
      difficulty: "Intermediate",
      type: "video",
      videoType: "vimeo",
      videoId: "341073485",
    },
    {
      id: 33,
      title: "Advanced Breathwork Session",
      category: "breathing",
      description: "Professional breathwork facilitator guide",
      icon: <Wind className="w-6 h-6" />,
      bgColor: "bg-[#FFD37D]",
      duration: "45 min",
      difficulty: "Advanced",
      type: "video",
      videoType: "vimeo",
      videoId: "235648472",
    },

    // Creative Expression
    {
      id: 18,
      title: "Art Therapy Session",
      category: "creative",
      description: "Express emotions through colors and shapes",
      icon: <Palette className="w-6 h-6" />,
      bgColor: "bg-[#84DCC6]",
      duration: "30-60 min",
      difficulty: "All levels",
      type: "workshop",
    },
    {
      id: 19,
      title: "Gratitude Journaling",
      category: "creative",
      description: "Daily writing practice for positive mindset",
      icon: <BookOpen className="w-6 h-6" />,
      bgColor: "bg-[#9ADBE8]",
      duration: "10-15 min",
      difficulty: "Beginner",
      type: "template",
    },
    {
      id: 34,
      title: "Mandala Drawing Workshop",
      category: "creative",
      description: "Meditative circular art creation for focus",
      icon: <Circle className="w-6 h-6" />,
      bgColor: "bg-[#FFD37D]",
      duration: "45-90 min",
      difficulty: "Beginner",
      type: "workshop",
    },
    {
      id: 35,
      title: "Poetry Writing for Healing",
      category: "creative",
      description: "Express inner thoughts through verse",
      icon: <Pen className="w-6 h-6" />,
      bgColor: "bg-[#84DCC6]",
      duration: "20-30 min",
      difficulty: "All levels",
      type: "template",
    },
    {
      id: 36,
      title: "Music Therapy Session",
      category: "creative",
      description: "Therapeutic singing and rhythm exercises",
      icon: <Music className="w-6 h-6" />,
      bgColor: "bg-[#9ADBE8]",
      duration: "40 min",
      difficulty: "All levels",
      type: "workshop",
    },
    {
      id: 37,
      title: "Vision Board Creation",
      category: "creative",
      description: "Visualize goals and dreams through collage",
      icon: <Image className="w-6 h-6" />,
      bgColor: "bg-[#FFD37D]",
      duration: "60-120 min",
      difficulty: "Beginner",
      type: "workshop",
    },
    {
      id: 38,
      title: "Storytelling for Healing",
      category: "creative",
      description: "Share experiences through narrative writing",
      icon: <BookOpen className="w-6 h-6" />,
      bgColor: "bg-[#84DCC6]",
      duration: "25-40 min",
      difficulty: "Intermediate",
      type: "template",
    },

    // Sleep & Recovery
    {
      id: 39,
      title: "Sleep Stories Collection",
      category: "sleep",
      description: "Calming bedtime stories for adults",
      icon: <Moon className="w-6 h-6" />,
      bgColor: "bg-[#9ADBE8]",
      duration: "20-45 min",
      difficulty: "All levels",
      type: "audio",
    },
    {
      id: 40,
      title: "Progressive Muscle Relaxation",
      category: "sleep",
      description: "Systematic tension release for better sleep",
      icon: <Bed className="w-6 h-6" />,
      bgColor: "bg-[#84DCC6]",
      duration: "30 min",
      difficulty: "Beginner",
      type: "audio",
    },
    {
      id: 41,
      title: "Nature Sounds for Sleep",
      category: "sleep",
      description: "Rain, ocean, and forest sounds for relaxation",
      icon: <Leaf className="w-6 h-6" />,
      bgColor: "bg-[#FFD37D]",
      duration: "60+ min",
      difficulty: "All levels",
      type: "audio",
    },
    {
      id: 42,
      title: "Yoga Nidra Practice",
      category: "sleep",
      description: "Yogic sleep for deep restoration",
      icon: <Star className="w-6 h-6" />,
      bgColor: "bg-[#9ADBE8]",
      duration: "35-55 min",
      difficulty: "Beginner",
      type: "video",
      videoType: "youtube",
      videoId: "M0u9GST_j3s",
    },
  ];

  const filteredResources =
    activeCategory === "all"
      ? resources
      : resources.filter((resource) => resource.category === activeCategory);

  const handleVideoPlay = (resource) => {
    if (resource.videoType && resource.videoId) {
      setActiveVideo(resource);
    }
  };

  const closeVideo = () => {
    setActiveVideo(null);
  };

  const floatingElements = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 20,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <>
      {/* Global Styles */}
      {/* <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes slideIn {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-float { 
          animation: float 6s ease-in-out infinite; 
        }
        .animate-pulse-slow { 
          animation: pulse 3s ease-in-out infinite; 
        }
        .animate-slide-in { 
          animation: slideIn 0.8s ease-out forwards; 
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style> */}

      <div className="min-h-screen bg-gradient-to-br from-[#FDEBD2] via-white to-[#FDEBD2] relative overflow-hidden">
        {/* Video Modal */}
        {activeVideo && (
          <>
            {activeVideo.videoType === "youtube" && (
              <YouTubeEmbed
                embedId={activeVideo.videoId}
                onClose={closeVideo}
              />
            )}
            {activeVideo.videoType === "vimeo" && (
              <VimeoEmbed embedId={activeVideo.videoId} onClose={closeVideo} />
            )}
          </>
        )}

        {/* Floating Background Elements */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {floatingElements.map((element) => (
            <div
              key={element.id}
              className="absolute rounded-full opacity-10"
              style={{
                width: `${element.size}px`,
                height: `${element.size}px`,
                left: `${element.x}%`,
                top: `${element.y}%`,
                background: `linear-gradient(135deg, #84DCC6, #9ADBE8, #FFD37D)`,
                animation: `float ${element.duration}s ease-in-out infinite ${element.delay}s alternate`,
              }}
            />
          ))}
        </div>

        {/* Hero Section - Keep existing */}
        <header className="relative bg-gradient-to-r from-[#00373E] via-[#00373E] to-[#1a5f66] text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&#39;60&#39; height=&#39;60&#39; viewBox=&#39;0 0 60 60&#39; xmlns=&#39;http://www.w3.org/2000/svg&#39;%3E%3Cg fill=&#39;none&#39; fill-rule=&#39;evenodd&#39;%3E%3Cg fill=&#39;%239C92AC&#39; fill-opacity=&#39;0.1&#39;%3E%3Ccircle cx=&#39;30&#39; cy=&#39;30&#39; r=&#39;2&#39;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse-slow"></div>

          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <div className="animate-slide-in">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-[#84DCC6] to-white bg-clip-text text-transparent animate-pulse-slow">
                Mental Wellness Hub
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mb-8 leading-relaxed">
                Your comprehensive sanctuary for mental health resources.
                Discover 75+ scientifically-backed tools, activities, and
                practices to nurture your mind, body, and spirit on your
                wellness journey.
              </p>

              {/* Animated Stats */}
              <div className="flex flex-wrap justify-center gap-8 mb-8">
                <div className="text-center animate-float">
                  <div className="text-4xl font-bold text-[#84DCC6]">17+</div>
                  <div className="text-sm text-gray-300">Video Resources</div>
                </div>
                <div
                  className="text-center animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="text-4xl font-bold text-[#9ADBE8]">6</div>
                  <div className="text-sm text-gray-300">Categories</div>
                </div>
                <div
                  className="text-center animate-float"
                  style={{ animationDelay: "2s" }}
                >
                  <div className="text-4xl font-bold text-[#FFD37D]">24/7</div>
                  <div className="text-sm text-gray-300">Access</div>
                </div>
              </div>
            </div>

            {/* Rotating Quick Tip */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-white/20">
              <div className="flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-[#FFD37D] mr-2 animate-pulse-slow" />
                <span className="text-[#FFD37D] font-semibold">
                  Quick Relief Tip
                </span>
              </div>
              <p className="text-lg font-medium transition-all duration-1000 ease-in-out">
                {quickTips[currentTip]}
              </p>
            </div>
          </div>
        </header>

        {/* Category Filter - Keep existing */}
        <section className="py-8 bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                    activeCategory === category.id
                      ? "bg-[#00373E] text-white shadow-lg"
                      : "bg-white text-[#00373E] border border-[#00373E] hover:bg-[#FFD37D] hover:border-[#FFD37D]"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {category.icon}
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Resources Grid - Enhanced with video functionality */}
        <section className="py-16 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#00373E] mb-4">
                {activeCategory === "all"
                  ? "All Resources"
                  : categories.find((c) => c.id === activeCategory)?.name +
                    " Resources"}
              </h2>
              <p className="text-[#2A2A2A] text-lg">
                {filteredResources.length} resources available in this category
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredResources.map((resource, index) => (
                <div
                  key={resource.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden animate-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Card Header */}
                  <div
                    className={`${resource.bgColor} p-6 text-center relative overflow-hidden`}
                  >
                    <div className="shimmer absolute inset-0 group-hover:animate-shimmer"></div>
                    <div className="relative z-10">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg group-hover:animate-pulse-slow">
                        <div className="text-[#00373E]">{resource.icon}</div>
                      </div>
                      <h3 className="text-xl font-bold text-[#00373E] mb-2">
                        {resource.title}
                      </h3>
                      <p className="text-[#2A2A2A] text-sm mb-4">
                        {resource.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap justify-center gap-2">
                        <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium text-[#00373E]">
                          {resource.duration}
                        </span>
                        <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium text-[#00373E]">
                          {resource.difficulty}
                        </span>
                        <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium text-[#00373E] capitalize">
                          {resource.type}
                        </span>
                        {resource.videoType && (
                          <span className="px-3 py-1 bg-white/40 rounded-full text-xs font-medium text-[#00373E] uppercase">
                            {resource.videoType}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVideoPlay(resource)}
                        className="flex-1 bg-[#00373E] text-white py-3 px-4 rounded-lg hover:bg-[#FFD37D] hover:text-[#00373E] transition-all duration-300 font-medium group-hover:animate-pulse-slow flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        {resource.videoType ? "Watch" : "Start"}
                      </button>
                      <button className="bg-[#FF8A65] text-white py-3 px-4 rounded-lg hover:bg-[#FFD37D] hover:text-[#00373E] transition-all duration-300 flex items-center justify-center">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress indicator */}
                    <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#84DCC6] to-[#9ADBE8] transition-all duration-1000"
                        style={{ width: `${Math.random() * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Your Progress
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency Support Section - Keep existing */}
        <section className="py-16 bg-gradient-to-r from-[#FF8A65] to-[#FFD37D] relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <div className="animate-pulse-slow">
              <Zap className="w-16 h-16 text-white mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Need Immediate Support?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                If you're experiencing a mental health crisis, please reach out
                immediately. You're not alone, and help is available 24/7.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-[#00373E] px-8 py-4 rounded-lg hover:bg-[#00373E] hover:text-white transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Crisis Helpline
                </button>
                <button className="bg-[#00373E] text-white px-8 py-4 rounded-lg hover:bg-white hover:text-[#00373E] transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" />
                  Find Professional Help
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Keep existing */}
        <footer className="bg-[#00373E] text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse-slow"></div>
          <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
            <div className="mb-8">
              <Heart className="w-12 h-12 text-[#84DCC6] mx-auto mb-4 animate-pulse-slow" />
              <p className="text-xl text-gray-200 mb-4 max-w-3xl mx-auto">
                Your mental health journey is unique and valuable. Every small
                step you take towards wellness matters.
              </p>
              <p className="text-sm text-gray-400">
                These resources complement but do not replace professional
                mental health care. Always consult with qualified healthcare
                providers for personalized treatment.
              </p>
            </div>

            <div className="border-t border-gray-700 pt-8">
              <p className="text-gray-400 text-sm">
                Remember: Seeking help is a sign of strength, not weakness. Take
                care of your mind like you would your body.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MentalHealthResources;
