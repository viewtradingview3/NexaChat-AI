import {
  FileUp,
  Mic,
  Paperclip,
  Send,
  Smile,
  Sparkles,
  Square
} from "lucide-react";
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState
} from "react";
import { Preferences } from "../types";

const emojis = ["😀", "😂", "😍", "😊", "👍", "🙏", "🔥", "🎉", "❤️", "✅", "🤝", "✨"];

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
  preferences: Preferences;
  disabled?: boolean;
  initialDraft?: string;
  onDraftChange?: (value: string) => void;
  onSend: (text: string) => void;
  onAttachment: (attachment: Attachment) => void;
  onVoice: (voice: Voice) => void;
  onOpenAi: () => void;
  onToast: (text: string) => void;
};

export default function Composer({
  preferences,
  disabled,
  initialDraft = "",
  onDraftChange,
  onSend,
  onAttachment,
  onVoice,
  onOpenAi,
  onToast
}: Props) {
  const [text, setText] = useState(initialDraft);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const secondsRef = useRef(0);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setText(initialDraft);
  }, [initialDraft]);

  useEffect(() => {
    onDraftChange?.(text);
  }, [text, onDraftChange]);

  function send() {
    const clean = text.trim();
    if (!clean || disabled) return;
    onSend(clean);
    setText("");
    setEmojiOpen(false);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    send();
  }

  function keyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      preferences.enterToSend &&
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      send();
    }
  }

  function fileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      onToast("Maximum attachment size is 3 MB in local demo mode.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      onAttachment({
        dataUrl: reader.result,
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        kind: file.type.startsWith("image/") ? "image" : "file"
      });
    };
    reader.readAsDataURL(file);
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      onToast("Voice recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const reader = new FileReader();

        reader.onload = () => {
          if (typeof reader.result === "string") {
            onVoice({ dataUrl: reader.result, duration: secondsRef.current });
          }
        };

        reader.readAsDataURL(blob);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setSeconds(0);
      secondsRef.current = 0;
      setRecording(true);

      timerRef.current = window.setInterval(() => {
        setSeconds((current) => {
          const next = current + 1;
          secondsRef.current = next;
          if (next >= 90) {
            window.setTimeout(stopRecording, 0);
          }
          return next;
        });
      }, 1000);
    } catch {
      onToast("Microphone permission was not granted.");
    }
  }

  function stopRecording() {
    const recorder = mediaRecorderRef.current;
    if (recorder?.state === "recording") recorder.stop();
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    setRecording(false);
  }

  return (
    <form className="composer" onSubmit={submit}>
      {emojiOpen && (
        <div className="emoji-popover">
          {emojis.map((emoji) => (
            <button
              type="button"
              key={emoji}
              onClick={() => setText((current) => current + emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        className="composer-icon ai-composer-btn"
        title="AI tools"
        onClick={onOpenAi}
      >
        <Sparkles size={20} />
      </button>

      <button
        type="button"
        className="composer-icon"
        title="Emoji"
        onClick={() => setEmojiOpen((value) => !value)}
      >
        <Smile size={21} />
      </button>

      <button
        type="button"
        className="composer-icon"
        title="Attach"
        onClick={() => fileRef.current?.click()}
      >
        <Paperclip size={21} />
      </button>

      <input
        ref={fileRef}
        type="file"
        hidden
        accept="image/*,.pdf,.doc,.docx,.txt,.zip"
        onChange={fileSelected}
      />

      {recording ? (
        <div className="recording-pill">
          <span className="recording-dot" />
          Recording {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
        </div>
      ) : (
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={keyDown}
          placeholder="Write a message"
          rows={1}
          disabled={disabled}
        />
      )}

      {recording ? (
        <button type="button" className="composer-send danger" onClick={stopRecording} title="Stop recording">
          <Square size={18} fill="currentColor" />
        </button>
      ) : text.trim() ? (
        <button type="submit" className="composer-send" title="Send">
          <Send size={19} />
        </button>
      ) : (
        <button type="button" className="composer-send secondary" title="Voice note" onClick={startRecording}>
          <Mic size={20} />
        </button>
      )}
    </form>
  );
}
