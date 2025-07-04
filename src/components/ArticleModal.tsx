import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../styles/markdown.css";
import ArrowRight from "../assets/right-circle-svgrepo-com.svg"
import ArrowLeft from "../assets/left-circle-svgrepo-com.svg"
import Close from "../assets/close-svgrepo-com.svg"
interface ArticleModalProps {
  content: string;
  onClose: () => void;
  onNavigate: (targetId: string) => void;
  relatedBefore?: string;
  relatedAfter?: string;
}

const ArticleModal = ({
  content,
  onClose,
  onNavigate,
  relatedBefore,
  relatedAfter,
}: ArticleModalProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Lance l'animation d'entrée
    setVisible(true);
    return () => setVisible(false);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300); // Attend la fin de l'animation de fondu
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Fond sombre flouté */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      {/* Contenu principal */}
      <div
        className={`relative bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto transition-all duration-300 transform ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div 
        className="sticky top-1"
        style={{display:'flex', flexDirection:'row', justifyContent:'space-between', flexWrap:'nowrap', textAlign:'center'}}>
                  {/* Bouton de fermeture */}


        {/* Bouton navigation BEFORE */}
        {relatedBefore && (
          <button
            onClick={() => onNavigate(relatedBefore)}
            className=" -translate-y-1/2 hover:scale-110 transition shadow-lg"
            aria-label="Article précédent" 
          >
            <img src={ArrowLeft} alt="" style={{width:"40px"}}/>
          </button>
        )}
        <button
          onClick={handleClose}
          className="-translate-y-1/2 hover:scale-110 transition shadow-lg"
          aria-label="Fermer" 
        >
          <img src={Close} alt="" style={{width:"32px"}}/>
        </button>
        {/* Bouton navigation AFTER */}
        {relatedAfter && (
          <button
            onClick={() => onNavigate(relatedAfter)}
            className="-translate-y-1/2 hover:scale-110 transition shadow-lg"
            aria-label="Article suivant"
          >
            <img src={ArrowRight} alt="" style={{width:"40px"}}/>
          </button>
        )}
        </div>

        <iframe
          src="https://www.youtube.com/embed/UnCeRajvwps?rel=0&autoplay=1"
          className="w-full h-64 rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />


        {/* Contenu markdown */}
        <div className="prose dark:prose-invert max-w-none markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
