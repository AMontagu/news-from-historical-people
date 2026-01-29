import { useState, useEffect, useRef } from "react";
import { HotTakeDisplay } from "@/components/HotTakeDisplay";
import { LanguageSelector } from "@/components/LanguageSelector";
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
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <header className="text-center mb-8">
          <div className="flex justify-end mb-2">
            <LanguageSelector language={language} onLanguageChange={handleLanguageChange} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {t.title}
          </h1>
          <p className="text-muted-foreground">
            {t.subtitle}
          </p>
        </header>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6 text-center">
            {error}
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

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>{t.footer}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
