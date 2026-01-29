import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

interface Figure {
  id: string;
  name: string;
  title: string;
  era: string;
  personality: string;
}

interface GenerateBestRequest {
  headline: string;
  figures: Figure[];
  language?: "fr" | "en";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("[api/generate-best] Request received, method:", req.method);

  if (req.method !== "POST") {
    console.log("[api/generate-best] Method not allowed:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { headline, figures, language = "fr" } = req.body as GenerateBestRequest;
  console.log("[api/generate-best] Headline:", headline?.substring(0, 50), "Language:", language, "Figures:", figures?.length);

  if (!headline || !figures || figures.length === 0) {
    console.error("[api/generate-best] Missing headline or figures");
    return res.status(400).json({ error: "Missing headline or figures" });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("[api/generate-best] GOOGLE_API_KEY not configured");
    return res.status(500).json({ error: "GOOGLE_API_KEY not configured" });
  }

  const figuresList = figures
    .map((f) => `- ID: "${f.id}" | ${f.name} (${f.title}, ${f.era}): ${f.personality}`)
    .join("\n");

  const languageInstruction = language === "fr"
    ? "IMPORTANT: The hot_take MUST be written in French."
    : "IMPORTANT: The hot_take MUST be written in English.";

  const prompt = `You are a comedy writer. Given this news headline and a list of historical figures, pick the ONE figure who would give the FUNNIEST reaction to this news.

NEWS HEADLINE: "${headline}"

AVAILABLE FIGURES:
${figuresList}

Your task:
1. Pick the figure whose personality/era creates the funniest contrast with this modern news
2. Write their reaction as that character (2-3 sentences, in their voice, anachronistic and witty)

${languageInstruction}

Respond in this exact JSON format (no markdown, no code blocks):
{"figure_id": "the-id-here", "hot_take": "The funny reaction here"}`;

  try {
    console.log("[api/generate-best] Calling Gemini API...");

    const model = new ChatGoogleGenerativeAI({
      apiKey,
      model: "gemini-3-flash-preview",
      temperature: 0.9,
    });

    const response = await model.invoke(prompt);
    const content = response.content as string;

    console.log("[api/generate-best] Raw response:", content);

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[api/generate-best] Failed to parse JSON from response");
      return res.status(500).json({ error: "Invalid response format" });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const figureId = parsed.figure_id;
    const hotTake = parsed.hot_take;

    // Validate figure_id exists
    const validFigure = figures.find((f) => f.id === figureId);
    if (!validFigure) {
      console.error("[api/generate-best] Invalid figure_id returned:", figureId);
      // Fallback to first figure
      return res.status(200).json({ figureId: figures[0].id, hotTake });
    }

    console.log("[api/generate-best] Selected figure:", figureId);
    return res.status(200).json({ figureId, hotTake });
  } catch (error) {
    console.error("[api/generate-best] Error:", error);
    return res.status(500).json({ error: "Failed to generate hot take", details: String(error) });
  }
}
