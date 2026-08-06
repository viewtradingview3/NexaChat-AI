import { useEffect, useMemo, useState } from "react";
import AiDrawer from "./components/AiDrawer";
import ChatWindow from "./components/ChatWindow";
import NewChatModal from "./components/NewChatModal";
import ProfileModal from "./components/ProfileModal";
import SettingsModal from "./components/SettingsModal";
import Sidebar from "./components/Sidebar";
import ToastStack from "./components/ToastStack";
import { seedChats, seedContacts, seedMessages, seedPreferences, seedProfile } from "./data/seed";
import { useInstallPrompt } from "./hooks/useInstallPrompt";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { askNexaAi } from "./services/ai";
import {
  AiIntent,
  Chat,
  ChatFilter,
  Contact,
  Message,
  Preferences,
  Profile,
  ToastMessage
} from "./types";

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

const id = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function App() {
  const [profile, setProfile] = useLocalStorage<Profile>("nexa-profile", seedProfile);
  const [preferences, setPreferences] = useLocalStorage<Preferences>("nexa-preferences", seedPreferences);
  const [chats, setChats] = useLocalStorage<Chat[]>("nexa-chats", seedChats);
  const [messagesByChat, setMessagesByChat] = useLocalStorage<Record<string, Message[]>>(
    "nexa-messages",
    seedMessages
  );
  const [drafts, setDrafts] = useLocalStorage<Record<string, string>>("nexa-drafts", {});

  const [selectedChatId, setSelectedChatId] = useState(chats[0]?.id || "nexa-ai");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ChatFilter>("all");

  const [newChatOpen, setNewChatOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [aiThinkingChat, setAiThinkingChat] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const { canInstall, install } = useInstallPrompt();

  const selectedChat =
    chats.find((chat) => chat.id === selectedChatId) || chats[0];

  const selectedMessages = messagesByChat[selectedChat?.id] || [];

  const visibleChats = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...chats]
      .filter((chat) => {
        if (filter === "unread" && !chat.unread) return false;
        if (filter === "favorites" && !chat.favorite) return false;

        if (!query) return true;

        const messageMatch = (messagesByChat[chat.id] || []).some((message) =>
          message.text.toLowerCase().includes(query)
        );

        return (
          chat.title.toLowerCase().includes(query) ||
          chat.preview.toLowerCase().includes(query) ||
          messageMatch
        );
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [chats, filter, messagesByChat, search]);

  useEffect(() => {
    document.documentElement.dataset.theme = preferences.theme;
    document.documentElement.dataset.compact = preferences.compactMode ? "true" : "false";
  }, [preferences.theme, preferences.compactMode]);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        const input = document.querySelector<HTMLInputElement>(".sidebar-search input");
        input?.focus();
      }
    };

    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  function toast(text: string, type: ToastMessage["type"] = "info") {
    const toastId = id("toast");
    setToasts((items) => [...items, { id: toastId, text, type }]);
    window.setTimeout(() => {
      setToasts((items) => items.filter((item) => item.id !== toastId));
    }, 3000);
  }

  function selectChat(chatId: string) {
    setSelectedChatId(chatId);
    setMobileChatOpen(true);
    setChats((items) =>
      items.map((chat) =>
        chat.id === chatId ? { ...chat, unread: 0 } : chat
      )
    );
  }

  function updatePreview(chatId: string, preview: string) {
    setChats((items) =>
      items.map((chat) =>
        chat.id === chatId
          ? { ...chat, preview, updatedAt: new Date().toISOString(), unread: 0 }
          : chat
      )
    );
  }

  function appendMessage(message: Message) {
    setMessagesByChat((current) => ({
      ...current,
      [message.chatId]: [...(current[message.chatId] || []), message]
    }));
  }

  async function sendText(text: string) {
    if (!selectedChat) return;

    const userMessage: Message = {
      id: id("msg"),
      chatId: selectedChat.id,
      sender: "me",
      kind: "text",
      text,
      createdAt: new Date().toISOString(),
      status: "seen"
    };

    appendMessage(userMessage);
    updatePreview(selectedChat.id, text);
    setDrafts((current) => ({ ...current, [selectedChat.id]: "" }));

    if (selectedChat.isAI) {
      setAiThinkingChat(true);
      const response = await askNexaAi({
        intent: "chat",
        input: text,
        language: preferences.language,
        messages: [...selectedMessages, userMessage]
      });

      appendMessage({
        id: id("ai"),
        chatId: selectedChat.id,
        sender: "ai",
        kind: "text",
        text: response,
        createdAt: new Date().toISOString()
      });
      updatePreview(selectedChat.id, response.replace(/\n/g, " ").slice(0, 80));
      setAiThinkingChat(false);
    }
  }

  function sendAttachment(attachment: Attachment) {
    if (!selectedChat) return;

    appendMessage({
      id: id("attachment"),
      chatId: selectedChat.id,
      sender: "me",
      kind: attachment.kind,
      text: attachment.kind === "image" ? "" : attachment.fileName,
      mediaUrl: attachment.dataUrl,
      fileName: attachment.fileName,
      fileSize: attachment.fileSize,
      createdAt: new Date().toISOString(),
      status: "seen"
    });

    updatePreview(
      selectedChat.id,
      attachment.kind === "image" ? "📷 Photo" : `📎 ${attachment.fileName}`
    );
  }

  function sendVoice(voice: Voice) {
    if (!selectedChat) return;

    appendMessage({
      id: id("voice"),
      chatId: selectedChat.id,
      sender: "me",
      kind: "voice",
      text: "",
      mediaUrl: voice.dataUrl,
      duration: voice.duration,
      createdAt: new Date().toISOString(),
      status: "seen"
    });

    updatePreview(selectedChat.id, "🎤 Voice message");
  }

  function startChat(contact: Contact) {
    const existing = chats.find((chat) => chat.contactId === contact.id);

    if (existing) {
      selectChat(existing.id);
      setNewChatOpen(false);
      return;
    }

    const chat: Chat = {
      id: contact.id,
      contactId: contact.id,
      title: contact.name,
      avatar: contact.avatar,
      preview: "Start a new conversation",
      updatedAt: new Date().toISOString(),
      unread: 0,
      online: contact.online,
      favorite: contact.favorite,
      color: contact.color,
      isAI: contact.id === "nexa-ai"
    };

    setChats((items) => [chat, ...items]);
    setMessagesByChat((current) => ({ ...current, [chat.id]: [] }));
    setSelectedChatId(chat.id);
    setMobileChatOpen(true);
    setNewChatOpen(false);
  }

  async function runAi(intent: AiIntent, input: string) {
    if (!selectedChat) return;

    setAiLoading(true);
    setAiResult("");

    const fallbackInput =
      input ||
      (intent === "translate"
        ? selectedMessages.at(-1)?.text || ""
        : drafts[selectedChat.id] || "");

    const response = await askNexaAi({
      intent,
      input: fallbackInput,
      language: preferences.language,
      messages: selectedMessages
    });

    setAiResult(response);
    setAiLoading(false);
  }

  function useAiResult(text: string) {
    if (!selectedChat) return;
    setDrafts((current) => ({ ...current, [selectedChat.id]: text }));
    setAiOpen(false);
    toast("AI result added to the message box.", "success");
  }

  async function installApp() {
    const accepted = await install();
    toast(
      accepted
        ? "NexaChat installation started."
        : "Install was cancelled.",
      accepted ? "success" : "info"
    );
  }

  if (!selectedChat) {
    return <div className="fatal-state">No chats available.</div>;
  }

  return (
    <div className={`app-shell ${mobileChatOpen ? "mobile-chat-open" : ""} ${aiOpen ? "ai-open" : ""}`}>
      <Sidebar
        chats={visibleChats}
        contacts={seedContacts}
        profile={profile}
        preferences={preferences}
        selectedChatId={selectedChat.id}
        search={search}
        filter={filter}
        canInstall={canInstall}
        onSearch={setSearch}
        onFilter={setFilter}
        onSelectChat={selectChat}
        onNewChat={() => setNewChatOpen(true)}
        onProfile={() => setProfileOpen(true)}
        onSettings={() => setSettingsOpen(true)}
        onToggleTheme={() =>
          setPreferences((current) => ({
            ...current,
            theme: current.theme === "dark" ? "light" : "dark"
          }))
        }
        onInstall={installApp}
        onToast={toast}
      />

      <ChatWindow
        chat={selectedChat}
        messages={selectedMessages}
        preferences={preferences}
        aiThinking={aiThinkingChat && selectedChat.isAI === true}
        draft={drafts[selectedChat.id] || ""}
        onDraftChange={(value) =>
          setDrafts((current) => ({ ...current, [selectedChat.id]: value }))
        }
        onBack={() => setMobileChatOpen(false)}
        onSend={sendText}
        onAttachment={sendAttachment}
        onVoice={sendVoice}
        onOpenAi={() => setAiOpen(true)}
        onToast={toast}
      />

      <AiDrawer
        open={aiOpen}
        loading={aiLoading}
        result={aiResult}
        language={preferences.language}
        draft={drafts[selectedChat.id] || ""}
        onClose={() => setAiOpen(false)}
        onRun={runAi}
        onUseResult={useAiResult}
        onToast={toast}
      />

      <NewChatModal
        open={newChatOpen}
        contacts={seedContacts}
        onClose={() => setNewChatOpen(false)}
        onSelect={startChat}
        onToast={toast}
      />

      <ProfileModal
        open={profileOpen}
        profile={profile}
        onClose={() => setProfileOpen(false)}
        onSave={(nextProfile) => {
          setProfile(nextProfile);
          setProfileOpen(false);
          toast("Profile saved.", "success");
        }}
      />

      <SettingsModal
        open={settingsOpen}
        preferences={preferences}
        canInstall={canInstall}
        onClose={() => setSettingsOpen(false)}
        onChange={setPreferences}
        onInstall={installApp}
      />

      <ToastStack toasts={toasts} />
    </div>
  );
}
