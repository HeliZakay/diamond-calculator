import { useState } from "react";
export type ModalKind = null | "similar" | "breakdown";

export function useModal() {
  const [active, setActive] = useState<ModalKind>(null);
  return {
    active,
    open: (k: Exclude<ModalKind, null>) => setActive(k),
    close: () => setActive(null),
  };
}
