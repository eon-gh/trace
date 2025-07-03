import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SupportIcon from "../assets/heart-svgrepo-com.svg";
import PatreonIcon from "../assets/patreon-141-svgrepo-com.svg";
import TipJar from "../assets/donate-charity-donation-coin-fund-svgrepo-com.svg";
import roadmapData from "../data/roadmap.json";

interface RoadmapItem {
  title: string;
  description: string;
  category: string;
  timeframe: string;
}

const categoryColors: Record<string, string> = {
  contenu: "#0ea5e9",
  UX: "#a78bfa",
  technique: "#facc15",
  collaboration: "#34d399",
  financement: "#f87171",
};

const SupportModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);

    useEffect(() => {
        setRoadmap(roadmapData.sort((a, b) => a.timeframe.localeCompare(b.timeframe)));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("https://formspree.io/f/mblybkkd", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, message }),
      });

      if (response.ok) {
        setSent(true);
        setName("");
        setMessage("");
      } else {
        alert("Erreur lors de l’envoi. Réessaie plus tard.");
      }
    } catch (error) {
      alert("Erreur réseau.");
    }
  };
  return (
    <>
      {/* Bouton fixe en bas à gauche */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 backdrop-blur-md bg-zinc-900/80 border border-zinc-700 hover:bg-pink-600 text-white p-3 rounded-full shadow-lg transition duration-300"
        title="Soutenir TRACE"
      >
        <img src={SupportIcon} alt="Support" className="w-5 h-5" />
      </button>

      {/* Fenêtre modale si ouverte */}
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto px-4 py-8 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
            <div className="relative  text-zinc-200 rounded-2xl px-8 py-6 shadow-2xl max-w-xl w-full font-mono text-sm">
              {/* Bouton de fermeture */}
              <button
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
                onClick={() => setIsOpen(false)}
              >
                x
              </button>

              {/* Contenu de la modale (identique à ta version actuelle) */}
              <div className="flex flex-col gap-8 max-h-[80vh]  pr-2">
                {/* Message sincère */}
                <div>
                  <h1 className="text-lg font-semibold flex items-center gap-2">
                    <img src={SupportIcon} alt="Support" className="w-5 h-5 opacity-80" />
                    Soutenir TRACE
                  </h1>
                  <p className="mt-2 text-zinc-300 leading-relaxed" style={{textAlign:'justify'}}>
                    Ce projet me tient profondément à cœur. J’ai encore mille idées pour enrichir TRACE,
                    mais peu de moyens pour les concrétiser rapidement. Si vous croiyez en ce que je construis,
                    toute aide — même symbolique — m’aidera à poursuivre cette exploration.
                  </p>
                </div>

                {/* Roadmap */}
                <div>
                  <h2 className="uppercase text-xs text-zinc-400 mb-2 tracking-wide">Roadmap</h2>
                  <ul className="border-l border-zinc-700 pl-4 space-y-4">
                    {roadmap.map((item, index) => (
                      <li key={index} className="relative">
                        <span
                          className="absolute -left-[1.4rem] top-1 w-3 h-3 rounded-full"
                          style={{ backgroundColor: categoryColors[item.category] || "#ccc" }}
                        />
                        <h3 className="text-sm font-semibold">{item.title}</h3>
                        <p className="text-xs text-zinc-400">{item.description}</p>
                        <span className="text-[10px] text-zinc-500 uppercase">{item.timeframe}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Formulaire de contact */}
                 {/* Contact */}
                <div>
                  <h2 className="uppercase text-xs text-zinc-400 mb-2 tracking-wide">Envoyer un mot</h2>
                  {sent ? (
                    <div className="text-cyan-400 text-sm">Merci beaucoup pour votre message !</div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                      <input
                        type="text"
                        name="name"
                        placeholder="Ton prénom"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-zinc-800 border border-zinc-600 px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                      <textarea
                        name="message"
                        placeholder="Une suggestion, un encouragement, un mot tendre..."
                        required
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="bg-zinc-800 border border-zinc-600 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                      />
                      <button
                        type="submit"
                        className="self-end bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-1 rounded text-sm transition"
                      >
                        Envoyer
                      </button>
                    </form>
                  )}
                </div>

                {/* Soutien financier */}
                <div className="border-t border-zinc-700 pt-4">
                  <h2 className="uppercase text-xs text-zinc-400 mb-2 tracking-wide">Soutien</h2>
                  <div className="flex gap-4 items-center">
                    <img src={TipJar} alt="Cagnotte" className="w-12 h-12 opacity-80" />
                    <div className="flex flex-col gap-2">
                      <a
                        href="https://www.patreon.com/tonlien"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-pink-600 hover:bg-pink-700 px-4 py-1 rounded text-sm text-white flex items-center gap-2 transition"
                      >
                        <img src={PatreonIcon} alt="Patreon" className="w-4 h-4" />
                        Me soutenir sur Patreon
                      </a>
                      <a
                        href="https://www.helloasso.com/tonlien"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-zinc-700 hover:bg-zinc-600 px-4 py-1 rounded text-sm text-white transition"
                      >
                        Faire un don ponctuel
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default SupportModal;
