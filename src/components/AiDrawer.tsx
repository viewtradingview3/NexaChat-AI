import {
  ArrowRight,
  Bot,
  Check,
  Clipboard,
  Languages,
  MessageSquareText,
  PenLine,
  Sparkles,
  WandSparkles,
  X
} from "lucide-react";
import { useState } from "react";
import { AiIntent, AppLanguage } from "../types";

type Props = {
  open: boolean;
  loading: boolean;
  result: string;
  language: AppLanguage;
  draft: string;
  onClose: () => void;
  onRun: (intent: AiIntent, input: string) => void;
  onUseResult: (text: string) => void;
  onToast: (text: string) => void;
};

const actions: Array<{
  intent: AiIntent;
  label: string;
  description: string;
  icon: typeof Sparkles;
}> = [
  {
    intent: "summary",
    label: "Summarize chat",
    description: "Turn the conversation into key points",
    icon: MessageSquareText
  },
  {
    intent: "smart-reply",
    label: "Smart reply",
    description: "Generate a useful response",
    icon: WandSparkles
  },
  {
    intent: "translate",
    label: "Translate",
    description: "Translate the latest message",
    icon: Languages
  },
  {
    intent: "rewrite",
    label: "Rewrite draft",
    description: "Make your draft clearer and professional",
    icon: PenLine
  }
];

export default function AiDrawer({
  open,
  loading,
  result,
  language,
  draft,
  onClose,
  onRun,
  onUseResult,
  onToast
}: Props) {
  const [prompt, setPrompt] = useState("");

  async function copy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    onToast("AI result copied.");
  }

  return (
    <aside className={`ai-drawer ${open ? "open" : ""}`}>
      <header className="ai-drawer-header">
        <div className="ai-drawer-title">
          <span><Bot size={21} /></span>
          <div>
            <h2>Nexa AI</h2>
            <p>Chat intelligence</p>
          </div>
        </div>
        <button type="button" className="icon-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </header>

      <div className="ai-drawer-body">
        <div className="ai-hero">
          <Sparkles size={24} />
          <h3>Work faster inside every chat</h3>
          <p>Summarize, translate, improve and answer without leaving the conversation.</p>
        </div>

        <div className="ai-action-grid">
          {actions.map(({ intent, label, description, icon: Icon }) => (
            <button
              type="button"
              key={intent}
              onClick={() => onRun(intent, intent === "rewrite" ? draft : "")}
              disabled={loading}
            >
              <Icon size={19} />
              <span>
                <strong>{label}</strong>
                <small>{description}</small>
              </span>
              <ArrowRight size={16} />
            </button>
          ))}
        </div>

        <div className="ai-custom-box">
          <label>Ask Nexa AI</label>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={
              language === "ur"
                ? "Misal: customer ke liye professional jawab likho"
                : "Example: write a professional customer reply"
            }
            rows={4}
          />
          <button
            type="button"
            className="primary-btn"
            disabled={!prompt.trim() || loading}
            onClick={() => {
              onRun("custom", prompt);
              setPrompt("");
            }}
          >
            <Sparkles size={17} />
            Generate
          </button>
        </div>

        {(loading || result) && (
          <section className="ai-result">
            <header>
              <span>AI result</span>
              {result && (
                <button type="button" onClick={copy}>
                  <Clipboard size={16} />
                  Copy
                </button>
              )}
            </header>

            {loading ? (
              <div className="ai-loading">
                <span /><span /><span />
                Thinking…
              </div>
            ) : (
              <pre>{result}</pre>
            )}

            {result && (
              <button
                type="button"
                className="use-result-btn"
                onClick={() => onUseResult(result)}
              >
                <Check size={17} />
                Use in message
              </button>
            )}
          </section>
        )}
      </div>
    </aside>
  );
}
