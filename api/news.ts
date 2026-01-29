import type { VercelRequest, VercelResponse } from "@vercel/node";

interface NewsAPIResponse {
  status: string;
  code?: string;
  message?: string;
  totalResults: number;
  articles: Array<{
    source: { id: string | null; name: string };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
  }>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("[api/news] Request received, method:", req.method);

  if (req.method !== "GET") {
    console.log("[api/news] Method not allowed:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.NEWS_API_KEY;
  console.log("[api/news] NEWS_API_KEY present:", !!apiKey);
  console.log("[api/news] NEWS_API_KEY length:", apiKey?.length ?? 0);

  if (!apiKey) {
    console.error("[api/news] NEWS_API_KEY not configured");
    return res.status(500).json({ error: "NEWS_API_KEY not configured" });
  }

  const category = (req.query.category as string) || "general";
  const country = (req.query.country as string) || "us";
  console.log("[api/news] Category:", category, "Country:", country);

  try {
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=20&apiKey=${apiKey}`;
    console.log("[api/news] Fetching from NewsAPI...");

    const response = await fetch(url);
    console.log("[api/news] NewsAPI response status:", response.status);

    const data = (await response.json()) as NewsAPIResponse;
    console.log("[api/news] NewsAPI response status field:", data.status);

    if (data.status !== "ok") {
      console.error("[api/news] NewsAPI error:", data.code, data.message);
      return res.status(500).json({
        error: "NewsAPI error",
        code: data.code,
        message: data.message
      });
    }

    console.log("[api/news] Total results from API:", data.totalResults);

    const articles = data.articles
      .filter((article) => article.title && article.title !== "[Removed]")
      .map((article) => ({
        title: article.title,
        source: { name: article.source.name },
        url: article.url,
        publishedAt: article.publishedAt,
      }));

    console.log("[api/news] Filtered articles count:", articles.length);

    return res.status(200).json({ articles });
  } catch (error) {
    console.error("[api/news] Error:", error);
    return res.status(500).json({ error: "Failed to fetch news", details: String(error) });
  }
}
