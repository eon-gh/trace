import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ArticleModalProps {
  content: string;
  onClose: () => void;
}

const ArticleModal = ({ content, onClose }: ArticleModalProps) => {
  console.log("Contenu de l'article :", content); // Doit afficher du markdown

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl"
        >
          ✕
        </button>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
