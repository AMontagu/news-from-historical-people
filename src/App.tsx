import { useState, useEffect, useRef } from "react";
import { HotTakeDisplay } from "@/components/HotTakeDisplay";
import { LanguageSelector } from "@/components/LanguageSelector";
import { DividerFlourish } from "@/components/decorations";
import { fetchRandomArticle, generateHotTake, type NewsArticle, type DynamicFigure } from "@/lib/api";
import { type Language, getTranslations } from "@/lib/i18n";

function App() {
  const [language, setLanguage] = useState<Language>("fr");
  const [currentFigure, setCurrentFigure] = useState<DynamicFigure | null>(null);
  const [currentArticle, setCurrentArticle] = useState<NewsArticle | null>(null);
  const [hotTake, setHotTake] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialLoadDone = useRef(false);

  const t = getTranslations(language);

  // Load initial data on mount (useRef prevents StrictMode double-invoke)
  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    loadNewStory(language);
  }, []);

  async function loadNewStory(lang: Language) {
    setIsLoading(true);
    setError(null);

    try {
      const article = await fetchRandomArticle(lang);
      if (!article) {
        setError(getTranslations(lang).errorLoad);
        setIsLoading(false);
        return;
      }

      setCurrentArticle(article);

      // LLM picks the funniest historical figure and generates their reaction
      const result = await generateHotTake(article.title, lang);
      setCurrentFigure(result.figure);
      setHotTake(result.hotTake);
    } catch {
      setError(getTranslations(lang).errorGenerate);
    } finally {
      setIsLoading(false);
    }
  }

  function handleNewStory() {
    loadNewStory(language);
  }

  function handleLanguageChange(newLang: Language) {
    setLanguage(newLang);
    loadNewStory(newLang);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Ornate Masthead */}
        <header className="masthead relative">
          <div className="flex justify-end mb-4">
            <LanguageSelector language={language} onLanguageChange={handleLanguageChange} />
          </div>

          {/* Decorative top flourish */}
          <div className="flex justify-center mb-2">
            <span className="text-2xl text-[var(--ink-brown)]">☙</span>
          </div>

          <h1 className="masthead-title">
            {t.title}
          </h1>

          <p className="masthead-subtitle text-lg">
            {t.subtitle}
          </p>

          <p className="masthead-date mt-2">
            {t.established}
          </p>

          {/* Decorative bottom flourish */}
          <div className="flex justify-center mt-3">
            <span className="text-2xl text-[var(--ink-brown)]">❧</span>
          </div>
        </header>

        {error && (
          <div className="proclamation text-[var(--ink-red)] text-center mb-6">
            <p className="font-headline italic">{error}</p>
          </div>
        )}

        <HotTakeDisplay
          figure={currentFigure}
          article={currentArticle}
          hotTake={hotTake}
          loading={isLoading}
          onNewStory={handleNewStory}
          translations={t}
        />

        <DividerFlourish className="mt-10 mb-6" />

        <footer className="text-center">
          <p className="font-ui text-sm text-[var(--ink-brown-light)] tracking-wider">
            {t.footer}
          </p>
          <div className="flex justify-center mt-3">
            <span className="text-lg text-[var(--ink-brown)] opacity-50">⚜</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
