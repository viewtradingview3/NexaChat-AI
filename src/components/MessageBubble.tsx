import { CheckCheck, Download, FileText, Sparkles } from "lucide-react";
import { Message } from "../types";
import { formatMessageTime, secondsToClock } from "../utils/format";

type Props = {
  message: Message;
  showReadReceipts: boolean;
};

export default function MessageBubble({ message, showReadReceipts }: Props) {
  const mine = message.sender === "me";
  const ai = message.sender === "ai";

  return (
    <div className={`message-row ${mine ? "mine" : ai ? "ai-row" : "theirs"}`}>
      <article className={`message-bubble ${mine ? "mine" : ai ? "ai" : "theirs"}`}>
        {ai && (
          <div className="ai-bubble-label">
            <Sparkles size={13} />
            Nexa AI
          </div>
        )}

        {message.kind === "image" && message.mediaUrl && (
          <img className="message-image" src={message.mediaUrl} alt={message.fileName || "Attachment"} />
        )}

        {message.kind === "file" && (
          <a className="file-card" href={message.mediaUrl} download={message.fileName}>
            <span className="file-card-icon"><FileText size={22} /></span>
            <span>
              <strong>{message.fileName || "Document"}</strong>
              <small>{message.fileSize || "File"}</small>
            </span>
            <Download size={18} />
          </a>
        )}

        {message.kind === "voice" && message.mediaUrl && (
          <div className="voice-card">
            <audio controls src={message.mediaUrl} />
            <small>{secondsToClock(message.duration)}</small>
          </div>
        )}

        {!!message.text && <p className="message-text">{message.text}</p>}

        <footer className="message-meta">
          <time>{formatMessageTime(message.createdAt)}</time>
          {mine && showReadReceipts && (
            <CheckCheck
              size={15}
              className={message.status === "seen" ? "seen" : ""}
            />
          )}
        </footer>
      </article>
    </div>
  );
}
