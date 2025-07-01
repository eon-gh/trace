import { useState } from "react"
import { ModeSelector } from "./components/ModeSelector"
import GlobeD3 from "./components/GlobeD3/GlobeD3";

export default function App() {
  const [mode, setMode] = useState<"lostworld" | "present" | "evolution">(
    "lostworld"
  )

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <h1 className="text-3xl font-bold text-center pt-6">🌍 TRACE</h1>
      <ModeSelector currentMode={mode} onChange={setMode} />
      <GlobeD3 />
    </div>
  )
}
