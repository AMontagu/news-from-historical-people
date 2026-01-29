import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

interface GenerateBestRequest {
  headline: string;
  language?: "fr" | "en";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("[api/generate-best] Request received, method:", req.method);

  if (req.method !== "POST") {
    console.log("[api/generate-best] Method not allowed:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { headline, language = "fr" } = req.body as GenerateBestRequest;
  console.log("[api/generate-best] Headline:", headline?.substring(0, 50), "Language:", language);

  if (!headline) {
    console.error("[api/generate-best] Missing headline");
    return res.status(400).json({ error: "Missing headline" });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("[api/generate-best] GOOGLE_API_KEY not configured");
    return res.status(500).json({ error: "GOOGLE_API_KEY not configured" });
  }

  const languageInstruction = language === "fr"
    ? "IMPORTANT: All text fields (name, title, hot_take) MUST be written in French."
    : "IMPORTANT: All text fields (name, title, hot_take) MUST be written in English.";

  const prompt = `You are a comedy writer. Given this news headline, think of the FUNNIEST historical figure who could react to it.

NEWS HEADLINE: "${headline}"

Your task:
1. Think of ANY historical figure from history whose personality/era would create the funniest contrast with this modern news
2. Be creative! Consider politicians, artists, scientists, warriors, philosophers, royalty, inventors, etc.
3. Write their reaction as that character (2-3 sentences, in their voice, anachronistic and witty)
4. Pick an appropriate emoji that represents this figure

${languageInstruction}

Respond in this exact JSON format (no markdown, no code blocks):
{"name": "Full Name", "title": "Their historical title", "era": "Birth-Death years", "avatar": "single emoji", "hot_take": "The funny reaction here"}`;

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

    const figure = {
      name: parsed.name,
      title: parsed.title,
      era: parsed.era,
      avatar: parsed.avatar || "🎭",
    };
    const hotTake = parsed.hot_take;

    console.log("[api/generate-best] Generated figure:", figure.name);
    return res.status(200).json({ figure, hotTake });
  } catch (error) {
    console.error("[api/generate-best] Error:", error);
    return res.status(500).json({ error: "Failed to generate hot take", details: String(error) });
  }
}
