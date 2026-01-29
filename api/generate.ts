import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

interface GenerateRequest {
  figure: {
    name: string;
    title: string;
    era: string;
    personality: string;
  };
  headline: string;
  language?: "fr" | "en";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("[api/generate] Request received, method:", req.method);

  if (req.method !== "POST") {
    console.log("[api/generate] Method not allowed:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { figure, headline, language = "fr" } = req.body as GenerateRequest;
  console.log("[api/generate] Figure:", figure?.name, "Headline:", headline?.substring(0, 50), "Language:", language);

  if (!figure || !headline) {
    console.error("[api/generate] Missing figure or headline");
    return res.status(400).json({ error: "Missing figure or headline" });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  console.log("[api/generate] GOOGLE_API_KEY present:", !!apiKey);
  console.log("[api/generate] GOOGLE_API_KEY length:", apiKey?.length ?? 0);

  if (!apiKey) {
    console.error("[api/generate] GOOGLE_API_KEY not configured");
    return res.status(500).json({ error: "GOOGLE_API_KEY not configured" });
  }

  const languageInstruction = language === "fr"
    ? "IMPORTANT: You MUST respond in French."
    : "IMPORTANT: You MUST respond in English.";

  const prompt = `You are ${figure.name}, the famous ${figure.title} from ${figure.era}.
You have just been told about this modern news headline: "${headline}"

Your personality: ${figure.personality}

React to this news as if you were really ${figure.name}. Be:
- Anachronistic (interpret through your historical lens)
- Funny and witty
- In character (use speech patterns fitting your era)
- Brief (2-3 sentences max)

${languageInstruction}

Your hot take:`;

  try {
    console.log("[api/generate] Calling Gemini API...");

    const model = new ChatGoogleGenerativeAI({
      apiKey,
      model: "gemini-3-flash-preview",
      temperature: 0.9,
    });

    const response = await model.invoke(prompt);
    const hotTake = response.content as string;

    console.log("[api/generate] Generated hot take length:", hotTake?.length);
    console.log("[api/generate] Hot take preview:", hotTake?.substring(0, 100));

    return res.status(200).json({ hotTake });
  } catch (error) {
    console.error("[api/generate] Error:", error);
    return res.status(500).json({ error: "Failed to generate hot take", details: String(error) });
  }
}
