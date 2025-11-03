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
  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      aria-labelledby={title ? titleId : undefined}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
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
