import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import styles from "./Modal.module.css";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  titleId?: string;
  children: ReactNode;
};

const getFocusable = (root: HTMLElement) =>
  Array.from(
    root.querySelectorAll<HTMLElement>(
      [
        "a[href]",
        "button:not([disabled])",
        "textarea:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]',
      ].join(",")
    )
  ).filter(
    (el) =>
      !el.hasAttribute("disabled") &&
      el.getAttribute("aria-hidden") !== "true" &&
      el.tabIndex !== -1
  );

export function Modal({ open, onClose, title, titleId, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const lastActiveElRef = useRef<HTMLElement | null>(null);
  const autoTitleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open || !modalRef.current) return;

    const node = modalRef.current;
    lastActiveElRef.current = document.activeElement as HTMLElement | null;

    // lock scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // initial focus
    (getFocusable(node)[0] ?? node).focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      } else if (e.key === "Tab") {
        const items = getFocusable(node);
        if (!items.length) {
          e.preventDefault();
          node.focus();
          return;
        }
        const current = document.activeElement as HTMLElement | null;
        const i = Math.max(0, items.indexOf(current ?? items[0]));
        const next = e.shiftKey
          ? (i - 1 + items.length) % items.length
          : (i + 1) % items.length;
        e.preventDefault();
        items[next].focus();
      }
    };

    const onFocusIn = (e: FocusEvent) => {
      if (e.target instanceof Node && !node.contains(e.target)) {
        (getFocusable(node)[0] ?? node).focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("focusin", onFocusIn, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("focusin", onFocusIn, true);
      document.body.style.overflow = prevOverflow;
      lastActiveElRef.current?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const computedTitleId =
    typeof title === "string"
      ? titleId ?? `modal-title-${autoTitleId}`
      : titleId;

  const content = (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? computedTitleId : undefined}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={styles.modal}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          typeof title === "string" ? (
            <h2 id={computedTitleId} className={styles.title}>
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

  return createPortal(
    content,
    document.getElementById("modal-root") || document.body
  );
}
