"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Disable on touch devices
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice || window.innerWidth < 768) return;
    setIsMobile(false);

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };
    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);

    // Detect hovering over interactive elements
    const addHoverListeners = () => {
      document.querySelectorAll("a, button, [data-cursor-hover]").forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovering(true));
        el.addEventListener("mouseleave", () => setIsHovering(false));
      });
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    addHoverListeners();

    // Inject hide-cursor style
    const style = document.createElement("style");
    style.id = "hide-default-cursor";
    style.innerHTML = `*, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.getElementById("hide-default-cursor")?.remove();
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      {/* Small dot — always at exact cursor position */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full bg-black"
        style={{ width: 6, height: 6 }}
        animate={{
          x: pos.x - 3,
          y: pos.y - 3,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: "tween", duration: 0 }}
      />

      {/* Expanding ring on hover */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border border-black/40"
        animate={{
          x: pos.x - (isHovering ? 20 : 14),
          y: pos.y - (isHovering ? 20 : 14),
          width: isHovering ? 40 : 28,
          height: isHovering ? 40 : 28,
          opacity: isVisible ? 0.6 : 0,
        }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
      />
    </>
  );
};

export default CustomCursor;
