"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

export interface LazyVideoHandle {
  play: () => Promise<void>;
  pause: () => void;
  getVideo: () => HTMLVideoElement | null;
}

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  videoClassName?: string;
  autoPlayWhenVisible?: boolean;
}

const LazyVideo = forwardRef<LazyVideoHandle, LazyVideoProps>(function LazyVideo(
  { src, poster, className = "", videoClassName = "", autoPlayWhenVisible = false },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useImperativeHandle(ref, () => ({
    play: async () => {
      if (!shouldLoad) {
        setShouldLoad(true);
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
      }
      await videoRef.current?.play();
    },
    pause: () => videoRef.current?.pause(),
    getVideo: () => videoRef.current,
  }));

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px", threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad || !autoPlayWhenVisible || isMobile || !videoRef.current) return;
    videoRef.current.play().catch(() => {});
  }, [shouldLoad, autoPlayWhenVisible, isMobile]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {shouldLoad ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 h-full w-full object-cover ${videoClassName}`}
        />
      ) : (
        <div
          className="absolute inset-0 bg-[#F8F8F5]"
          style={
            poster
              ? {
                  backgroundImage: `url(${poster})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
          aria-hidden
        />
      )}
    </div>
  );
});

export default LazyVideo;
