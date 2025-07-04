// src/components/SoundModal.tsx
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaPlay, FaPause, FaArrowLeft, FaArrowRight, FaMusic } from "react-icons/fa";

const tracks = [
  {
    title: "Interstellar (Hans Zimmer)",
    url: "https://soundcloud.com/ziad-a-mahmoud/interstellar-main-theme-extra-extended-soundtrack-by-hans-zimmer",
  },
  {
    title: "Voyage – Ambient Drift",
    url: "https://soundcloud.com/user-123456789/ambient-drift",
  },
  {
    title: "Deep Forest Pulse",
    url: "https://soundcloud.com/user-987654321/deep-forest-pulse",
  },
];

const SoundModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const encodedUrl = encodeURIComponent(tracks[index].url);
  const iframeSrc = `https://w.soundcloud.com/player/?url=${encodedUrl}&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false`;

  const postMessageToPlayer = (command: string) => {
    if (!iframeRef.current) return;
    iframeRef.current.contentWindow?.postMessage(
      JSON.stringify({ method: command }),
      "https://w.soundcloud.com"
    );
  };

  const togglePlayPause = () => {
    const command = isPlaying ? "pause" : "play";
    postMessageToPlayer(command);
    setIsPlaying(!isPlaying);
  };

  const goTo = (direction: "prev" | "next") => {
    setIsPlaying(false);
    setIndex((prev) =>
      direction === "prev"
        ? (prev - 1 + tracks.length) % tracks.length
        : (prev + 1) % tracks.length
    );
  };

  useEffect(() => {
    setTimeout(() => {
      if (isPlaying) postMessageToPlayer("play");
    }, 300);
  }, [index]);

  return (
    <>
      {/* Bouton fixe */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-40 left-6 z-50 backdrop-blur-md bg-zinc-900/80 border border-zinc-700 hover:bg-cyan-600 text-white p-3 rounded-full shadow-lg transition duration-300"
        title="Écouter"
      >
        <FaMusic className="w-4 h-4" />
      </button>

      {/* Modale */}
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 py-10">
            <div className="relative bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-2xl shadow-2xl max-w-md w-full p-6 font-mono text-sm">
              {/* Close */}
              <button
                className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xl"
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>

              {/* Player */}
              <div className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
                <div className="w-full overflow-hidden rounded border border-zinc-700">
                  <iframe
                    ref={iframeRef}
                    title={tracks[index].title}
                    width="100%"
                    height="80"
                    scrolling="no"
                    frameBorder="no"
                    allow="autoplay"
                    className="rounded w-full"
                    src={iframeSrc}
                  />
                </div>

                <div className="text-xs text-zinc-400 text-center">{tracks[index].title}</div>

                <div className="flex justify-center items-center gap-6 mt-1">
                  <button
                    onClick={() => goTo("prev")}
                    className="hover:text-cyan-400 transition"
                    title="Précédent"
                  >
                    <FaArrowLeft />
                  </button>
                  <button
                    onClick={togglePlayPause}
                    className="hover:text-cyan-400 text-lg transition"
                    title="Play/Pause"
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                  <button
                    onClick={() => goTo("next")}
                    className="hover:text-cyan-400 transition"
                    title="Suivant"
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default SoundModal;
