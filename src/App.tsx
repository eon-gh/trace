import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobeD3 from "./components/GlobeD3/GlobeD3";
import BackgroundParticles from "./components/BackgroundParticules";
import NavigationBar from "./components/NavigationBar";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col">
        <BackgroundParticles />
        <Routes>
          <Route path="/" element={<GlobeD3 />} />
          <Route path="/about" element={<div className="text-white text-center mt-40">À propos du projet</div>} />
          <Route path="/support" element={<div className="text-white text-center mt-40">Page de support</div>} />
        </Routes>
        <NavigationBar />
      </div>
    </BrowserRouter>
  );
}
