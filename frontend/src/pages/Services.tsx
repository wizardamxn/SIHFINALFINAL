"use client";
import { motion } from "framer-motion";

const ServicesPage = () => {
  return (
    <div className="bg-[#F7F6F4] min-h-screen">
      {/* Hero Section - Inspired by your home page */}
      <section className="w-full min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: -50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.2, duration: 0.8 },
            },
          }}
          className="flex flex-col items-center justify-center gap-6 text-center font-bold text-[#00373E] max-w-6xl"
          style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
        >
          {/* Small intro text */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-lg md:text-xl text-gray-600 font-normal"
          >
            Comprehensive Mental Health Platform
          </motion.p>

          {/* Main headline */}
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Support for Every
          </motion.span>

          <motion.span
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#FF6B35]"
          >
            Student's Journey
          </motion.span>

          {/* Subtext */}
          <motion.p
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="text-base md:text-lg lg:text-xl font-normal text-gray-700 max-w-4xl leading-relaxed"
          >
            From AI-powered crisis support to confidential counseling sessions,
            we're building a comprehensive digital platform that understands the
            unique mental health challenges faced by Indian college students.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1 },
            }}
            className="rounded-full mt-10 text-white text-lg font-bold px-8 py-4 bg-[#00373E] hover:scale-110 transition-transform"
          >
            Explore Our Services
          </motion.button>
        </motion.div>
      </section>

      {/* Problem & Solution Section */}
      <section className="flex items-center justify-center w-full min-h-screen px-4 bg-white">
        <motion.div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-24 lg:gap-32 w-full md:w-[90%] mx-auto">
          {/* Left Section - Problem */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col flex-1"
          >
            <p
              style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
              className="text-lg md:text-xl text-gray-600 mb-4"
            >
              The Challenge
            </p>

            <h2
              style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#00373E]"
            >
              Mental Health Crisis in Higher Education
            </h2>

            <div className="space-y-4 mb-8">
              {[
                "Rising anxiety and depression among students",
                "Stigma preventing students from seeking help",
                "Limited access to culturally-sensitive support",
                "Lack of early intervention systems",
              ].map((challenge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-start"
                >
                  <div className="w-2 h-2 bg-[#FF6B35] rounded-full mt-3 mr-4 flex-shrink-0"></div>
                  <p className="text-gray-700 text-lg">{challenge}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Section - Solution */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col flex-1"
          >
            <p
              style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
              className="text-lg md:text-xl text-gray-600 mb-4"
            >
              Our Solution
            </p>

            <h2
              style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#00373E]"
            >
              Comprehensive Digital Support System
            </h2>

            <div className="space-y-4 mb-8">
              {[
                "24/7 AI-powered crisis intervention",
                "Anonymous, stigma-free counseling",
                "Culturally-appropriate therapy approaches",
                "Data-driven early detection and prevention",
              ].map((solution, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-start"
                >
                  <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mt-3 mr-4 flex-shrink-0"></div>
                  <p className="text-gray-700 text-lg">{solution}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Core Services Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p
              style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
              className="text-lg md:text-xl text-gray-600 mb-4"
            >
              Five Core Services
            </p>
            <h2
              style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#00373E] mb-6"
            >
              Everything You Need for
            </h2>
            <h2
              style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#FF6B35]"
            >
              Mental Wellness
            </h2>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: "🤖",
                title: "AI-Powered Support",
                description:
                  "Immediate crisis intervention and personalized coping strategies available 24/7.",
                color: "#FF6B35",
                features: [
                  "Instant crisis response",
                  "Personalized coping strategies",
                  "Cultural sensitivity built-in",
                  "Seamless escalation to humans",
                ],
              },
              {
                icon: "🔒",
                title: "Anonymous Counseling",
                description:
                  "Complete privacy protection with professional counselors who understand student life.",
                color: "#FF8FA3",
                features: [
                  "Complete anonymity guaranteed",
                  "Multiple session formats",
                  "Student-specialized counselors",
                  "Same-day crisis appointments",
                ],
              },
              {
                icon: "📚",
                title: "Learning Resources",
                description:
                  "Comprehensive mental health education in multiple Indian languages.",
                color: "#4ECDC4",
                features: [
                  "Interactive learning modules",
                  "Regional language support",
                  "Cultural context integration",
                  "Evidence-based content",
                ],
              },
              {
                icon: "👥",
                title: "Peer Community",
                description:
                  "Connect with fellow students in moderated, supportive environments.",
                color: "#45B7B8",
                features: [
                  "Peer support forums",
                  "Trained student mentors",
                  "Group therapy sessions",
                  "Recovery story sharing",
                ],
              },
              {
                icon: "📊",
                title: "Analytics Dashboard",
                description:
                  "Help institutions understand and improve mental health support systems.",
                color: "#F38BA8",
                features: [
                  "Anonymous trend monitoring",
                  "Risk pattern identification",
                  "Resource optimization",
                  "Policy recommendations",
                ],
              },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Icon */}
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: service.color }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-2xl">{service.icon}</span>
                </motion.div>

                {/* Title */}
                <h3
                  style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
                  className="text-2xl font-bold text-[#00373E] mb-4"
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: j * 0.05, duration: 0.3 }}
                      viewport={{ once: true }}
                      className="flex items-start"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0"
                        style={{ backgroundColor: service.color }}
                      ></div>
                      <p className="text-sm text-gray-600">{feature}</p>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  className="w-full py-3 rounded-full font-semibold text-white transition-all duration-300"
                  style={{ backgroundColor: service.color }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Different Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p
              style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
              className="text-lg md:text-xl text-gray-600 mb-4"
            >
              What Makes Us Different
            </p>
            <h2
              style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#00373E] mb-6"
            >
              Built for Indian Students,
            </h2>
            <h2
              style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#FF6B35]"
            >
              By People Who Care
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🇮🇳",
                title: "Cultural Understanding",
                description:
                  "We understand Indian family dynamics, academic pressure, and cultural values that impact mental health.",
                color: "#FF6B35",
              },
              {
                icon: "🏫",
                title: "Campus Integration",
                description:
                  "Seamlessly works with your college systems, academic calendar, and existing support structures.",
                color: "#4ECDC4",
              },
              {
                icon: "🔗",
                title: "Real Human Connection",
                description:
                  "Direct access to local counselors and mental health professionals who understand your context.",
                color: "#FF8FA3",
              },
              {
                icon: "📈",
                title: "Data-Driven Care",
                description:
                  "Anonymous insights help institutions improve support while protecting your privacy completely.",
                color: "#45B7B8",
              },
              {
                icon: "🆓",
                title: "Accessible to All",
                description:
                  "Free, open-source platform designed for colleges with limited resources and infrastructure.",
                color: "#F38BA8",
              },
              {
                icon: "🛡️",
                title: "Privacy First",
                description:
                  "Your identity stays completely anonymous while you get the professional help you deserve.",
                color: "#00373E",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                className="text-center p-8"
              >
                <motion.div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: feature.color }}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-3xl">{feature.icon}</span>
                </motion.div>

                <h3
                  style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
                  className="text-xl font-bold text-[#00373E] mb-4"
                >
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-[#00373E]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2
              style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Ready to Transform Mental Health
            </h2>
            <h2
              style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#FF6B35] mb-8"
            >
              at Your Institution?
            </h2>

            <p className="text-white/90 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Join us in creating a world where every student has access to
              compassionate, culturally-sensitive mental health support.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                className="px-10 py-4 rounded-full font-bold text-lg bg-[#FF6B35] text-white hover:scale-110 transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Request a Demo
              </motion.button>

              <motion.button
                className="px-10 py-4 rounded-full font-bold text-lg border-2 border-white text-white hover:bg-white hover:text-[#00373E] transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download Proposal
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
