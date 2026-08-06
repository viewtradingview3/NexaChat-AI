export type ThemeMode = "light" | "dark";
export type AppLanguage = "en" | "ur";
export type MessageKind = "text" | "image" | "file" | "voice";
export type MessageStatus = "sent" | "delivered" | "seen";
export type ChatFilter = "all" | "unread" | "favorites";

export type Contact = {
  id: string;
  name: string;
  avatar: string;
  about: string;
  online?: boolean;
  lastSeen?: string;
  favorite?: boolean;
  color?: string;
};

export type Chat = {
  id: string;
  contactId: string;
  title: string;
  avatar: string;
  preview: string;
  updatedAt: string;
  unread: number;
  online?: boolean;
  pinned?: boolean;
  muted?: boolean;
  favorite?: boolean;
  isAI?: boolean;
  color?: string;
};

export type Message = {
  id: string;
  chatId: string;
  sender: "me" | "other" | "ai";
  kind: MessageKind;
  text: string;
  createdAt: string;
  status?: MessageStatus;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  duration?: number;
};

export type Profile = {
  name: string;
  about: string;
  avatar: string;
};

export type Preferences = {
  theme: ThemeMode;
  language: AppLanguage;
  compactMode: boolean;
  notifications: boolean;
  readReceipts: boolean;
  enterToSend: boolean;
};

export type AiIntent =
  | "chat"
  | "summary"
  | "smart-reply"
  | "translate"
  | "rewrite"
  | "custom";

export type ToastMessage = {
  id: string;
  text: string;
  type?: "success" | "info" | "error";
};
