import { Bell, CheckCheck, Download, Keyboard, Languages, LayoutList, Moon, Sun, X } from "lucide-react";
import { Preferences } from "../types";

type Props = {
  open: boolean;
  preferences: Preferences;
  canInstall: boolean;
  onClose: () => void;
  onChange: (preferences: Preferences) => void;
  onInstall: () => void;
};

export default function SettingsModal({
  open,
  preferences,
  canInstall,
  onClose,
  onChange,
  onInstall
}: Props) {
  if (!open) return null;

  function toggle(key: keyof Preferences) {
    const value = preferences[key];
    if (typeof value !== "boolean") return;
    onChange({ ...preferences, [key]: !value });
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="modal-card settings-modal" onMouseDown={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <div>
            <h2>Settings</h2>
            <p>Personalize NexaChat AI</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose}><X size={20} /></button>
        </header>

        <div className="settings-list">
          <button
            type="button"
            className="settings-row"
            onClick={() =>
              onChange({
                ...preferences,
                theme: preferences.theme === "dark" ? "light" : "dark"
              })
            }
          >
            <span className="settings-icon">
              {preferences.theme === "dark" ? <Moon size={19} /> : <Sun size={19} />}
            </span>
            <span><strong>Appearance</strong><small>{preferences.theme === "dark" ? "Dark" : "Light"} mode</small></span>
            <b>{preferences.theme === "dark" ? "Dark" : "Light"}</b>
          </button>

          <button
            type="button"
            className="settings-row"
            onClick={() =>
              onChange({
                ...preferences,
                language: preferences.language === "en" ? "ur" : "en"
              })
            }
          >
            <span className="settings-icon"><Languages size={19} /></span>
            <span><strong>AI response language</strong><small>English or Urdu / Roman Urdu</small></span>
            <b>{preferences.language === "en" ? "English" : "Urdu"}</b>
          </button>

          <button type="button" className="settings-row" onClick={() => toggle("compactMode")}>
            <span className="settings-icon"><LayoutList size={19} /></span>
            <span><strong>Compact layout</strong><small>Show more chats on screen</small></span>
            <i className={`toggle ${preferences.compactMode ? "on" : ""}`}><span /></i>
          </button>

          <button type="button" className="settings-row" onClick={() => toggle("notifications")}>
            <span className="settings-icon"><Bell size={19} /></span>
            <span><strong>Notifications</strong><small>Browser message alerts</small></span>
            <i className={`toggle ${preferences.notifications ? "on" : ""}`}><span /></i>
          </button>

          <button type="button" className="settings-row" onClick={() => toggle("readReceipts")}>
            <span className="settings-icon"><CheckCheck size={19} /></span>
            <span><strong>Read receipts</strong><small>Show blue double ticks</small></span>
            <i className={`toggle ${preferences.readReceipts ? "on" : ""}`}><span /></i>
          </button>

          <button type="button" className="settings-row" onClick={() => toggle("enterToSend")}>
            <span className="settings-icon"><Keyboard size={19} /></span>
            <span><strong>Enter to send</strong><small>Shift + Enter makes a new line</small></span>
            <i className={`toggle ${preferences.enterToSend ? "on" : ""}`}><span /></i>
          </button>

          {canInstall && (
            <button type="button" className="settings-row install-row" onClick={onInstall}>
              <span className="settings-icon"><Download size={19} /></span>
              <span><strong>Install NexaChat</strong><small>Add it to desktop or home screen</small></span>
              <b>Install</b>
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
