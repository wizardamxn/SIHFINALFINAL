import { useRef, useState, useEffect } from "react";
import { useSpeech } from "../hooks/useSpeech";

export const ChatInterface = ({ hidden, ...props }) => {
  const input = useRef();
  const chatContainerRef = useRef();
  const { tts, loading, message, startRecording, stopRecording, recording } = useSpeech();
  const [chatMessages, setChatMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState("");

  const sendMessage = () => {
    const text = input.current.value.trim();
    if (!loading && !message && text) {
      // Add user message to chat
      setChatMessages(prev => [...prev, { type: 'user', text, timestamp: Date.now() }]);
      
      // Add AI processing message
      setChatMessages(prev => [...prev, { type: 'ai', text: null, processing: true, timestamp: Date.now() + 1 }]);
      
      tts(text);
      input.current.value = "";
      setCurrentInput("");
    }
  };

  // Simulate AI response (replace with actual response handling)
  useEffect(() => {
    if (message && chatMessages.length > 0) {
      const lastMessage = chatMessages[chatMessages.length - 1];
      if (lastMessage.processing) {
        setChatMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            ...lastMessage,
            text: message,
            processing: false
          };
          return newMessages;
        });
      }
    }
  }, [message]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  if (hidden) {
    return null;
  }

  // Shimmer component for loading state
  const ShimmerLoader = () => (
    <div className="flex gap-2 items-center">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <div className="text-green-700 text-sm italic">AI is thinking...</div>
    </div>
  );

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
      {/* Header - Top Left */}
      <div className="self-start backdrop-blur-md bg-gradient-to-br from-green-50 to-yellow-50 bg-opacity-90 p-4 rounded-2xl shadow-lg border border-green-100 mt-14">
        <h1 className="font-black text-xl bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Kamlesh</h1>
        <p className="text-green-800 text-sm">
          AI Assistant Ready
        </p>
      </div>

      {/* Chat Section - Bottom Left */}
      <div className="flex items-end gap-4 pointer-events-auto max-w-md w-full">
        <div className="flex flex-col gap-3 w-full">
          {/* Chat Messages Container */}
          <div 
            ref={chatContainerRef}
            className="bg-gradient-to-br from-yellow-50/95 to-green-50/95 backdrop-blur-md rounded-2xl p-4 max-h-96 overflow-y-auto shadow-xl border border-green-100/50"
            style={{
              background: 'linear-gradient(135deg, rgba(254, 252, 232, 0.95) 0%, rgba(220, 252, 231, 0.95) 100%)'
            }}
          >
            {chatMessages.length === 0 ? (
              <div className="text-green-700/60 text-center py-8 text-sm italic">
                Start a conversation with the AI assistant...
              </div>
            ) : (
              <div className="space-y-3">
                {chatMessages.map((msg, index) => (
                  <div
                    key={msg.timestamp}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                          : 'bg-white/80 text-green-900 shadow-sm border border-green-100'
                      }`}
                    >
                      {msg.processing ? (
                        <ShimmerLoader />
                      ) : (
                        <p className="text-sm">{msg.text}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Section */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50/95 to-green-50/95 backdrop-blur-md rounded-2xl p-2 shadow-xl border border-green-100/50">
            <button
              onClick={recording ? stopRecording : startRecording}
              disabled={loading || message}
              className={`p-3 rounded-xl transition-all duration-200 ${
                recording 
                  ? "bg-red-500 hover:bg-red-600 shadow-lg scale-110" 
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md"
              } ${loading || message ? "cursor-not-allowed opacity-50" : ""} text-white`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                />
              </svg>
            </button>

            <input
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/70 backdrop-blur-sm placeholder:text-green-600/50 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
              placeholder="Type your message..."
              ref={input}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={loading || message}
            />

            <button
              disabled={loading || message || !currentInput.trim()}
              onClick={sendMessage}
              className={`p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all duration-200 shadow-md ${
                loading || message || !currentInput.trim() ? "cursor-not-allowed opacity-50" : "hover:shadow-lg"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};