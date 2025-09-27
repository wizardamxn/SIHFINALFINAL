import Hero from "@/components/Landing/Hero"
import HowItWorks from "@/components/Landing/HowItWorks"
import Services from "@/components/Landing/Services"

import LanguageMenuButton from "@/components/LanguageMenuButton";

const Home = () => {
  return (
    <div>
      {/* Floating language button at top-right of Home page */}
      <div className="fixed right-4 top-24 z-40">
        <LanguageMenuButton />
      </div>

      <div className="w-screen flex justify-center h-screen">
        <Hero/>
      </div>
      <div className="w-screen justify-center h-screen">
        <HowItWorks/>
      </div>
      <div className="w-screen justify-center h-screen">
        <Services/>
      </div>
    </div>

  )
}

export default Home
