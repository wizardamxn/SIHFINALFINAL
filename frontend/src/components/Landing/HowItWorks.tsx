import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

const HowItWorks = () => {
  const { t } = useTranslation();
  return (
    <section className="flex items-center justify-center w-full min-h-screen px-4">
      <motion.div
        className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-24 lg:gap-56 w-full md:w-[90%] md:h-[90%] mx-auto"
      >
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col mt-10 md:mt-0"
        >
          <p
            style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
            className="m-2 text-lg md:text-xl text-gray-600"
          >
            {t("home.howItWorks.title")}
          </p>

          <p
            style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
            className="m-2 text-4xl md:text-6xl lg:text-7xl font-bold"
          >
            {t("home.howItWorks.headline1")}
          </p>

          <p
            style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
            className="m-2 text-4xl md:text-6xl lg:text-7xl font-bold"
          >
            {t("home.howItWorks.headline2")}
          </p>

          <p
            style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
            className="m-2 text-4xl md:text-6xl lg:text-7xl font-bold text-[#00373E]"
          >
            {t("home.howItWorks.headline3")}
          </p>

          <p
            style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
            className="m-2 text-base md:text-lg text-gray-700 max-w-lg"
          >
            {t("home.howItWorks.desc")}
          </p>

          <button className="rounded-full mt-10 text-white text-lg font-bold px-6 py-3 bg-[#00373E] hover:scale-110 transition-transform cursor-pointer flex justify-center items-center">
            {t("home.howItWorks.cta")}
          </button>
        </motion.div>

        {/* Right Section (Image) */}
        <motion.img
          src="/HowItWorks.png"
          alt={t("home.howItWorks.imageAlt")}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-full h-auto md:max-w-md lg:max-w-lg"
        />
      </motion.div>
    </section>
  );
};

export default HowItWorks;
