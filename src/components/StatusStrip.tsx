import { Plus } from "lucide-react";
import { Contact, Profile } from "../types";
import Avatar from "./Avatar";

type Props = {
  profile: Profile;
  contacts: Contact[];
  onToast: (text: string) => void;
};

export default function StatusStrip({ profile, contacts, onToast }: Props) {
  const statusContacts = contacts.filter((contact) => contact.id !== "nexa-ai").slice(0, 5);

  return (
    <div className="status-strip">
      <button
        type="button"
        className="status-card own-status"
        onClick={() => onToast("Status upload will be connected in the backend phase.")}
      >
        <div className="status-avatar-wrap">
          <Avatar
            label={profile.name.charAt(0).toUpperCase() || "T"}
            image={profile.avatar}
            size="md"
            background="linear-gradient(135deg, #0abf92, #00a7e1)"
          />
          <span className="status-add"><Plus size={12} strokeWidth={3} /></span>
        </div>
        <span>You</span>
      </button>

      {statusContacts.map((contact) => (
        <button
          type="button"
          className="status-card"
          key={contact.id}
          onClick={() => onToast(`${contact.name}'s status preview opened.`)}
        >
          <span className="status-ring">
            <Avatar
              label={contact.avatar}
              size="md"
              background={contact.color}
            />
          </span>
          <span>{contact.name}</span>
        </button>
      ))}
    </div>
  );
}
