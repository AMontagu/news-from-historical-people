import type { HistoricalFigure } from "@/data/figures";
import type { Language } from "@/lib/i18n";

export interface NewsArticle {
  title: string;
  source: { name: string };
  url: string;
  publishedAt: string;
}

export async function fetchNews(category: string = "general"): Promise<NewsArticle[]> {
  const url = `/api/news?category=${category}`;
  console.log("[fetchNews] Fetching from:", url);

  try {
    const response = await fetch(url);
    console.log("[fetchNews] Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[fetchNews] Error response:", errorText);
      throw new Error(`Failed to fetch news: ${response.status}`);
    }

    const data = await response.json();
    console.log("[fetchNews] Received data:", data);
    console.log("[fetchNews] Articles count:", data.articles?.length ?? 0);

    return data.articles || [];
  } catch (error) {
    console.error("[fetchNews] Error:", error);
    return [];
  }
}

export async function generateHotTake(
  figure: HistoricalFigure,
  headline: string,
  language: Language = "fr"
): Promise<string> {
  console.log("[generateHotTake] Generating for:", figure.name, "headline:", headline, "language:", language);

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      figure: {
        name: figure.name,
        title: figure.title,
        era: figure.era,
        personality: figure.personality,
      },
      headline,
      language,
    }),
  });

  console.log("[generateHotTake] Response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[generateHotTake] Error response:", errorText);
    throw new Error("Failed to generate hot take");
  }

  const data = await response.json();
  console.log("[generateHotTake] Received:", data);
  return data.hotTake;
}

export async function fetchRandomArticle(): Promise<NewsArticle | null> {
  const articles = await fetchNews("general");
  if (articles.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * articles.length);
  return articles[randomIndex];
}

export interface HotTakeWithFigure {
  figureId: string;
  hotTake: string;
}

export async function generateHotTakeWithBestFigure(
  headline: string,
  figures: HistoricalFigure[],
  language: Language = "fr"
): Promise<HotTakeWithFigure> {
  console.log("[generateHotTakeWithBestFigure] headline:", headline, "language:", language);

  const response = await fetch("/api/generate-best", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      headline,
      figures: figures.map((f) => ({
        id: f.id,
        name: f.name,
        title: f.title,
        era: f.era,
        personality: f.personality,
      })),
      language,
    }),
  });

  console.log("[generateHotTakeWithBestFigure] Response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[generateHotTakeWithBestFigure] Error response:", errorText);
    throw new Error("Failed to generate hot take");
  }

  const data = await response.json();
  console.log("[generateHotTakeWithBestFigure] Received:", data);
  return { figureId: data.figureId, hotTake: data.hotTake };
}
