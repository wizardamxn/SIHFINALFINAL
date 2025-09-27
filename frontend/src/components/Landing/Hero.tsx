import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="w-full min-h-screen rounded-3xl bg-[url('/HeroBG.png')] bg-cover bg-center flex items-center justify-center md:w-[90%] mx-auto overflow-clip px-4">
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
        className="flex flex-col items-center justify-center gap-6 text-center font-bold text-[#00373E]"
        style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
      >
        {/* Headline Part */}
        <motion.span
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl"
        >
          {t("home.hero.headline1")}
        </motion.span>

        <motion.span
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl"
        >
          {t("home.hero.headline2")}
        </motion.span>

        {/* Subtext */}
        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className="text-base md:text-lg lg:text-2xl font-normal"
        >
          {t("home.hero.sub1")}
        </motion.p>
        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className="text-base md:text-lg lg:text-2xl font-normal"
        >
          {t("home.hero.sub2")}
        </motion.p>

        {/* Button */}
        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
        >
          <Link
            to="/login"
            className="rounded-full mt-10 inline-block text-white text-lg font-bold px-8 py-3 bg-[#00373E] hover:scale-110 transition-transform"
          >
            {t("home.hero.cta")}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
