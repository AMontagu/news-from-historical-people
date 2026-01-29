import { useState, useEffect } from "react";
import { CharacterSwitcher } from "@/components/CharacterSwitcher";
import { HotTakeDisplay } from "@/components/HotTakeDisplay";
import { LanguageSelector } from "@/components/LanguageSelector";
import { figures, type HistoricalFigure } from "@/data/figures";
import { fetchRandomArticle, generateHotTakeWithBestFigure, generateHotTake, type NewsArticle } from "@/lib/api";
import { type Language, getTranslations } from "@/lib/i18n";

// Get the top 5 funniest figures for the switcher
const switcherFigures = [...figures]
  .sort((a, b) => a.funniestRank - b.funniestRank)
  .slice(0, 5);

function App() {
  const [language, setLanguage] = useState<Language>("fr");
  const [featuredFigure, setFeaturedFigure] = useState<HistoricalFigure | null>(null);
  const [currentArticle, setCurrentArticle] = useState<NewsArticle | null>(null);
  const [hotTake, setHotTake] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = getTranslations(language);

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    setIsLoading(true);
    setError(null);

    try {
      const article = await fetchRandomArticle();
      if (!article) {
        setError(t.errorLoad);
        setIsLoading(false);
        return;
      }

      setCurrentArticle(article);

      // Let LLM pick the funniest figure and generate response in one call
      const result = await generateHotTakeWithBestFigure(article.title, figures, language);
      const selectedFigure = figures.find((f) => f.id === result.figureId) || figures[0];
      setFeaturedFigure(selectedFigure);
      setHotTake(result.hotTake);
    } catch {
      setError(t.errorGenerate);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCharacterSwitch(figure: HistoricalFigure) {
    if (!currentArticle || figure.id === featuredFigure?.id) return;

    setIsLoading(true);
    setFeaturedFigure(figure);
    setHotTake(null);
    setError(null);

    try {
      const take = await generateHotTake(figure, currentArticle.title, language);
      setHotTake(take);
    } catch {
      setError(t.errorGenerate);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleNewStory() {
    setIsLoading(true);
    setError(null);

    try {
      const article = await fetchRandomArticle();
      if (!article) {
        setError(t.errorLoad);
        setIsLoading(false);
        return;
      }

      setCurrentArticle(article);
      setHotTake(null);

      // Let LLM pick the funniest figure for this new story
      const result = await generateHotTakeWithBestFigure(article.title, figures, language);
      const selectedFigure = figures.find((f) => f.id === result.figureId) || figures[0];
      setFeaturedFigure(selectedFigure);
      setHotTake(result.hotTake);
    } catch {
      setError(t.errorGenerate);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLanguageChange(newLang: Language) {
    setLanguage(newLang);
    // Regenerate current quote in new language if we have an article and figure
    if (currentArticle && featuredFigure) {
      setIsLoading(true);
      setError(null);
      try {
        const take = await generateHotTake(featuredFigure, currentArticle.title, newLang);
        setHotTake(take);
      } catch {
        setError(getTranslations(newLang).errorGenerate);
      } finally {
        setIsLoading(false);
      }
    }
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

        <div className="space-y-8">
          <HotTakeDisplay
            figure={featuredFigure}
            article={currentArticle}
            hotTake={hotTake}
            loading={isLoading}
            onNewStory={handleNewStory}
            translations={t}
          />

          <CharacterSwitcher
            figures={switcherFigures}
            currentFigure={featuredFigure}
            onSwitch={handleCharacterSwitch}
            disabled={isLoading}
            label={t.tryAnother}
          />
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>{t.footer}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
