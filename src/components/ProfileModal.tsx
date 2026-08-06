import { Camera, Save, X } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Profile } from "../types";
import Avatar from "./Avatar";

type Props = {
  open: boolean;
  profile: Profile;
  onClose: () => void;
  onSave: (profile: Profile) => void;
};

export default function ProfileModal({ open, profile, onClose, onSave }: Props) {
  const [draft, setDraft] = useState(profile);

  useEffect(() => setDraft(profile), [profile, open]);

  if (!open) return null;

  function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setDraft((current) => ({ ...current, avatar: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="modal-card profile-modal" onMouseDown={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <div>
            <h2>Your profile</h2>
            <p>Choose how people see you</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose}><X size={20} /></button>
        </header>

        <div className="profile-editor">
          <label className="profile-photo-editor">
            <Avatar
              label={draft.name.charAt(0).toUpperCase() || "T"}
              image={draft.avatar}
              background="linear-gradient(135deg, #0abf92, #00a7e1)"
              size="xl"
            />
            <span><Camera size={18} /> Change photo</span>
            <input type="file" hidden accept="image/*" onChange={upload} />
          </label>

          <label>
            Display name
            <input
              value={draft.name}
              maxLength={32}
              onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
            />
          </label>

          <label>
            About
            <input
              value={draft.about}
              maxLength={80}
              onChange={(event) => setDraft((current) => ({ ...current, about: event.target.value }))}
            />
          </label>

          <button
            type="button"
            className="primary-btn full"
            onClick={() => onSave({
              ...draft,
              name: draft.name.trim() || "NexaChat User",
              about: draft.about.trim() || "Available"
            })}
          >
            <Save size={17} />
            Save profile
          </button>
        </div>
      </section>
    </div>
  );
}
