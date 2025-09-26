import { motion } from "motion/react";

const HowItWorks = () => {
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
            How It Works
          </p>

          <p
            style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
            className="m-2 text-4xl md:text-6xl lg:text-7xl font-bold"
          >
            We Help You
          </p>

          <p
            style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
            className="m-2 text-4xl md:text-6xl lg:text-7xl font-bold"
          >
            Prioritize Your
          </p>

          <p
            style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
            className="m-2 text-4xl md:text-6xl lg:text-7xl font-bold text-[#00373E]"
          >
            Mental Health
          </p>

          <p
            style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
            className="m-2 text-base md:text-lg text-gray-700 max-w-lg"
          >
            Browse therapists, book a session, and start your healing journey
            with trusted professionals.
          </p>

          <button className="rounded-full mt-10 text-white text-lg font-bold px-6 py-3 bg-[#00373E] hover:scale-110 transition-transform cursor-pointer flex justify-center items-center">
            Chat with Kamlesh
          </button>
        </motion.div>

        {/* Right Section (Image) */}
        <motion.img
          src="/HowItWorks.png"
          alt="Therapist illustration"
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
