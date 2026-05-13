"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface HoverLinkProps {
  href: string;
  label: string;
  image: string;
  className?: string;
}

/**
 * HoverImageLink
 * A nav link that shows a floating product image following the cursor on hover.
 * Desktop only — on mobile it renders as a regular Link.
 */
const HoverImageLink = ({ href, label, image, className = "" }: HoverLinkProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <Link
        ref={linkRef}
        href={href}
        className={className}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        {label}
        <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-black transition-all group-hover:w-full" />
      </Link>

      {/* Floating image — portaled to viewport coordinates */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="fixed z-[9997] pointer-events-none hidden lg:block"
            style={{
              left: mousePos.x + 20,
              top: mousePos.y - 80,
            }}
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="relative w-40 h-48 bg-[#F5F1E8] border border-border-beige shadow-2xl overflow-hidden rounded-sm">
              <Image
                src={image}
                alt={label}
                fill
                className="object-contain p-3"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HoverImageLink;
