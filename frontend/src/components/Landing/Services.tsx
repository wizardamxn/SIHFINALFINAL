"use client";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Services = () => {
  const { t } = useTranslation();
  const aiFeatures = t("services.ai.features", { returnObjects: true }) as string[];
  const resourceItems = t("services.resources.items", { returnObjects: true }) as string[];
  const assessItems = t("services.assess.items", { returnObjects: true }) as string[];
  const crisisFeatures = t("services.crisis.features", { returnObjects: true }) as string[];
  const techItems = t("services.tech.items", { returnObjects: true }) as string[];
  const valuePrivacy = t("services.value.privacy.items", { returnObjects: true }) as string[];
  const valueEvidence = t("services.value.evidence.items", { returnObjects: true }) as string[];
  const valueAvailability = t("services.value.availability.items", { returnObjects: true }) as string[];

  return (
    <section className="flex flex-col items-center w-full justify-center py-24 md:py-32 bg-[#FDEBD2] min-h-screen">
      <div className="flex flex-col w-full max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-20"
        >
          <p className="text-base font-semibold text-[#00373E] mb-4 tracking-wider uppercase">
            {t("services.header.kicker")}
          </p>
          <h1
            style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#00373E] mb-6 leading-tight"
          >
            {t("services.header.title1")}
            <br />
            <span className="text-[#FFD37D]">{t("services.header.title2")}</span>
          </h1>
          <p className="text-[#2A2A2A] text-xl md:text-2xl max-w-3xl leading-relaxed font-medium">
            {t("services.header.subtitle")}
          </p>
        </motion.div>

        {/* AI-Powered Mental Health Support */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-white rounded-3xl p-8 lg:p-12 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-[#00373E] rounded-full flex items-center justify-center mr-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C13.1046 2 14 2.89543 14 4V8C14 9.10457 13.1046 10 12 10C10.8954 10 10 9.10457 10 8V4C10 2.89543 10.8954 2 12 2Z" fill="white"/>
                  <path d="M4 12C4 10.8954 4.89543 10 6 10H10V14H6C4.89543 14 4 13.1046 4 12Z" fill="white"/>
                  <path d="M14 10H18C19.1046 10 20 10.8954 20 12C20 13.1046 19.1046 14 18 14H14V10Z" fill="white"/>
                  <path d="M10 16V20C10 21.1046 10.8954 22 12 22C13.1046 22 14 21.1046 14 20V16H10Z" fill="white"/>
                </svg>
              </div>
              <h2
                style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
                className="text-3xl lg:text-4xl font-bold text-[#00373E]"
              >
                {t("services.ai.title")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiFeatures.map((feature, i) => (
                <div key={i} className="flex items-start">
                  <div className="w-2 h-2 bg-[#84DCC6] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-[#2A2A2A] text-sm lg:text-base font-medium leading-relaxed">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Services Grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          {/* Interactive Wellness Resources */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
            }}
            className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-[#84DCC6] rounded-full flex items-center justify-center mr-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="3" stroke="#00373E" strokeWidth="2" fill="none"/>
                  <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="#00373E" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3
                style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
                className="text-2xl lg:text-3xl font-bold text-[#00373E]"
              >
                {t("services.resources.title")}
              </h3>
            </div>
            <div className="space-y-3 mb-6">
              {resourceItems.map((item, i) => (
                <div key={i} className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-[#9ADBE8] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-[#2A2A2A] text-sm font-medium leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <button className="bg-[#84DCC6] text-[#00373E] px-6 py-3 rounded-full font-semibold hover:bg-[#6fb3a0] transition-colors">
              {t("services.resources.cta")}
            </button>
          </motion.div>

          {/* AI Counseling & Assessment */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
            }}
            className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-[#FFD37D] rounded-full flex items-center justify-center mr-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#00373E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3
                style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
                className="text-2xl lg:text-3xl font-bold text-[#00373E]"
              >
                {t("services.assess.title")}
              </h3>
            </div>
            <div className="space-y-3 mb-6">
              {assessItems.map((item, i) => (
                <div key={i} className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-[#FFD37D] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-[#2A2A2A] text-sm font-medium leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <button className="bg-[#FFD37D] text-[#00373E] px-6 py-3 rounded-full font-semibold hover:bg-[#e6c06e] transition-colors">
              {t("services.assess.cta")}
            </button>
          </motion.div>
        </motion.div>

        {/* Crisis Intervention Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-[#00373E] to-[#004a52] rounded-3xl p-8 lg:p-12 text-white">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-[#FFD37D] rounded-full flex items-center justify-center mr-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.29 3.86L1.82 18A2 2 0 003.48 21H20.52A2 2 0 0022.18 18L13.71 3.86A2 2 0 0010.29 3.86Z" stroke="#00373E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="9" x2="12" y2="13" stroke="#00373E" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="17" r="1" fill="#00373E"/>
                </svg>
              </div>
              <h2
                style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
                className="text-3xl lg:text-4xl font-bold"
              >
                {t("services.crisis.title")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {crisisFeatures.map((feature, i) => (
                <div key={i} className="flex items-start">
                  <div className="w-2 h-2 bg-[#84DCC6] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-white text-sm lg:text-base font-medium leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>
            <button className="bg-[#FFD37D] text-[#00373E] px-8 py-4 rounded-full font-bold hover:bg-[#e6c06e] transition-colors mt-6">
              {t("services.crisis.cta")}
            </button>
          </div>
        </motion.div>

        {/* Technology Integration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-white rounded-3xl p-8 lg:p-12 border border-gray-200 shadow-sm">
            <h2
              style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
              className="text-3xl lg:text-4xl font-bold text-[#00373E] mb-8 text-center"
            >
              {t("services.tech.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {techItems.map((title, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-[#84DCC6] rounded-full flex items-center justify-center mx-auto mb-4">
                    {/* icons retained as-is */}
                  </div>
                  <p className="text-[#2A2A2A] text-sm font-medium leading-relaxed">
                    {title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Value Proposition & Quality Assurance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-gradient-to-br from-[#00373E] to-[#004a52] rounded-3xl p-8 lg:p-12 text-white">
            <h2
              style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
              className="text-3xl lg:text-4xl font-bold mb-8 text-center"
            >
              {t("services.value.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Complete Privacy */}
              <div className="text-center">
                <div className="w-16 h-16 bg-[#84DCC6] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#00373E" strokeWidth="2"/>
                    <circle cx="12" cy="16" r="1" fill="#00373E"/>
                    <path d="M7 11V7A5 5 0 0117 7V11" stroke="#00373E" strokeWidth="2"/>
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-3">{t("services.value.privacy.title")}</h4>
                <div className="space-y-2 text-sm">
                  {valuePrivacy.map((it, i) => (
                    <p key={i} className="font-medium leading-relaxed">{it}</p>
                  ))}
                </div>
              </div>

              {/* Evidence-Based Care */}
              <div className="text-center">
                <div className="w-16 h-16 bg-[#9ADBE8] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11L12 14L22 4" stroke="#00373E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12V19A2 2 0 0119 21H5A2 2 0 013 19V5A2 2 0 015 3H16" stroke="#00373E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-3">{t("services.value.evidence.title")}</h4>
                <div className="space-y-2 text-sm">
                  {valueEvidence.map((it, i) => (
                    <p key={i} className="font-medium leading-relaxed">{it}</p>
                  ))}
                </div>
              </div>

              {/* Always Available */}
              <div className="text-center">
                <div className="w-16 h-16 bg-[#FFD37D] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#00373E" strokeWidth="2"/>
                    <polyline points="12,6 12,12 16,14" stroke="#00373E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-3">{t("services.value.availability.title")}</h4>
                <div className="space-y-2 text-sm">
                  {valueAvailability.map((it, i) => (
                    <p key={i} className="font-medium leading-relaxed">{it}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-[#2A2A2A] text-lg mb-8 font-medium">
            {t("services.cta.prompt")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="bg-[#00373E] text-white px-10 py-4 rounded-full font-semibold hover:bg-[#004a52] transition-colors text-lg">
              {t("services.cta.primary")}
            </Link>
            <button className="bg-[#84DCC6] text-[#00373E] px-10 py-4 rounded-full font-semibold hover:bg-[#6fb3a0] transition-colors text-lg">
              {t("services.cta.secondary")}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
