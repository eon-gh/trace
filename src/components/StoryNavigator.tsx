import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import PlayIcon from "../assets/play-svgrepo-com.svg"; // remplace par ton icône play
import CloseIcon from "../assets/close-svgrepo-com.svg"; // idem

interface Story {
  storyName: string;
  description: string;
  category: string;
  subcategory: string;
  startPoint: string;
}

interface StoryNavigatorProps {
  onSelectStory: (pointId: string) => void;
  resetFilters: () => void;
}

const StoryNavigator = ({ onSelectStory, resetFilters }: StoryNavigatorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | "">("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | "">("");

  useEffect(() => {
    fetch("/data/stories.json")
      .then((res) => res.json())
      .then(setStories)
      .catch((err) => console.error("Erreur chargement histoires :", err));
  }, []);

  const categories = Array.from(new Set(stories.map((s) => s.category)));
  const subcategories = Array.from(
    new Set(
      stories
        .filter((s) => !selectedCategory || s.category === selectedCategory)
        .map((s) => s.subcategory)
    )
  );

  const filteredStories = stories.filter((story) => {
    if (selectedCategory && story.category !== selectedCategory) return false;
    if (selectedSubcategory && story.subcategory !== selectedSubcategory) return false;
    return true;
  });

  const handleSelect = (story: Story) => {
    setIsOpen(false);
    resetFilters(); // Désactive tous les filtres
    setTimeout(() => {
      onSelectStory(story.startPoint); // Déclenche la rotation
    }, 300);
  };

  return (
    <>
      {/* Bouton Play */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 z-50 backdrop-blur-md bg-zinc-900/80 border border-zinc-700 hover:bg-cyan-700 text-white p-3 rounded-full shadow-lg transition duration-300"
        title="Explorer une histoire"
      >
        <img src={PlayIcon} alt="Play" className="w-5 h-5" />
      </button>

      {/* Modal */}
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-zinc-900 text-zinc-100 p-6 rounded-xl w-[90%] max-w-xl shadow-xl font-mono relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 transition"
              >
                <img src={CloseIcon} alt="close" className="w-4 h-4" />
              </button>

              <h2 className="text-lg mb-4">Explorer une histoire</h2>

              {/* Filtres */}
            <div className="flex gap-[5%] mb-4 w-full">
            <select
                value={selectedCategory}
                onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory("");
                }}
                className="bg-zinc-800 border border-zinc-600 px-2 py-1 rounded flex-grow text-xs" style={{maxWidth:'46.6%'}}
            >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                <option key={cat} value={cat}>
                    {cat}
                </option>
                ))}
            </select>

            <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="bg-zinc-800 border border-zinc-600 px-2 py-1 rounded flex-grow text-xs" style={{maxWidth:'46.6%'}}
            >
                <option value="">Toutes les sous-catégories</option>
                {subcategories.map((sub) => (
                <option key={sub} value={sub}>
                    {sub}
                </option>
                ))}
            </select>
            </div>



              {/* Liste d'histoires */}
              <ul className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 w-full">
                {filteredStories.map((story) => (
                  <li
                    key={story.startPoint}
                    onClick={() => handleSelect(story)}
                    className="cursor-pointer border border-zinc-600 hover:border-cyan-500 px-4 py-2 rounded transition duration-200 w-full"
                  >
                    <h3 className="font-semibold text-sm">{story.storyName}</h3>
                    <p className="text-xs text-zinc-400">{story.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default StoryNavigator;
