import {
  Bot,
  Download,
  MessageCirclePlus,
  Moon,
  Search,
  Settings,
  Sun,
  UserRound
} from "lucide-react";
import { Chat, ChatFilter, Contact, Preferences, Profile } from "../types";
import { formatChatTime } from "../utils/format";
import Avatar from "./Avatar";
import StatusStrip from "./StatusStrip";

type Props = {
  chats: Chat[];
  contacts: Contact[];
  profile: Profile;
  preferences: Preferences;
  selectedChatId: string;
  search: string;
  filter: ChatFilter;
  canInstall: boolean;
  onSearch: (value: string) => void;
  onFilter: (filter: ChatFilter) => void;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onProfile: () => void;
  onSettings: () => void;
  onToggleTheme: () => void;
  onInstall: () => void;
  onToast: (text: string) => void;
};

export default function Sidebar({
  chats,
  contacts,
  profile,
  preferences,
  selectedChatId,
  search,
  filter,
  canInstall,
  onSearch,
  onFilter,
  onSelectChat,
  onNewChat,
  onProfile,
  onSettings,
  onToggleTheme,
  onInstall,
  onToast
}: Props) {
  return (
    <aside className="sidebar">
      <header className="sidebar-top">
        <div className="brand-lockup">
          <div className="brand-mark"><Bot size={22} /></div>
          <div>
            <h1>NexaChat</h1>
            <p>AI Messenger</p>
          </div>
        </div>

        <div className="top-actions">
          {canInstall && (
            <button className="icon-btn" type="button" title="Install app" onClick={onInstall}>
              <Download size={19} />
            </button>
          )}
          <button className="icon-btn" type="button" title="Theme" onClick={onToggleTheme}>
            {preferences.theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <button className="icon-btn" type="button" title="Settings" onClick={onSettings}>
            <Settings size={19} />
          </button>
        </div>
      </header>

      <button type="button" className="profile-mini" onClick={onProfile}>
        <Avatar
          label={profile.name.charAt(0).toUpperCase() || "T"}
          image={profile.avatar}
          size="md"
          background="linear-gradient(135deg, #0abf92, #00a7e1)"
          online
        />
        <span className="profile-mini-copy">
          <strong>{profile.name}</strong>
          <small>{profile.about}</small>
        </span>
        <UserRound size={18} />
      </button>

      <StatusStrip profile={profile} contacts={contacts} onToast={onToast} />

      <div className="sidebar-search">
        <Search size={18} />
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search chats and messages"
        />
        <kbd>⌘ K</kbd>
      </div>

      <div className="chat-toolbar">
        <div className="filter-pills">
          {(["all", "unread", "favorites"] as ChatFilter[]).map((item) => (
            <button
              type="button"
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => onFilter(item)}
            >
              {item === "all" ? "All" : item === "unread" ? "Unread" : "Favorites"}
            </button>
          ))}
        </div>

        <button type="button" className="new-chat-btn" onClick={onNewChat}>
          <MessageCirclePlus size={19} />
        </button>
      </div>

      <div className="chat-list">
        {chats.length ? (
          chats.map((chat) => (
            <button
              type="button"
              key={chat.id}
              className={`chat-list-item ${selectedChatId === chat.id ? "active" : ""}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <Avatar
                label={chat.avatar}
                background={chat.color}
                online={chat.online}
                size="lg"
              />

              <span className="chat-list-copy">
                <span className="chat-list-title-row">
                  <strong>
                    {chat.isAI && <Bot size={14} />}
                    {chat.title}
                  </strong>
                  <time>{formatChatTime(chat.updatedAt)}</time>
                </span>
                <span className="chat-list-preview-row">
                  <span>{chat.preview}</span>
                  {!!chat.unread && <b>{chat.unread}</b>}
                </span>
              </span>
            </button>
          ))
        ) : (
          <div className="sidebar-empty">
            <Search size={28} />
            <p>No matching chats</p>
          </div>
        )}
      </div>
    </aside>
  );
}
