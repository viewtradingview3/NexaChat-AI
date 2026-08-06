import { Chat, Contact, Message, Preferences, Profile } from "../types";

const now = new Date();
const isoMinutesAgo = (minutes: number) =>
  new Date(now.getTime() - minutes * 60_000).toISOString();

export const seedProfile: Profile = {
  name: "Tasawar",
  about: "Building something great ✨",
  avatar: ""
};

export const seedPreferences: Preferences = {
  theme: "dark",
  language: "en",
  compactMode: false,
  notifications: true,
  readReceipts: true,
  enterToSend: true
};

export const seedContacts: Contact[] = [
  {
    id: "nexa-ai",
    name: "Nexa AI",
    avatar: "✦",
    about: "Your private AI assistant",
    online: true,
    favorite: true,
    color: "linear-gradient(135deg, #7c5cff, #00d4ff)"
  },
  {
    id: "ali",
    name: "Ali",
    avatar: "A",
    about: "Available",
    online: true,
    favorite: true,
    color: "linear-gradient(135deg, #00c896, #00a7e1)"
  },
  {
    id: "ahmed",
    name: "Ahmed",
    avatar: "AH",
    about: "At work",
    lastSeen: "18 minutes ago",
    color: "linear-gradient(135deg, #ff9966, #ff5e62)"
  },
  {
    id: "sarah",
    name: "Sarah",
    avatar: "S",
    about: "Busy",
    online: true,
    favorite: true,
    color: "linear-gradient(135deg, #ec77ab, #7873f5)"
  },
  {
    id: "usman",
    name: "Usman",
    avatar: "U",
    about: "Hey there! I am using NexaChat.",
    lastSeen: "Yesterday",
    color: "linear-gradient(135deg, #f6d365, #fda085)"
  },
  {
    id: "hamza",
    name: "Hamza",
    avatar: "H",
    about: "Available",
    online: true,
    color: "linear-gradient(135deg, #43e97b, #38f9d7)"
  },
  {
    id: "aisha",
    name: "Aisha",
    avatar: "AS",
    about: "In a meeting",
    lastSeen: "1 hour ago",
    color: "linear-gradient(135deg, #30cfd0, #330867)"
  }
];

export const seedChats: Chat[] = [
  {
    id: "nexa-ai",
    contactId: "nexa-ai",
    title: "Nexa AI",
    avatar: "✦",
    preview: "Ask me anything or summarize a chat.",
    updatedAt: isoMinutesAgo(1),
    unread: 0,
    online: true,
    pinned: true,
    favorite: true,
    isAI: true,
    color: "linear-gradient(135deg, #7c5cff, #00d4ff)"
  },
  {
    id: "ali",
    contactId: "ali",
    title: "Ali",
    avatar: "A",
    preview: "Kal milte hain 👍",
    updatedAt: isoMinutesAgo(8),
    unread: 2,
    online: true,
    pinned: true,
    favorite: true,
    color: "linear-gradient(135deg, #00c896, #00a7e1)"
  },
  {
    id: "ahmed",
    contactId: "ahmed",
    title: "Ahmed",
    avatar: "AH",
    preview: "Document send kar diya.",
    updatedAt: isoMinutesAgo(48),
    unread: 0,
    color: "linear-gradient(135deg, #ff9966, #ff5e62)"
  },
  {
    id: "sarah",
    contactId: "sarah",
    title: "Sarah",
    avatar: "S",
    preview: "Thank you 😊",
    updatedAt: isoMinutesAgo(96),
    unread: 1,
    online: true,
    favorite: true,
    color: "linear-gradient(135deg, #ec77ab, #7873f5)"
  },
  {
    id: "usman",
    contactId: "usman",
    title: "Usman",
    avatar: "U",
    preview: "Voice note",
    updatedAt: isoMinutesAgo(320),
    unread: 0,
    muted: true,
    color: "linear-gradient(135deg, #f6d365, #fda085)"
  }
];

export const seedMessages: Record<string, Message[]> = {
  "nexa-ai": [
    {
      id: "ai-1",
      chatId: "nexa-ai",
      sender: "ai",
      kind: "text",
      text: "Assalam-o-Alaikum! I’m Nexa AI. I can answer questions, translate messages, rewrite drafts, suggest replies, and summarize your conversations.",
      createdAt: isoMinutesAgo(25)
    },
    {
      id: "ai-2",
      chatId: "nexa-ai",
      sender: "ai",
      kind: "text",
      text: "Try: “Write a professional reply to a customer” or open any chat and tap the ✦ AI button.",
      createdAt: isoMinutesAgo(24)
    }
  ],
  "ali": [
    {
      id: "ali-1",
      chatId: "ali",
      sender: "other",
      kind: "text",
      text: "Assalam-o-Alaikum 👋",
      createdAt: isoMinutesAgo(22)
    },
    {
      id: "ali-2",
      chatId: "ali",
      sender: "me",
      kind: "text",
      text: "Wa Alaikum Salam, kya haal hai?",
      createdAt: isoMinutesAgo(20),
      status: "seen"
    },
    {
      id: "ali-3",
      chatId: "ali",
      sender: "other",
      kind: "text",
      text: "Alhamdulillah. Kal milte hain 👍",
      createdAt: isoMinutesAgo(8)
    }
  ],
  "ahmed": [
    {
      id: "ahmed-1",
      chatId: "ahmed",
      sender: "other",
      kind: "text",
      text: "Project ka document send kar diya hai.",
      createdAt: isoMinutesAgo(52)
    },
    {
      id: "ahmed-2",
      chatId: "ahmed",
      sender: "me",
      kind: "text",
      text: "Theek hai, main check karta hoon.",
      createdAt: isoMinutesAgo(48),
      status: "seen"
    }
  ],
  "sarah": [
    {
      id: "sarah-1",
      chatId: "sarah",
      sender: "me",
      kind: "text",
      text: "The design is ready. Please review it.",
      createdAt: isoMinutesAgo(100),
      status: "seen"
    },
    {
      id: "sarah-2",
      chatId: "sarah",
      sender: "other",
      kind: "text",
      text: "Thank you 😊",
      createdAt: isoMinutesAgo(96)
    }
  ],
  "usman": [
    {
      id: "usman-1",
      chatId: "usman",
      sender: "other",
      kind: "text",
      text: "I sent you a voice note.",
      createdAt: isoMinutesAgo(320)
    }
  ]
};
