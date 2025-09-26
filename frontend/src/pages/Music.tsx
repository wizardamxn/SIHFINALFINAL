"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Heart,
  Music,
  Search,
  TrendingUp,
  Sparkles,
  Headphones,
  PlayCircle,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  external_urls: { spotify: string };
  album: {
    images: { url: string }[];
    name: string;
  };
  duration_ms: number;
  popularity: number;
  explicit: boolean;
}

interface SpotifyMusicProps {
  initialMood?: "happy" | "calm" | "energetic" | "sad" | "focus" | "sleep";
}

const SpotifyMusicDeluxe: React.FC<SpotifyMusicProps> = ({
  initialMood = "calm",
}) => {
  // Simplified State Management
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentMood, setCurrentMood] = useState(initialMood);
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // Simplified mood configurations
  const moodConfigs = {
    happy: {
      name: "Happy Vibes",
      icon: "😊",
      gradient: "from-yellow-300 via-orange-300 to-pink-300",
      query: "happy upbeat pop",
      description: "Uplifting tracks to boost your mood",
    },
    calm: {
      name: "Peaceful Mind",
      icon: "🧘‍♂️",
      gradient: "from-blue-200 via-teal-200 to-green-200",
      query: "calm ambient chill",
      description: "Soothing sounds for relaxation",
    },
    energetic: {
      name: "Power Boost",
      icon: "⚡",
      gradient: "from-red-300 via-pink-300 to-purple-300",
      query: "energetic workout electronic",
      description: "High-energy tracks to get you moving",
    },
    sad: {
      name: "Emotional Release",
      icon: "🌧️",
      gradient: "from-gray-300 via-blue-300 to-indigo-300",
      query: "sad indie acoustic",
      description: "Gentle melodies for reflection",
    },
    focus: {
      name: "Deep Focus",
      icon: "🎯",
      gradient: "from-emerald-200 via-teal-200 to-cyan-200",
      query: "focus instrumental lofi",
      description: "Concentration-enhancing soundscapes",
    },
    sleep: {
      name: "Sweet Dreams",
      icon: "🌙",
      gradient: "from-indigo-200 via-purple-200 to-pink-200",
      query: "sleep ambient classical",
      description: "Gentle sounds for peaceful sleep",
    },
  };

  // Get access token
  const getAccessToken = async () => {
    const clientId = "3a2ca4e6e8164a3a804acc62802d28bf";
    const clientSecret = "9a775c03e8d14311b115f5b8dccaf772";

    if (!clientId || !clientSecret) {
      setError("Spotify credentials not configured");
      return null;
    }

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        },
        body: "grant_type=client_credentials",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Error getting access token:", error);
      setError("Failed to get Spotify access token");
      return null;
    }
  };

  // Simplified search function
  const searchTracksByMood = async (mood: string, token: string) => {
    const config = moodConfigs[mood as keyof typeof moodConfigs];
    
    if (!config) {
      console.error("Invalid mood configuration");
      return [];
    }

    try {
      setError(null);
      
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(config.query)}&type=track&limit=30&market=US`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.tracks?.items || [];
    } catch (error) {
      console.error("Error searching tracks:", error);
      setError("Failed to search tracks");
      return [];
    }
  };

  // Load tracks function
  const loadTracks = useCallback(
    async (mood = currentMood) => {
      setLoading(true);
      setError(null);

      try {
        const token = await getAccessToken();
        if (!token) {
          setLoading(false);
          return;
        }

        const moodTracks = await searchTracksByMood(mood, token);

        if (moodTracks.length === 0) {
          setError(
            "No tracks found for this mood. Try refreshing or selecting a different mood."
          );
        } else {
          setTracks(moodTracks);
        }
      } catch (error) {
        console.error("Error loading tracks:", error);
        setError("Failed to load tracks. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [currentMood]
  );

  // Open Spotify link
  const openSpotifyTrack = (track: Track) => {
    if (track?.external_urls?.spotify) {
      window.open(track.external_urls.spotify, '_blank');
    }
  };

  // Toggle like function
  const toggleLike = (trackId: string) => {
    setLikedTracks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  // Format time function
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Initial load
  useEffect(() => {
    loadTracks(currentMood);
  }, [currentMood, loadTracks]);

  const currentMoodConfig = moodConfigs[currentMood];
  const filteredTracks = tracks.filter(
    (track) =>
      track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artists.some((artist) =>
        artist.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br ${currentMoodConfig.gradient} backdrop-blur-lg`}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Header Section */}
        <div className="relative z-10 p-8 pb-4">
          <div className="flex items-center justify-between mb-6">
            <motion.div
              className="flex items-center gap-4"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
            >
              <div className="relative">
                <div className={`p-4 rounded-2xl bg-white/20 backdrop-blur-sm`}>
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {currentMoodConfig.name} {currentMoodConfig.icon}
                </h1>
                <p className="text-white/80 text-sm">
                  {currentMoodConfig.description}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Mood Selector */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {Object.entries(moodConfigs).map(([mood, config]) => (
              <motion.button
                key={mood}
                onClick={() => setCurrentMood(mood as any)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentMood === mood
                    ? "bg-white text-gray-800 shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {config.icon} {config.name}
              </motion.button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              placeholder="Search tracks or artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="relative z-10 mx-8 mb-6 p-4 bg-red-500/20 backdrop-blur-sm rounded-2xl border border-red-400/30">
            <p className="text-white text-sm">{error}</p>
            <button
              onClick={() => loadTracks(currentMood)}
              className="mt-2 px-4 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-all text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="relative z-10 flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-white/20 rounded-full animate-spin border-t-white"></div>
              <Music className="absolute inset-0 m-auto w-6 h-6 text-white" />
            </div>
            <p className="mt-4 text-white/80 font-medium">
              Curating your perfect playlist...
            </p>
            <p className="text-white/60 text-sm">
              Finding tracks that match your {currentMoodConfig.name.toLowerCase()}
            </p>
          </div>
        )}

        {/* Tracks Grid */}
        {!loading && filteredTracks.length > 0 && (
          <div className="relative z-10 p-8 pt-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Your Playlist ({filteredTracks.length} tracks)
              </h2>
              <button
                onClick={() => loadTracks(currentMood)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Refresh
              </button>
            </div>

            <div className="grid gap-3">
              {filteredTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => openSpotifyTrack(track)}
                  className="group flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 bg-white/5 hover:bg-white/15 hover:scale-[1.01]"
                >
                  {/* Track Image */}
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <img
                      src={track.album.images[0]?.url || "/api/placeholder/48/48"}
                      alt={track.name}
                      className="w-full h-full rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg transition-all bg-black/0 group-hover:bg-black/60">
                      <PlayCircle className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate text-white/90">
                      {track.name}
                    </h3>
                    <p className="text-white/60 text-sm truncate">
                      {track.artists.map((artist) => artist.name).join(", ")} •{" "}
                      {track.album.name}
                    </p>
                  </div>

                  {/* Track Stats */}
                  <div className="flex items-center gap-4 text-white/60 text-sm">
                    {track.explicit && (
                      <span className="px-2 py-0.5 bg-white/20 rounded text-xs">
                        E
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {track.popularity}
                    </div>
                    <span>{formatTime(track.duration_ms)}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(track.id);
                      }}
                      className="p-2 rounded-full hover:bg-white/20 transition-all"
                      title="Like track"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          likedTracks.has(track.id)
                            ? "text-red-400 fill-current"
                            : "text-white/70"
                        }`}
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openSpotifyTrack(track);
                      }}
                      className="p-2 rounded-full hover:bg-white/20 transition-all"
                      title="Open in Spotify"
                    >
                      <ExternalLink className="w-4 h-4 text-white/70" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredTracks.length === 0 && tracks.length > 0 && (
          <div className="relative z-10 text-center py-20">
            <Search className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/80 font-medium mb-2">No tracks found</p>
            <p className="text-white/60">Try adjusting your search terms</p>
          </div>
        )}

        {/* No Tracks Loaded */}
        {!loading && tracks.length === 0 && !error && (
          <div className="relative z-10 text-center py-20">
            <Music className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/80 font-medium mb-2">No tracks available</p>
            <p className="text-white/60">
              Try refreshing or selecting a different mood
            </p>
            <button
              onClick={() => loadTracks(currentMood)}
              className="mt-4 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all"
            >
              Load Tracks
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SpotifyMusicDeluxe;
