import { useRef, useState, useEffect } from "react";
import { useSpring, useTransition, animated, config } from '@react-spring/web';
import { useSpeech } from "../hooks/useSpeech";

const AnimatedDiv = animated.div;
const AnimatedInput = animated.input;
const AnimatedButton = animated.button;

export const ChatInterface = ({ hidden, ...props }) => {
  const input = useRef();
  const messagesEndRef = useRef();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [currentTypingText, setCurrentTypingText] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  
  const { tts, loading, message, startRecording, stopRecording, recording } = useSpeech();

  // Dynamic welcome animation
  const welcomeSpring = useSpring({
    opacity: showWelcome ? 1 : 0,
    transform: showWelcome ? 'translateY(0px) scale(1)' : 'translateY(-20px) scale(0.9)',
    config: config.wobbly,
  });

  // Input container animation
  const inputSpring = useSpring({
    transform: inputFocused ? 'scale(1.02) translateY(-2px)' : 'scale(1) translateY(0px)',
    boxShadow: inputFocused 
      ? '0 20px 40px -12px rgba(94, 234, 212, 0.25)' 
      : '0 4px 15px -3px rgba(0, 0, 0, 0.1)',
    config: config.gentle,
  });

  // Recording pulse animation
  const recordingSpring = useSpring({
    scale: recording ? 1.1 : 1,
    backgroundColor: recording ? '#ef4444' : '#10b981',
    config: { tension: 300, friction: 20 },
  });

  // Messages transition
  const messageTransitions = useTransition(messages, {
    from: { opacity: 0, transform: 'translateY(30px) scale(0.9)' },
    enter: { opacity: 1, transform: 'translateY(0px) scale(1)' },
    leave: { opacity: 0, transform: 'translateY(-30px) scale(0.9)' },
    config: config.gentle,
    trail: 100,
  });

  // Typing indicator animation
  const typingSpring = useSpring({
    opacity: isTyping ? 1 : 0,
    transform: isTyping ? 'translateY(0px)' : 'translateY(10px)',
    config: config.wobbly,
  });

  // Dynamic typewriter effect
  const typeWriter = (text, callback) => {
    let i = 0;
    setCurrentTypingText("");
    const timer = setInterval(() => {
      if (i < text.length) {
        setCurrentTypingText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        callback?.();
      }
    }, 50);
    return timer;
  };

  const sendMessage = () => {
    const text = input.current.value.trim();
    if (!loading && !message && text) {
      setShowWelcome(false);
      
      // Add user message with animation
      const userMessage = {
        id: Date.now(),
        text,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: '🧑‍💻'
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Start typing animation
      setIsTyping(true);
      tts(text);
      input.current.value = "";
      
      // Simulate AI response with typewriter effect
      setTimeout(() => {
        setIsTyping(false);
        const responses = [
          "That's interesting! Let me think about that... 🤔",
          "I understand what you're asking. Here's my thoughts... ✨",
          "Great question! Let me help you with that... 🚀",
          "Absolutely! I can definitely assist you with this... 💡"
        ];
        
        const aiResponse = responses[Math.floor(Math.random() * responses.length)];
        const aiMessage = {
          id: Date.now() + 1,
          text: aiResponse,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: '🤖',
          typing: true
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }, 1500 + Math.random() * 1000);
    }
  };

  // Auto scroll with smooth animation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (hidden) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end items-end p-6 pointer-events-none">
      {/* Main Chat Container */}
      <div className="w-96 h-[600px] pointer-events-auto">
        <AnimatedDiv
          className="relative h-full bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          }}
        >
          {/* Animated Header */}
          <div className="relative p-6 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-emerald-400/30 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">AI Assistant</h3>
                  <p className="text-white/70 text-sm">Always here to help</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {recording && (
                  <AnimatedDiv
                    style={recordingSpring}
                    className="flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/20"
                  >
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-red-300 text-xs font-medium">Recording</span>
                  </AnimatedDiv>
                )}
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 h-[480px]">
            {/* Welcome Message */}
            {showWelcome && (
              <AnimatedDiv style={welcomeSpring} className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-3xl">🚀</span>
                </div>
                <h4 className="text-white font-semibold text-xl mb-2">Welcome!</h4>
                <p className="text-white/70 text-sm">Start a conversation and let's create something amazing together!</p>
              </AnimatedDiv>
            )}

            {/* Messages */}
            {messageTransitions((style, item) => (
              <AnimatedDiv key={item.id} style={style}>
                <div className={`flex ${item.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                  <div className="flex items-end space-x-3 max-w-[85%]">
                    {item.sender === 'ai' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-sm mb-1">
                        {item.avatar}
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-xl transform hover:scale-[1.02] transition-all duration-200 ${
                        item.sender === 'user'
                          ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 text-white rounded-br-sm'
                          : 'bg-gradient-to-br from-white/90 to-gray-100/90 text-gray-800 rounded-bl-sm border border-white/50'
                      }`}
                    >
                      <p className="text-sm font-medium leading-relaxed">
                        {item.typing ? (
                          <TypewriterText text={item.text} />
                        ) : (
                          item.text
                        )}
                      </p>
                      <div className={`text-xs mt-1 opacity-70 ${
                        item.sender === 'user' ? 'text-emerald-100' : 'text-gray-600'
                      }`}>
                        {item.timestamp}
                      </div>
                    </div>
                    {item.sender === 'user' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-sm mb-1">
                        {item.avatar}
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedDiv>
            ))}

            {/* Dynamic Typing Indicator */}
            {isTyping && (
              <AnimatedDiv style={typingSpring} className="flex justify-start">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-sm">
                    🤖
                  </div>
                  <div className="bg-white/90 px-4 py-3 rounded-2xl rounded-bl-sm shadow-xl border border-white/50">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </AnimatedDiv>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input Area */}
          <AnimatedDiv
            style={inputSpring}
            className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/20 via-black/10 to-transparent backdrop-blur-sm"
          >
            <div className="flex items-end space-x-3">
              {/* Voice Button */}
              <AnimatedButton
                style={recordingSpring}
                onClick={recording ? stopRecording : startRecording}
                disabled={loading || message}
                className="p-4 rounded-2xl text-white shadow-2xl transition-all duration-300 active:scale-95 disabled:opacity-50"
              >
                {recording ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h12v12H6z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                )}
              </AnimatedButton>

              {/* Enhanced Input */}
              <div className="flex-1 relative">
                <AnimatedInput
                  ref={input}
                  className="w-full px-6 py-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/30 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/20 transition-all duration-300 text-gray-800 placeholder-gray-500 text-sm shadow-xl"
                  placeholder="Type something amazing..."
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                />
              </div>

              {/* Send Button */}
              <AnimatedButton
                disabled={loading || message}
                onClick={sendMessage}
                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </AnimatedButton>
            </div>
          </AnimatedDiv>
        </AnimatedDiv>
      </div>
    </div>
  );
};

// Typewriter component for dynamic text effect
const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <span>
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};
