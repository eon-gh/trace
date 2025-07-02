import React from "react";
import Reset from "../assets/reset-svgrepo-com.svg";
import DateRangeSlider from "./DateRangeSlider";

interface FilterBarProps {
  filters: { category?: string; subcategory?: string };
  setFilters: (filters: { category?: string; subcategory?: string }) => void;
  dateRange: [number, number];
  setDateRange: (range: [number, number]) => void;
}

const categories = {
  sciences: ["physique"],
  nature: ["faune"]
};

const FilterBar = ({ filters, setFilters, dateRange, setDateRange }: FilterBarProps) => {
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value || undefined;
    setFilters({ category, subcategory: undefined });
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subcategory = e.target.value || undefined;
    setFilters({ ...filters, subcategory });
  };

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 backdrop-blur-sm bg-zinc-900/70 border border-zinc-700 rounded-2xl px-8 py-6 shadow-xl z-50 min-w-[460px] max-w-[520px] flex flex-col gap-6 font-mono text-sm text-zinc-200 mt-10">
      {/* Ligne 1 : catégories + reset */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <label className="uppercase tracking-wider text-xs text-zinc-400">Catégorie</label>
          <select
            value={filters.category || ""}
            onChange={handleCategoryChange}
            className="bg-zinc-800 border border-zinc-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="">Toutes</option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {filters.category && (
          <div className="flex flex-col gap-1">
            <label className="uppercase tracking-wider text-xs text-zinc-400">Sous-catégorie</label>
            <select
              value={filters.subcategory || ""}
              onChange={handleSubcategoryChange}
              className="bg-zinc-800 border border-zinc-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="">Toutes</option>
              {categories[filters.category].map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={() => {
            setFilters({});
            setDateRange([1789, 2025]);
          }}
          className="self-start mt-5 p-2 rounded bg-zinc-800 border border-zinc-600 hover:border-cyan-500 transition duration-200"
          title="Réinitialiser les filtres"
        >
          <img src={Reset} alt="reset" className="w-5 h-5 opacity-70" />
        </button>
      </div>

      {/* Ligne 2 : slider temporel */}
      <div className="flex flex-col gap-1 mt-1">

        <DateRangeSlider
          minYear={1789}
          maxYear={2025}
          range={dateRange}
          onChange={setDateRange}
        />
      </div>
    </div>
  );
};

export default FilterBar;
