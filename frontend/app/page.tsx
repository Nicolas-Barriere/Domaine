'use client'
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNewLink = () => {
    setUrl("");
    setSlug("");
    setShortUrl("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const form = new FormData();
      form.append("url", url);
      if (slug) form.append("slug", slug);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"}/shorten`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Erreur lors de la génération du lien");
        return;
      }

      const data = await res.json();
      setShortUrl(data.short_url);
    } catch (err) {
      setError("Impossible de créer l'URL. Désolé !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-2xl border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            ⚡ Change the URL
          </h1>
          <p className="text-white/80 text-lg">
            {shortUrl ? "Votre lien a été changé avec succès !" : "Créez un lien amusant en un clic"}
          </p>
        </div>


        {!shortUrl ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="url"
                placeholder="https://exemple.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full px-6 py-4 text-lg rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/50 transition-all duration-300"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
            </div>
            <input
              type="text"
              placeholder="Slug personnalisé (optionnel)"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              className="w-full px-6 py-4 text-lg rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/50 transition-all duration-300"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 px-8 text-lg font-semibold rounded-2xl bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:from-pink-600 hover:to-violet-600 focus:outline-none focus:ring-4 focus:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Génération...
                </div>
              ) : (
                "🚀 Générer l'URL"
              )}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <div className="mt-8 p-6 bg-green-500/20 backdrop-blur-sm rounded-2xl border border-green-400/30 w-full">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Lien généré !
              </h3>
              <div className="flex items-center gap-3">
                <a 
                  href={shortUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 p-3 bg-white/20 rounded-xl text-white hover:bg-white/30 transition-colors duration-200 break-all"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(shortUrl)}
                  className="p-3 bg-blue-500/30 hover:bg-blue-500/50 rounded-xl text-white transition-colors duration-200 flex-shrink-0"
                  title="Copier le lien"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <button
              onClick={handleNewLink}
              className="w-full py-4 px-8 text-lg font-semibold rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-emerald-300 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              ✨ Générer un nouveau lien
            </button>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-500/20 backdrop-blur-sm rounded-2xl border border-red-400/30 flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            Sécurisé • Rapide • Gratuit
          </p>
        </div>
      </div>
    </div>
  );
}
