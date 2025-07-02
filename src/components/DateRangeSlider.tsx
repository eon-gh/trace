import { Range } from "react-range";

interface DateRangeSliderProps {
  minYear: number;
  maxYear: number;
  range: [number, number];
  onChange: (range: [number, number]) => void;
}

const DateRangeSlider = ({ minYear, maxYear, range, onChange }: DateRangeSliderProps) => {
  return (
    <div className="w-full px-2">


        <div className="uppercase tracking-wider text-xs text-zinc-400 mb-5 font-mono">
          Période contemporaine : <span className="text-cyan-400">{formatYear(range[0])}</span> – <span className="text-cyan-400">{formatYear(range[1])}</span>
        </div>

      <Range
        step={1}
        min={minYear}
        max={maxYear}
        values={range}
        onChange={(values) => onChange([values[0], values[1]])}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-2 rounded-full bg-zinc-800 relative shadow-inner"
            style={{
              ...props.style,
              background: "linear-gradient(to right, #0f172a, #0f172a)"
            }}
          >
            <div
              style={{
                position: "absolute",
                left: `${((range[0] - minYear) / (maxYear - minYear)) * 100}%`,
                right: `${100 - ((range[1] - minYear) / (maxYear - minYear)) * 100}%`,
                top: 0,
                bottom: 0,
                background: "linear-gradient(to right, #06b6d4, #3b82f6)",
                borderRadius: "9999px",
                boxShadow: "0 0 10px #06b6d4aa",
              }}
            />
            {children}
          </div>
        )}
        renderThumb={({ props, index, isDragged }) => (
          <div
            {...props}
            className={`w-5 h-5 rounded-full bg-cyan-600 shadow-lg border-2 border-cyan-200 flex items-center justify-center transition-all duration-150 ${
              isDragged ? "scale-110 shadow-cyan-500/50" : "scale-100"
            }`}
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        )}
      />
    </div>
  );
};

function formatYear(year: number): string {
  if (year < -1_000_000) return `${Math.abs(year / 1_000_000)} M.a.`; // millions d'années
  if (year < -10_000) return `${Math.abs(year / 1_000)} k.a.`; // milliers d'années
  if (year < 0) return `${Math.abs(year)} av. J.-C.`;
  return `${year}`;
}


export default DateRangeSlider;
