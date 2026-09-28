"use client";

// Modal sheet on a native <dialog>. In browsers showModal() makes the page
// behind it inert, which contains the keyboard. jsdom has no showModal, so the
// fallback sets the open attribute. Mount the sheet only while it is open;
// unmounting closes it and returns focus to whatever opened it.
import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export default function Sheet({
  title,
  onClose,
  focusSelector,
  children,
}: {
  title: string;
  onClose: () => void;
  focusSelector?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const returnTo = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (typeof el.showModal === "function") el.showModal();
    else el.setAttribute("open", "");
    const first = focusSelector ? el.querySelector<HTMLElement>(focusSelector) : null;
    (first ?? closeRef.current)?.focus();
    return () => {
      if (typeof el.close === "function" && el.open) el.close();
      if (returnTo?.isConnected) returnTo.focus();
    };
  }, [focusSelector]);

  return (
    <dialog
      ref={ref}
      className="af-sheet af-db"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
      }}
    >
      <div className="af-sheet-top">
        <h2 id={titleId}>{title}</h2>
        <button ref={closeRef} type="button" aria-label="Close panel" onClick={onClose}>
          <X aria-hidden="true" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
