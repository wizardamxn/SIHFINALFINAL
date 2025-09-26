import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PHQ9Question {
  id: number;
  text: string;
}

interface PHQ9Response {
  questionId: number;
  value: number;
}

const Screening: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [responses, setResponses] = useState<PHQ9Response[]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [currentMotivation, setCurrentMotivation] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null); // Track current selection
  const [showValidationMessage, setShowValidationMessage] = useState<boolean>(false);

  const questions: PHQ9Question[] = [
    { id: 1, text: "Little interest or pleasure in doing things" },
    { id: 2, text: "Feeling down, depressed, or hopeless" },
    { id: 3, text: "Trouble falling or staying asleep, or sleeping too much" },
    { id: 4, text: "Feeling tired or having little energy" },
    { id: 5, text: "Poor appetite or overeating" },
    { id: 6, text: "Feeling bad about yourself – or that you are a failure or have let yourself or your family down" },
    { id: 7, text: "Trouble concentrating on things, such as reading the newspaper or watching television" },
    { id: 8, text: "Moving or speaking so slowly that other people could have noticed? Or the opposite – being so fidgety or restless that you have been moving around a lot more than usual" },
    { id: 9, text: "Thoughts that you would be better off dead or of hurting yourself in some way" }
  ];

  const responseOptions = [
    { value: 0, label: "Not at all", color: "bg-[#84DCC6]" },
    { value: 1, label: "Several days", color: "bg-[#9ADBE8]" },
    { value: 2, label: "More than half the days", color: "bg-[#FFD37D]" },
    { value: 3, label: "Nearly every day", color: "bg-[#FF8A65]" }
  ];

  const motivationalQuotes = [
    "You're taking an important step for your well-being 💚",
    "Your mental health matters, and so do you 🌟",
    "Being honest with yourself shows incredible strength 💪",
    "Every journey to wellness starts with awareness 🌱",
    "You're not alone in this journey 🤝",
    "Taking care of your mind is an act of self-love ❤️",
    "Your feelings are valid and important 🫶",
    "Seeking help is a sign of courage, not weakness 🦋",
    "You deserve peace and happiness 🌈"
  ];

  const wellnessTips = [
    { icon: "🌅", tip: "Try starting your day with 5 minutes of deep breathing" },
    { icon: "🚶‍♀️", tip: "A 10-minute walk can boost your mood naturally" },
    { icon: "📝", tip: "Journaling your thoughts can provide clarity and relief" },
    { icon: "🎵", tip: "Listen to music that makes you feel good" },
    { icon: "💧", tip: "Stay hydrated - it affects your mood more than you think" },
    { icon: "🌱", tip: "Connect with nature, even if it's just looking outside" },
    { icon: "📞", tip: "Reach out to a friend or family member today" },
    { icon: "😴", tip: "Prioritize 7-8 hours of quality sleep" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMotivation((prev) => (prev + 1) % motivationalQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Load existing answer when question changes
  useEffect(() => {
    const existingResponse = responses.find(r => r.questionId === currentQuestion + 1);
    setSelectedAnswer(existingResponse ? existingResponse.value : null);
    setShowValidationMessage(false);
  }, [currentQuestion, responses]);

  const handleResponse = (value: number) => {
    const newResponse: PHQ9Response = {
      questionId: currentQuestion + 1,
      value: value
    };

    const updatedResponses = responses.filter(r => r.questionId !== currentQuestion + 1);
    updatedResponses.push(newResponse);
    setResponses(updatedResponses);
    setSelectedAnswer(value);
    setShowValidationMessage(false);

    // Auto-advance only if it's not the last question
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 600);
    } else {
      setTimeout(() => {
        setIsComplete(true);
      }, 600);
    }
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      setShowValidationMessage(true);
      return;
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (selectedAnswer !== null) {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = (): number => {
    return responses.reduce((total, response) => total + response.value, 0);
  };

  const getScoreInterpretation = (score: number) => {
    if (score <= 4) return { 
      severity: "Minimal", 
      description: "You're doing well! Keep up the good habits that support your mental health.", 
      color: "text-[#84DCC6]",
      message: "Your responses suggest minimal depression symptoms. Continue practicing self-care!",
      recommendations: ["Maintain your current wellness routine", "Keep exercising regularly", "Stay connected with loved ones"]
    };
    if (score <= 9) return { 
      severity: "Mild", 
      description: "You may be experiencing some challenges, but there are many ways to feel better.", 
      color: "text-[#9ADBE8]",
      message: "Your responses indicate mild symptoms. Small changes can make a big difference!",
      recommendations: ["Try mindfulness or meditation", "Establish a regular sleep schedule", "Consider talking to someone you trust"]
    };
    if (score <= 14) return { 
      severity: "Moderate", 
      description: "It's important to take care of yourself. Consider reaching out for support.", 
      color: "text-[#FFD37D]",
      message: "Your responses suggest moderate symptoms. Professional support could be helpful.",
      recommendations: ["Consider speaking with a counselor", "Practice stress management techniques", "Maintain social connections"]
    };
    if (score <= 19) return { 
      severity: "Moderately Severe", 
      description: "You're going through a difficult time. Professional support is recommended.", 
      color: "text-[#FF8A65]",
      message: "Your responses indicate significant symptoms. Please consider professional help.",
      recommendations: ["Consult with a mental health professional", "Reach out to your support network", "Consider therapy or counseling"]
    };
    return { 
      severity: "Severe", 
      description: "Please reach out for professional help immediately. You don't have to go through this alone.", 
      color: "text-red-500",
      message: "Your responses suggest severe symptoms. Immediate professional support is important.",
      recommendations: ["Contact a mental health professional today", "Reach out to a crisis helpline if needed", "Don't wait - your wellbeing is important"]
    };
  };

  const restartQuestionnaire = () => {
    setCurrentQuestion(0);
    setResponses([]);
    setIsComplete(false);
    setShowResults(false);
    setShowIntro(true);
    setSelectedAnswer(null);
    setShowValidationMessage(false);
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  // Check if current question is answered
  const isCurrentQuestionAnswered = responses.some(r => r.questionId === currentQuestion + 1);

  // Introduction Screen
  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDEBD2] to-[#84DCC6] flex items-center justify-center p-4">
        <motion.div 
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <motion.div 
              className="w-20 h-20 bg-gradient-to-br from-[#84DCC6] to-[#9ADBE8] rounded-full mx-auto mb-6 flex items-center justify-center"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <span className="text-3xl">🧠</span>
            </motion.div>
            <h1 className="text-4xl font-bold text-[#00373E] mb-4">Mental Health Check-In</h1>
            <p className="text-xl text-[#2A2A2A] mb-6">A safe space to understand your well-being</p>
          </div>

          {/* Motivational Message */}
          <motion.div 
            className="bg-[#FDEBD2] rounded-2xl p-6 mb-8 text-center"
            key={currentMotivation}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg text-[#00373E] font-medium">
              {motivationalQuotes[currentMotivation]}
            </p>
          </motion.div>

          {/* What to Expect */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div 
              className="bg-[#84DCC6] bg-opacity-20 rounded-2xl p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-[#00373E] mb-3">📋 What This Is</h3>
              <ul className="text-[#2A2A2A] space-y-2">
                <li>• A 9-question screening tool (PHQ-9)</li>
                <li>• Takes about 2-3 minutes</li>
                <li>• Completely confidential</li>
                <li>• Based on clinical standards</li>
              </ul>
            </motion.div>

            <motion.div 
              className="bg-[#9ADBE8] bg-opacity-20 rounded-2xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-[#00373E] mb-3">💚 Remember</h3>
              <ul className="text-[#2A2A2A] space-y-2">
                <li>• This is just a screening, not a diagnosis</li>
                <li>• Your responses are private</li>
                <li>• Seeking help is a sign of strength</li>
                <li>• You're taking a positive step</li>
              </ul>
            </motion.div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <motion.button
              onClick={() => setShowIntro(false)}
              className="bg-[#00373E] text-white px-12 py-4 rounded-full font-semibold text-lg hover:bg-[#FFD37D] hover:text-[#00373E] transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Begin Assessment 🌟
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Results Screen
  if (showResults) {
    const score = calculateScore();
    const interpretation = getScoreInterpretation(score);

    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-[#FDEBD2] to-[#84DCC6] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-[#84DCC6] to-[#9ADBE8] rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">🎯</span>
            </div>
            <h2 className="text-3xl font-bold text-[#00373E] mb-2">Your Results</h2>
            <p className="text-[#2A2A2A]">Understanding your mental health check-in</p>
          </motion.div>

          {/* Score Display */}
          <motion.div 
            className="bg-[#FDEBD2] rounded-2xl p-6 mb-6 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-5xl font-bold text-[#00373E] mb-2">{score}/27</div>
            <div className={`text-2xl font-semibold ${interpretation.color} mb-3`}>
              {interpretation.severity}
            </div>
            <p className="text-[#2A2A2A] text-lg">{interpretation.message}</p>
          </motion.div>

          {/* Recommendations */}
          <motion.div 
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-2xl font-semibold text-[#00373E] mb-4">💡 Next Steps</h3>
            <div className="grid gap-3">
              {interpretation.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  className="bg-[#84DCC6] bg-opacity-30 rounded-xl p-4 flex items-center"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="w-8 h-8 bg-[#00373E] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-[#00373E] font-medium">{rec}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Wellness Tips */}
          <motion.div 
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <h3 className="text-2xl font-semibold text-[#00373E] mb-4">🌟 Daily Wellness Tips</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {wellnessTips.slice(0, 4).map((tip, index) => (
                <motion.div
                  key={index}
                  className="bg-[#9ADBE8] bg-opacity-30 rounded-xl p-4 flex items-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <span className="text-2xl mr-3">{tip.icon}</span>
                  <p className="text-[#00373E] font-medium">{tip.tip}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Support Resources */}
          <motion.div 
            className="bg-gradient-to-r from-[#FFD37D] to-[#84DCC6] rounded-2xl p-6 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <h3 className="text-xl font-semibold text-[#00373E] mb-3">🆘 Need Support Right Now?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-[#00373E] font-medium mb-2">Crisis Helpline:</p>
                <p className="text-[#00373E]">📞 988 (Suicide & Crisis Lifeline)</p>
              </div>
              <div>
                <p className="text-[#00373E] font-medium mb-2">Text Support:</p>
                <p className="text-[#00373E]">💬 Text HOME to 741741</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="text-center space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={restartQuestionnaire}
                className="bg-[#00373E] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#FFD37D] hover:text-[#00373E] transition-all duration-300 transform hover:scale-105"
              >
                Take Assessment Again
              </button>
              <button className="bg-[#FF8A65] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#FFD37D] hover:text-[#00373E] transition-all duration-300 transform hover:scale-105">
                Find Professional Help
              </button>
            </div>
            <p className="text-gray-500 text-sm">
              Remember: This screening is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  // Completion Screen
  if (isComplete) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-[#FDEBD2] to-[#84DCC6] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-br from-[#84DCC6] to-[#9ADBE8] rounded-full mx-auto mb-6 flex items-center justify-center"
          >
            <span className="text-4xl">🎉</span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl font-bold text-[#00373E] mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            You Did It! 🌟
          </motion.h2>
          
          <motion.div
            className="bg-[#FDEBD2] rounded-2xl p-6 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-[#00373E] text-lg font-medium mb-2">
              Taking time to check in with your mental health shows incredible self-awareness and strength.
            </p>
            <p className="text-[#2A2A2A]">
              Whatever the results show, remember that you've taken a positive step toward understanding your well-being.
            </p>
          </motion.div>
          
          <motion.button
            onClick={() => setShowResults(true)}
            className="bg-[#00373E] text-white px-12 py-4 rounded-full font-semibold text-lg hover:bg-[#FFD37D] hover:text-[#00373E] transition-all duration-300 transform hover:scale-105 shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Your Results ✨
          </motion.button>

          <motion.p
            className="text-gray-500 text-sm mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            You're brave for taking this step. Whatever comes next, you don't have to face it alone. 💙
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  // Main Questionnaire
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDEBD2] to-[#84DCC6] flex items-center justify-center p-4">
      <motion.div 
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-[#00373E] mb-2">Mental Health Check-In</h1>
          <p className="text-[#2A2A2A]">Over the last 2 weeks, how often have you been bothered by...</p>
        </motion.div>

        {/* Motivational Banner */}
        <motion.div 
          className="bg-gradient-to-r from-[#84DCC6] to-[#9ADBE8] rounded-2xl p-4 mb-6 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-[#00373E] font-medium">
            {motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Progress</span>
            <span className="text-sm font-semibold text-[#00373E]">{currentQuestion + 1} of {questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <motion.div 
              className="bg-gradient-to-r from-[#84DCC6] to-[#9ADBE8] h-4 rounded-full flex items-center justify-end pr-2"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-xs text-white font-bold">
                {Math.round(progressPercentage)}%
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="bg-[#FDEBD2] rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-[#00373E] leading-relaxed">
                {questions[currentQuestion].text}
              </h2>
            </div>

            {/* Validation Message */}
            <AnimatePresence>
              {showValidationMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-center"
                >
                  <span className="font-medium">Please select an answer before continuing 🙏</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Response Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {responseOptions.map((option, index) => (
                <motion.button
                  key={option.value}
                  onClick={() => handleResponse(option.value)}
                  className={`${option.color} text-[#00373E] p-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
                    selectedAnswer === option.value 
                      ? 'border-[#00373E] border-4 scale-105' 
                      : 'border-transparent hover:border-[#00373E]'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: selectedAnswer === option.value ? 1.05 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-lg mb-2">{option.label}</div>
                  <div className="text-sm opacity-75">({option.value} points)</div>
                  {selectedAnswer === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 text-[#00373E]"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div 
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="bg-gray-200 text-[#00373E] px-6 py-3 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFD37D] transition-all duration-300"
          >
            ← Previous
          </button>
          
          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <motion.div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentQuestion 
                    ? 'bg-[#00373E] scale-125' 
                    : responses.some(r => r.questionId === index + 1)
                      ? 'bg-[#84DCC6]' 
                      : 'bg-gray-300'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: index === currentQuestion ? 1.25 : 1 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              selectedAnswer === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#FF8A65] text-white hover:bg-[#FFD37D] hover:text-[#00373E]'
            }`}
          >
            {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'} →
          </button>
        </motion.div>

        {/* Supportive Footer */}
        <motion.div 
          className="text-center space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="bg-[#FFD37D] bg-opacity-30 rounded-xl p-4">
            <p className="text-[#00373E] font-medium">
              🌈 Remember: There are no right or wrong answers. Be honest with yourself.
            </p>
          </div>
          <p className="text-sm text-gray-500">
            This assessment is confidential and for your personal understanding only.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Screening;
