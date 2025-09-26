"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-cream via-blush/10 to-sage/20 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blush/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-sage/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-cream-light/30 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/60 p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blush to-rose-400 rounded-2xl mb-4 shadow-lg"
          >
            <Heart className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-charcoal mb-2">Welcome Back</h1>
          <p className="text-charcoal/70">Sign in to continue your wellness journey</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-charcoal">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-charcoal/50" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3.5 bg-white/80 border-2 border-sage/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blush focus:border-blush transition-all duration-200 placeholder:text-charcoal/40"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold text-charcoal">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-charcoal/50" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-12 py-3.5 bg-white/80 border-2 border-sage/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blush focus:border-blush transition-all duration-200 placeholder:text-charcoal/40"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 w-5 h-5 text-charcoal/50 hover:text-charcoal transition-colors"
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
                className="w-4 h-4 text-blush border-sage/30 rounded focus:ring-blush/50 focus:ring-2"
              />
              <span className="text-charcoal/70">Remember me</span>
            </label>
            <button
              type="button"
              className="text-blush hover:text-blush/80 font-semibold transition-colors duration-200"
            >
              Forgot password?
            </button>
          </div>

          {/* Sign In Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-blush to-rose-400 text-white font-semibold text-lg rounded-xl hover:from-blush/90 hover:to-rose-400/90 focus:outline-none focus:ring-2 focus:ring-blush/50 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                <span>Signing In...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center">
          <div className="flex-1 border-t border-sage/20"></div>
          <span className="px-4 text-sm text-charcoal/50 font-medium">or continue with</span>
          <div className="flex-1 border-t border-sage/20"></div>
        </div>

        {/* Social Login Options */}
        <div className="space-y-3">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 px-4 bg-white/90 border-2 border-sage/20 rounded-xl text-charcoal font-semibold hover:bg-sage/5 hover:border-sage/30 focus:outline-none focus:ring-2 focus:ring-blush/50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="w-5 h-5 bg-gradient-to-r from-red-500 to-yellow-500 rounded"></div>
              <span>Continue with Google</span>
            </div>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 px-4 bg-white/90 border-2 border-sage/20 rounded-xl text-charcoal font-semibold hover:bg-sage/5 hover:border-sage/30 focus:outline-none focus:ring-2 focus:ring-blush/50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="w-5 h-5 bg-gradient-to-r from-gray-800 to-gray-600 rounded"></div>
              <span>Continue with Apple</span>
            </div>
          </motion.button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-charcoal/70">
            Don't have an account?{' '}
            <button className="text-blush hover:text-blush/80 font-semibold transition-colors duration-200 underline underline-offset-2">
              Sign up here
            </button>
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2">
          <Sparkles className="w-6 h-6 text-blush/60 animate-pulse" />
        </div>
        <div className="absolute -bottom-2 -left-2">
          <Heart className="w-4 h-4 text-sage/60 animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
