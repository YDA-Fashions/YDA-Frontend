"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "stacked" | "horizontal" | "icon";
  className?: string;
  theme?: "light" | "dark";
}

const Logo: React.FC<LogoProps> = ({
  variant = "horizontal",
  className = "",
  theme = "dark",
}) => {
  // Map variant to responsive classes while maintaining aspect ratio
  const getLogoStyles = () => {
    switch (variant) {
      case "icon":
        return "w-8 h-8 md:w-10 md:h-10";
      case "stacked":
        return "w-24 h-auto md:w-32";
      case "horizontal":
      default:
        return "w-28 h-auto md:w-[120px]";
    }
  };

  return (
    <Link
      href="/"
      className={`inline-block group ${className}`}
    >
      <div className={`relative ${getLogoStyles()} transition-transform duration-500 group-hover:scale-105`}>
        <Image 
          src="/images/logo/yda-logo-1-.png"
          width={400}
          height={100}
          alt="YDA Logo"
          className="object-contain"
          priority
        />
      </div>
    </Link>
  );
};

export default Logo;
