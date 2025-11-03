import { useEffect, useRef } from "react";
import styles from "./SparkleCursor.module.css";

/**
 * SparkleCursor
 * Global overlay that spawns small flying sparkles at the mouse position.
 * - Respects prefers-reduced-motion (disables effect)
 * - Uses pointer-events:none and fixed overlay so it doesn't block UI
 */
export function SparkleCursor() {
  const layerRef = useRef<HTMLDivElement>(null);
  const lastSpawnRef = useRef<number>(0);
  const reduceMotion = useRef<boolean>(false);

  useEffect(() => {
    // Reduced motion?
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotion.current = mq.matches;
    const onMq = () => (reduceMotion.current = mq.matches);
    mq.addEventListener?.("change", onMq);

    const spawn = (x: number, y: number, count: number) => {
      if (reduceMotion.current) return;
      const host = layerRef.current;
      if (!host) return;
      // Cap total DOM children for perf
      const maxChildren = 160;
      if (host.childElementCount > maxChildren) {
        // remove oldest nodes
        const remove = host.childElementCount - maxChildren + count;
        for (let i = 0; i < remove; i++) host.firstElementChild?.remove();
      }
      for (let i = 0; i < count; i++) {
        const s = document.createElement("span");
        s.className = styles.sparkle;
        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 120; // 50..170px
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        const dur = 600 + Math.random() * 900; // 600..1500ms
        const rot = `${(Math.random() * 360).toFixed(1)}deg`;
        s.style.left = `${x}px`;
        s.style.top = `${y}px`;
        s.style.setProperty("--dx", `${dx}px`);
        s.style.setProperty("--dy", `${dy}px`);
        s.style.setProperty("--dur", `${dur}ms`);
        s.style.setProperty("--rot", rot);
        host.appendChild(s);
        s.addEventListener(
          "animationend",
          () => {
            s.remove();
          },
          { once: true }
        );
      }
    };

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastSpawnRef.current < 50) return; // throttle ~20 fps
      lastSpawnRef.current = now;
      spawn(e.clientX, e.clientY, 1);
    };

    const onEnter = (e: MouseEvent) => {
      spawn(e.clientX, e.clientY, 10);
    };

    const onClick = (e: MouseEvent) => {
      spawn(e.clientX, e.clientY, 14);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseenter", onEnter);
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("click", onClick);
      mq.removeEventListener?.("change", onMq);
    };
  }, []);

  return <div className={styles.layer} ref={layerRef} aria-hidden />;
}

export default SparkleCursor;
