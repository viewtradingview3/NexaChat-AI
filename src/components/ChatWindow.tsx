import {
  ArrowLeft,
  Bot,
  MoreVertical,
  Phone,
  Search,
  Sparkles,
  Video
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Chat, Message, Preferences } from "../types";
import Avatar from "./Avatar";
import Composer from "./Composer";
import MessageBubble from "./MessageBubble";

type Attachment = {
  dataUrl: string;
  fileName: string;
  fileSize: string;
  kind: "image" | "file";
};

type Voice = {
  dataUrl: string;
  duration: number;
};

type Props = {
  chat: Chat;
  messages: Message[];
  preferences: Preferences;
  aiThinking: boolean;
  draft: string;
  onDraftChange: (value: string) => void;
  onBack: () => void;
  onSend: (text: string) => void;
  onAttachment: (attachment: Attachment) => void;
  onVoice: (voice: Voice) => void;
  onOpenAi: () => void;
  onToast: (text: string) => void;
};

export default function ChatWindow({
  chat,
  messages,
  preferences,
  aiThinking,
  draft,
  onDraftChange,
  onBack,
  onSend,
  onAttachment,
  onVoice,
  onOpenAi,
  onToast
}: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [chatSearch, setChatSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const visibleMessages = useMemo(() => {
    const query = chatSearch.trim().toLowerCase();
    if (!query) return messages;
    return messages.filter((message) =>
      message.text.toLowerCase().includes(query)
    );
  }, [messages, chatSearch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiThinking, chat.id]);

  useEffect(() => {
    setChatSearch("");
    setSearchOpen(false);
  }, [chat.id]);

  return (
    <main className="chat-window">
      <header className="chat-header">
        <button type="button" className="mobile-back" onClick={onBack}>
          <ArrowLeft size={22} />
        </button>

        <Avatar
          label={chat.avatar}
          background={chat.color}
          online={chat.online}
          size="md"
        />

        <div className="chat-header-copy">
          <h2>
            {chat.isAI && <Bot size={16} />}
            {chat.title}
          </h2>
          <p>
            {chat.isAI
              ? "AI assistant · demo works offline"
              : chat.online
              ? "online"
              : "last seen recently"}
          </p>
        </div>

        <div className="chat-header-actions">
          <button type="button" className="icon-btn accent" title="AI tools" onClick={onOpenAi}>
            <Sparkles size={19} />
          </button>
          {!chat.isAI && (
            <>
              <button type="button" className="icon-btn" title="Voice call" onClick={() => onToast("Voice calls need the realtime backend phase.")}>
                <Phone size={18} />
              </button>
              <button type="button" className="icon-btn desktop-only" title="Video call" onClick={() => onToast("Video calls need the WebRTC backend phase.")}>
                <Video size={19} />
              </button>
            </>
          )}
          <button type="button" className="icon-btn" title="Search in chat" onClick={() => setSearchOpen((value) => !value)}>
            <Search size={19} />
          </button>
          <button type="button" className="icon-btn desktop-only" title="More" onClick={() => onToast("More chat actions will be added in the backend phase.")}>
            <MoreVertical size={19} />
          </button>
        </div>
      </header>

      {searchOpen && (
        <div className="in-chat-search">
          <Search size={17} />
          <input
            autoFocus
            value={chatSearch}
            onChange={(event) => setChatSearch(event.target.value)}
            placeholder="Search this conversation"
          />
          <button type="button" onClick={() => { setSearchOpen(false); setChatSearch(""); }}>
            Close
          </button>
        </div>
      )}

      <section className="message-canvas">
        <div className="encryption-note">
          Messages in this demo are saved only in your browser.
        </div>

        {visibleMessages.length ? (
          visibleMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              showReadReceipts={preferences.readReceipts}
            />
          ))
        ) : (
          <div className="conversation-empty">
            <Search size={30} />
            <p>{chatSearch ? "No matching messages" : "Start the conversation"}</p>
          </div>
        )}

        {aiThinking && (
          <div className="message-row ai-row">
            <div className="message-bubble ai typing-bubble">
              <span /><span /><span />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </section>

      <Composer
        preferences={preferences}
        initialDraft={draft}
        onDraftChange={onDraftChange}
        onSend={onSend}
        onAttachment={onAttachment}
        onVoice={onVoice}
        onOpenAi={onOpenAi}
        onToast={onToast}
      />
    </main>
  );
}
