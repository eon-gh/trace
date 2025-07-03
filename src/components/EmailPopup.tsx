import { useState } from "react";

export default function EmailPopup({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
        >
          ×
        </button>

        {sent ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Merci 🙏</h2>
            <p>Ton message a été envoyé avec succès.</p>
          </div>
        ) : (
          <form
            action="https://formsubmit.co/init.eon@gmail.com"
            method="POST"
            target="_blank" // <-- pour que ça s’ouvre ailleurs et ne perturbe pas le DOM actuel
            className="flex flex-col gap-4"
            onSubmit={() => setSent(true)} // <-- on change l’état juste après soumission
          >
            <h2 className="text-xl font-semibold">Écris-moi</h2>

            <input
              type="email"
              name="email"
              placeholder="Ton adresse e-mail"
              className="border p-2 rounded"
              required
            />
            <textarea
              name="message"
              placeholder="Ton message..."
              className="border p-2 rounded resize-none h-28"
              required
            />

            {/* Options FormSubmit */}
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_next" value="http://localhost:5173" />

            <button
              type="submit"
              className="bg-black text-white py-2 rounded hover:bg-gray-800"
            >
              Envoyer
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
