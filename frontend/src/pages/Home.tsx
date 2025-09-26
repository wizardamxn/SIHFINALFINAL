import Hero from "@/components/Landing/Hero"
import HowItWorks from "@/components/Landing/HowItWorks"
import Services from "@/components/Landing/Services"

const Home = () => {
  return (
    <div>
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