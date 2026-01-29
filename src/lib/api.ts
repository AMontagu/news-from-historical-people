import type { Language } from "@/lib/i18n";

export interface DynamicFigure {
  name: string;
  title: string;
  era: string;
  avatar: string;
}

export interface NewsArticle {
  title: string;
  source: { name: string };
  url: string;
  publishedAt: string;
}

export async function fetchNews(category: string = "general", country: string = "fr"): Promise<NewsArticle[]> {
  const url = `/api/news?category=${category}&country=${country}`;
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


export async function fetchRandomArticle(language: Language = "fr"): Promise<NewsArticle | null> {
  // Map language to country code for NewsAPI
  const country = language === "fr" ? "fr" : "us";
  const articles = await fetchNews("general", country);
  if (articles.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * articles.length);
  return articles[randomIndex];
}

export interface HotTakeResult {
  figure: DynamicFigure;
  hotTake: string;
}

export async function generateHotTake(
  headline: string,
  language: Language = "fr"
): Promise<HotTakeResult> {
  console.log("[generateHotTake] headline:", headline, "language:", language);

  const response = await fetch("/api/generate-best", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
  return { figure: data.figure, hotTake: data.hotTake };
}
