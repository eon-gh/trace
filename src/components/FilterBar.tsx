import React from "react";
import Reset from "../assets/reset-svgrepo-com.svg";
import DateRangeSlider from "./DateRangeSlider";
import Select from "react-select";
import { historicalPeriods } from "../data/historicalPeriods";

interface FilterBarProps {
  filters: { category?: string; subcategory?: string };
  setFilters: (filters: { category?: string; subcategory?: string }) => void;
  dateRange: [number, number];
  setDateRange: (range: [number, number]) => void;
  selectedPeriods: string[];
  setSelectedPeriods: (periods: string[]) => void;
  periodOptions: { value: string; label: string }[];
  selectedOptions: { value: string; label: string }[];
  minYear: number;
  maxYear: number;
}

const categories = {
  sciences: ["physique"],
  nature: ["faune"],
};

const FilterBar = ({
  filters,
  setFilters,
  dateRange,
  setDateRange,
  selectedPeriods,
  setSelectedPeriods,
  periodOptions,
  selectedOptions,
  minYear,
  maxYear,
}: FilterBarProps) => {
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value || undefined;
    setFilters({ category, subcategory: undefined });
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subcategory = e.target.value || undefined;
    setFilters({ ...filters, subcategory });
  };

  const handlePeriodChange = (options: any) => {
    const values = options.map((opt: any) => opt.value);
    setSelectedPeriods(values);
    const selected = historicalPeriods.filter((p) => values.includes(p.label));
    if (selected.length > 0) {
      const min = Math.min(...selected.map((p) => p.start));
      const max = Math.max(...selected.map((p) => p.end));

      // ➕ On étend la plage pour rester souple (±5%)
      const padding = (max - min) * 0.05;
      setDateRange([min - padding, max + padding]);
    } else {
      setDateRange([-3000000, 2025]);
    }
  };

  const handleReset = () => {
    setFilters({});
    setSelectedPeriods([]);
    setDateRange([-3000000, 2025]);
  };

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 backdrop-blur-md bg-zinc-900/80 border border-zinc-700 rounded-2xl px-8 py-6 shadow-2xl z-50 min-w-[460px] max-w-[540px] flex flex-col gap-6 font-mono text-sm text-zinc-200">
      {/* Reset */}
      <div className="flex justify-end">
        <button
          onClick={handleReset}
          className="p-2 rounded bg-zinc-800 border border-zinc-600 hover:border-cyan-500 transition duration-200"
          title="Réinitialiser les filtres"
        >
          <img src={Reset} alt="reset" className="w-3 h-3 opacity-70" />
        </button>
      </div>

      {/* Catégorie / Sous-catégorie */}
      <div className="flex gap-6">
        <div className="flex flex-col gap-1 w-full">
          <label className="uppercase tracking-wider text-xs text-zinc-400">Catégorie</label>
          <select
            value={filters.category || ""}
            onChange={handleCategoryChange}
            className="bg-zinc-800 border border-zinc-600 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="">Toutes</option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {filters.category && (
          <div className="flex flex-col gap-1 w-full">
            <label className="uppercase tracking-wider text-xs text-zinc-400">Sous-catégorie</label>
            <select
              value={filters.subcategory || ""}
              onChange={handleSubcategoryChange}
              className="bg-zinc-800 border border-zinc-600 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="">Toutes</option>
              {categories[filters.category].map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Périodes */}
      <div className="flex flex-col gap-1">
        <label className="uppercase tracking-wider text-xs text-zinc-400">Périodes</label>
        <Select
          isMulti
          options={periodOptions}
          value={selectedOptions}
          onChange={handlePeriodChange}
          className="text-black text-sm"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "#1e293b",
              borderColor: "#334155",
              color: "#f8fafc",
              fontSize: "0.85rem",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#1e293b",
              color: "#f8fafc",
              zIndex: 9999,
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: "#0e7490",
              color: "#fff",
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: "#fff",
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: "#fff",
              ':hover': {
                backgroundColor: "#f87171",
                color: "white",
              },
            }),
          }}
        />
      </div>

      {/* Slider */}
      <div className="flex flex-col gap-1">
        <DateRangeSlider
          minYear={minYear}
          maxYear={maxYear}
          range={dateRange}
          onChange={setDateRange}
        />
      </div>
    </div>
  );
};

export default FilterBar;
