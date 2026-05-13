"use client";

import { useRef, useState } from "react";

/**
 * useMagneticEffect
 * Applies a subtle magnetic pull on a button element toward the cursor.
 * Desktop only — returns null handlers on touch devices.
 */
export function useMagneticEffect(strength = 0.35) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setOffset({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    });
  };

  const onMouseLeave = () => setOffset({ x: 0, y: 0 });

  return { ref, offset, onMouseMove, onMouseLeave };
}
