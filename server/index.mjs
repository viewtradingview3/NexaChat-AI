import "dotenv/config";
import cors from "cors";
import express from "express";
import OpenAI from "openai";

const app = express();
const port = Number(process.env.PORT || 8787);

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    aiConfigured: Boolean(process.env.OPENAI_API_KEY)
  });
});

app.post("/api/ai", async (request, response) => {
  if (!process.env.OPENAI_API_KEY) {
    return response.status(503).json({
      error: "OPENAI_API_KEY is not configured. The web app will use its offline demo AI."
    });
  }

  try {
    const {
      intent = "chat",
      input = "",
      language = "en",
      messages = []
    } = request.body || {};

    const conversation = Array.isArray(messages)
      ? messages
          .slice(-30)
          .map((message) => {
            const speaker =
              message.sender === "me"
                ? "User"
                : message.sender === "ai"
                ? "Assistant"
                : "Contact";
            return `${speaker}: ${message.text || ""}`;
          })
          .join("\n")
      : "";

    const instructions = [
      "You are Nexa AI, an assistant inside a private messaging application.",
      "Be helpful, practical, concise, and safe.",
      language === "ur"
        ? "Reply in clear Roman Urdu unless the user asks for another language."
        : "Reply in clear English unless the user asks for another language.",
      `Requested action: ${intent}.`,
      "For smart replies, return only a ready-to-send reply.",
      "For translations, state the target language and then provide the translation.",
      "For summaries, use short bullets and include decisions or action items when present.",
      "Do not claim that you sent a message or performed an external action."
    ].join(" ");

    const ai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const result = await ai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions,
      input: [
        conversation ? `Conversation:\n${conversation}` : "",
        input ? `User request or draft:\n${input}` : ""
      ]
        .filter(Boolean)
        .join("\n\n")
    });

    response.json({
      text: result.output_text || "I could not generate a response."
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      error: "AI request failed."
    });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`NexaChat AI server running on http://localhost:${port}`);
});
