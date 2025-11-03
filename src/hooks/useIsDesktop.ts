import { useMediaQuery } from "./useMediaQuery";

// Align with layout breakpoint used in CSS/App: 880px
export function useIsDesktop() {
  return useMediaQuery("(min-width: 880px)");
}
