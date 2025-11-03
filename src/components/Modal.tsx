import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import styles from "./Modal.module.css";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  titleId?: string;
  children: ReactNode;
};

export function Modal({ open, onClose, title, titleId, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const lastActiveEl = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    // Save last focused element to restore later
    lastActiveEl.current = document.activeElement as HTMLElement | null;

    const node = modalRef.current;
    if (!node) return;

    // Focus trap helper
    const getFocusables = () =>
      Array.from(
        node.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
      );

    // Move initial focus inside
    const focusables = getFocusables();
    const first = focusables[0] ?? node;
    first.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const items = getFocusables();
        if (items.length === 0) {
          e.preventDefault();
          node.focus();
          return;
        }
        const current = document.activeElement as HTMLElement | null;
        const idx = Math.max(0, items.indexOf(current as HTMLElement));
        const nextIdx = e.shiftKey
          ? (idx - 1 + items.length) % items.length
          : (idx + 1) % items.length;
        if (!items.includes(current as HTMLElement)) {
          // If focus somehow escaped, bring it back
          e.preventDefault();
          items[0].focus();
          return;
        }
        // Cycle
        e.preventDefault();
        items[nextIdx].focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      // Restore focus to the previously active element
      lastActiveEl.current?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      aria-labelledby={title ? titleId : undefined}
    >
      <div
        className={styles.modal}
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          typeof title === "string" ? (
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
          ) : (
            title
          )
        ) : null}
        {children}
      </div>
    </div>
  );
}
