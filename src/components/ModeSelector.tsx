import React from "react"

type Mode = "lostworld" | "present" | "evolution"

interface ModeSelectorProps {
  currentMode: Mode
  onChange: (mode: Mode) => void
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onChange,
}) => {
  const modes: { label: string; value: Mode }[] = [
    { label: "LOST WORLD", value: "lostworld" },
    { label: "PRESENT", value: "present" },
    { label: "EVOLUTION", value: "evolution" },
  ]

  return (
    <div className="flex justify-center gap-4 py-4">
      {modes.map((mode) => (
        <button
          key={mode.value}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition
            ${
              currentMode === mode.value
                ? "bg-white text-black"
                : "bg-transparent border border-white text-white hover:bg-white/10"
            }`}
          onClick={() => onChange(mode.value)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  )
}
