import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import ServicesPage from "./pages/Services";
import Screening from "./pages/Screening";
import CommunityChat from "./pages/CommunityChat";
import ProfileSection from "./pages/Profile";
import MapView from "./pages/MapVIew";
import MentalHealthResources from "./pages/Resources";
import MoodMusicComponent from "./pages/Music";
import SpotifyMusic from "./pages/Music";
import SpotifyMusicDeluxe from "./pages/Music";
import FemaleMentalHealthSection from "./pages/Female";
import AdvancedFemaleMentalHealthHub from "./pages/Female";
import LoginPage from "./pages/Login";
import Bot from "./pages/Bot";

function App() {
  return (
    <div className="bg-[#F7F6F4]">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/screening" element={<Screening />} />
        <Route path="/community" element={<CommunityChat />} />
        <Route path="/profile" element={<ProfileSection />} />
        <Route path="/music" element={<SpotifyMusicDeluxe />} />
        <Route path="/nearme" element={<MapView/>} />
        <Route path="/female" element={<AdvancedFemaleMentalHealthHub/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/resources" element={<MentalHealthResources/>} />
        <Route path="/bot" element={<Bot/>} />
      </Routes>
    </div>
  );
}

export default App;
