"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Add your login logic here
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="relative min-h-screen bg-[#F7F6F4] flex items-center justify-center p-4">
      {/* Background decoration aligned with theme */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/5 w-64 h-64 bg-[#FFD37D]/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-[#84DCC6]/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-[#9ADBE8]/30 rounded-full blur-2xl animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0"
      >
        {/* Left: Login Card */}
        <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 220 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg bg-gradient-to-br from-[#84DCC6] to-[#9ADBE8]"
            >
              <Heart className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-[#00373E] mb-2">{t('login.title')}</h1>
            <p className="text-[#2A2A2A]">{t('login.subtitle')}</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-[#00373E]">
                {t('login.emailLabel')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#84DCC6] focus:border-[#84DCC6] transition-all duration-200 placeholder:text-gray-400"
                  placeholder={t('login.emailPlaceholder')}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-[#00373E]">
                {t('login.passwordLabel')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#84DCC6] focus:border-[#84DCC6] transition-all duration-200 placeholder:text-gray-400"
                  placeholder={t('login.passwordPlaceholder')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={t('login.togglePassword')}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#00373E] border-gray-300 rounded focus:ring-[#84DCC6] focus:ring-2"
                />
                <span className="text-gray-600">{t('login.rememberMe')}</span>
              </label>
              <button
                type="button"
                className="text-[#00373E] hover:text-[#004a52] font-semibold transition-colors duration-200"
              >
                {t('login.forgotPassword')}
              </button>
            </div>

            {/* Sign In Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-[#00373E] text-white font-semibold text-lg rounded-xl hover:bg-[#004a52] focus:outline-none focus:ring-2 focus:ring-[#84DCC6] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>{t('login.signingIn')}</span>
                </div>
              ) : (
                t('login.signIn')
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 font-medium">{t('login.orContinueWith')}</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Social Login Options */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 px-4 bg-white border-2 border-gray-200 rounded-xl text-[#00373E] font-semibold hover:bg-[#FDEBD2]/60 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#84DCC6] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 bg-gradient-to-r from-red-500 to-yellow-500 rounded" />
                <span>{t('login.continueGoogle')}</span>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 px-4 bg-white border-2 border-gray-200 rounded-xl text-[#00373E] font-semibold hover:bg-[#FDEBD2]/60 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#84DCC6] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 bg-gradient-to-r from-gray-800 to-gray-600 rounded" />
                <span>{t('login.continueApple')}</span>
              </div>
            </motion.button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              {t('login.noAccount')}{' '}
              <button className="text-[#00373E] hover:text-[#004a52] font-semibold transition-colors duration-200 underline underline-offset-2">
                {t('login.signUpHere')}
              </button>
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-[#FFD37D]/70 animate-pulse" />
          </div>
          <div className="absolute -bottom-2 -left-2">
            <Heart className="w-4 h-4 text-[#84DCC6]/70 animate-pulse" />
          </div>
        </div>

        {/* Right: Themed Panel */}
        <div className="relative hidden md:flex flex-col justify-between rounded-3xl overflow-hidden shadow-xl border border-gray-200">
          <div className="absolute inset-0 bg-gradient-to-br from-[#84DCC6] via-[#9ADBE8] to-[#FFD37D] opacity-90" />
          <div className="relative p-10 h-full flex flex-col">
            <h3 className="text-2xl font-bold text-[#00373E]">WellNest</h3>
            <div className="mt-6 space-y-3 text-[#00373E]">
              <p className="text-lg font-semibold">Care that understands you</p>
              <ul className="space-y-2 text-sm">
                <li>• Confidential, stigma-free support</li>
                <li>• Available in multiple Indian languages</li>
                <li>• 24/7 AI-assisted assistance</li>
              </ul>
            </div>
            <div className="mt-auto">
              <img src="/HowItWorks.png" alt="Therapist illustration" className="w-full object-contain drop-shadow-xl" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
