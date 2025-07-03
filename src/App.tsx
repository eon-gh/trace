import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobeD3 from "./components/GlobeD3/GlobeD3";
import BackgroundParticles from "./components/BackgroundParticules";
import NavigationBar from "./components/NavigationBar";
import About from "./pages/About";


export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col">
        <BackgroundParticles />
        <Routes>
          <Route path="/" element={<GlobeD3 />} />
          <Route path="/about" element={<About />} />
          
        </Routes>
        <NavigationBar />
      </div>
    </BrowserRouter>
  );
}
