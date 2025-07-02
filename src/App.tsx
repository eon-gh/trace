
import GlobeD3 from "./components/GlobeD3/GlobeD3";

export default function App() {


  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <h1 className="text-3xl font-bold text-center pt-6">🌍 TRACE</h1>
      
      <GlobeD3 />
    </div>
  )
}
