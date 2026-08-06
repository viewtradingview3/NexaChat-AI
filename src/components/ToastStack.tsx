import { CheckCircle2, Info, XCircle } from "lucide-react";
import { ToastMessage } from "../types";

type Props = {
  toasts: ToastMessage[];
};

export default function ToastStack({ toasts }: Props) {
  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <div className={`toast ${toast.type || "info"}`} key={toast.id}>
          {toast.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : toast.type === "error" ? (
            <XCircle size={18} />
          ) : (
            <Info size={18} />
          )}
          <span>{toast.text}</span>
        </div>
      ))}
    </div>
  );
}
