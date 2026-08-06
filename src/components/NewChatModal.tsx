import { Search, UserPlus, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Contact } from "../types";
import Avatar from "./Avatar";

type Props = {
  open: boolean;
  contacts: Contact[];
  onClose: () => void;
  onSelect: (contact: Contact) => void;
  onToast: (text: string) => void;
};

export default function NewChatModal({
  open,
  contacts,
  onClose,
  onSelect,
  onToast
}: Props) {
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return contacts;
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.about.toLowerCase().includes(query)
    );
  }, [contacts, search]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal-card new-chat-modal" onMouseDown={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <div>
            <h2>New conversation</h2>
            <p>Choose a contact or start a group</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose}><X size={20} /></button>
        </header>

        <div className="modal-search">
          <Search size={18} />
          <input
            autoFocus
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search contacts"
          />
        </div>

        <div className="new-chat-shortcuts">
          <button type="button" onClick={() => onToast("Group creation will be connected in the backend phase.")}>
            <span><Users size={20} /></span>
            New group
          </button>
          <button type="button" onClick={() => onToast("Contact invitations will be connected in the backend phase.")}>
            <span><UserPlus size={20} /></span>
            Invite contact
          </button>
        </div>

        <div className="modal-contact-list">
          {visible.map((contact) => (
            <button
              type="button"
              key={contact.id}
              onClick={() => {
                onSelect(contact);
                setSearch("");
              }}
            >
              <Avatar
                label={contact.avatar}
                background={contact.color}
                online={contact.online}
                size="md"
              />
              <span>
                <strong>{contact.name}</strong>
                <small>{contact.about}</small>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
