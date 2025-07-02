import { useMemo } from "react";
import { Range } from "react-range";
import * as d3 from "d3";

interface EpochSliderProps {
  range: [number, number];
  onChange: (range: [number, number]) => void;
}

const yearScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([-2_000_000, 3000]);

const percentFromYear = d3
  .scaleLinear()
  .domain([-2_000_000, 3000])
  .range([0, 100]);

function formatYear(year: number): string {
  if (year <= -1_000_000) return `${Math.round(Math.abs(year) / 1_000_000)} Ma`;
  if (year <= -10_000) return `${Math.round(Math.abs(year) / 1_000)} ka`;
  if (year < 0) return `${Math.abs(year)} av. J.-C.`;
  if (year <= 2100) return `${year}`;
  return `~${year}`;
}

const EpochSlider = ({ range, onChange }: EpochSliderProps) => {
  const percentValues = useMemo(
    () => range.map((y) => percentFromYear(y)),
    [range]
  );

  const handleChange = (values: number[]) => {
    const newYears = values.map((v) => Math.round(yearScale(v))) as [number, number];
    onChange(newYears);
  };

  return (
    <div className="w-full px-4 pt-2">
      <div className="text-center text-sm text-zinc-400 mb-2 tracking-wide">
        Période : <strong>{formatYear(range[0])}</strong> — <strong>{formatYear(range[1])}</strong>
      </div>
      <Range
        step={0.1}
        min={0}
        max={100}
        values={percentValues}
        onChange={handleChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-3 rounded-full bg-gradient-to-r from-purple-900 via-blue-800 to-zinc-700 relative"
          >
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 text-xs text-zinc-500 pl-2">🌌</div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-xs text-zinc-500 pr-2">🚀</div>
            {children}
          </div>
        )}
        renderThumb={({ props, index }) => (
          <div
            {...props}
            className="w-5 h-5 bg-white border-2 border-zinc-500 rounded-full shadow-lg focus:outline-none hover:scale-110 transition-transform"
          >
            <div className="absolute -top-6 text-sm text-zinc-300">
              {formatYear(range[index])}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default EpochSlider;
