import { AiIntent, AppLanguage, Message } from "../types";

type AskAiArgs = {
  intent: AiIntent;
  input: string;
  language: AppLanguage;
  messages?: Message[];
};

function conversationText(messages: Message[] = []) {
  return messages
    .slice(-20)
    .map((message) => {
      const speaker =
        message.sender === "me"
          ? "Me"
          : message.sender === "ai"
          ? "AI"
          : "Contact";
      return `${speaker}: ${message.text}`;
    })
    .join("\n");
}

function localFallback({
  intent,
  input,
  language,
  messages = []
}: AskAiArgs) {
  const urdu = language === "ur";
  const transcript = conversationText(messages);

  if (intent === "summary") {
    if (!messages.length) {
      return urdu
        ? "Is chat mein abhi summary banane ke liye messages nahi hain."
        : "There are no messages to summarize yet.";
    }

    const topics = messages
      .filter((message) => message.text.trim())
      .slice(-6)
      .map((message) => message.text.replace(/\s+/g, " ").trim());

    return urdu
      ? `Chat ka khulasa:\n• ${topics.join("\n• ")}\n\nNote: Ye offline demo summary hai. Live AI server connect karne par zyada behtar summary milegi.`
      : `Chat summary:\n• ${topics.join("\n• ")}\n\nNote: This is an offline demo summary. Connect the live AI server for deeper summaries.`;
  }

  if (intent === "smart-reply") {
    const last = messages.at(-1)?.text.toLowerCase() || input.toLowerCase();

    if (last.includes("thank")) {
      return urdu
        ? "Koi baat nahi 😊 Khushi hui ke madad ho gayi."
        : "You’re welcome 😊 Glad I could help.";
    }

    if (last.includes("kal") || last.includes("tomorrow")) {
      return urdu
        ? "Theek hai, kal milte hain. Time confirm kar dena 👍"
        : "Sounds good. See you tomorrow—please confirm the time 👍";
    }

    return urdu
      ? "Theek hai, main check karke aapko batata hoon."
      : "Got it. I’ll check and get back to you.";
  }

  if (intent === "translate") {
    return urdu
      ? `English translation:\n${input || messages.at(-1)?.text || "No message selected."}`
      : `Urdu translation (demo):\n${input || messages.at(-1)?.text || "Koi message select nahi hua."}`;
  }

  if (intent === "rewrite") {
    const source = input.trim();
    if (!source) {
      return urdu
        ? "Rewrite karne ke liye draft likhein."
        : "Write a draft first, then ask me to rewrite it.";
    }

    return urdu
      ? `Professional version:\nAssalam-o-Alaikum, ${source} Meherbani karke confirmation share kar dein. Shukriya.`
      : `Professional version:\nHello, ${source} Please share your confirmation when convenient. Thank you.`;
  }

  const clean = input.trim();
  if (!clean) {
    return urdu
      ? "Aap mujh se message, business reply, translation, planning ya kisi bhi sawal mein madad le sakte hain."
      : "Ask me to write messages, plan work, translate text, summarize chats, or answer a question.";
  }

  const lower = clean.toLowerCase();

  if (lower.includes("professional") || lower.includes("customer")) {
    return urdu
      ? "Assalam-o-Alaikum! Aap ke message ka shukriya. Hum aap ki request check kar rahe hain aur jald update share karenge."
      : "Hello! Thank you for your message. We’re reviewing your request and will share an update shortly.";
  }

  if (lower.includes("meeting")) {
    return urdu
      ? "Meeting message:\nAssalam-o-Alaikum, kya hum kal 3:00 baje meeting schedule kar sakte hain? Meherbani karke apni availability confirm kar dein."
      : "Meeting message:\nHello, could we schedule a meeting tomorrow at 3:00 PM? Please confirm your availability.";
  }

  return urdu
    ? `Nexa AI demo response:\nAap ne kaha: “${clean}”\n\nLive AI enable karne ke liye project ke server mein OPENAI_API_KEY add karein.`
    : `Nexa AI demo response:\nYou said: “${clean}”\n\nAdd OPENAI_API_KEY to the project server to enable full live AI.`;
}

export async function askNexaAi(args: AskAiArgs): Promise<string> {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...args,
        messages: args.messages?.slice(-30)
      })
    });

    if (!response.ok) {
      throw new Error("AI server unavailable");
    }

    const data = (await response.json()) as { text?: string };
    if (!data.text) throw new Error("Empty AI response");

    return data.text;
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 650));
    return localFallback(args);
  }
}
