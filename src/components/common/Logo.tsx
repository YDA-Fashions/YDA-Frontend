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
        return "w-6 h-6 md:w-10 md:h-10";
      case "stacked":
        return "h-[32px] w-auto md:h-auto md:w-32";
      case "horizontal":
      default:
        return "h-[30px] w-auto md:h-auto md:w-[120px]";
    }
  };

  return (
    <Link
      href="/"
      className={`inline-block group ${className}`}
    >
      <div className={`relative ${getLogoStyles()} transition-transform duration-500 md:group-hover:scale-105`}>
        <Image 
          src="/images/logo/yda-logo-1-.png"
          width={400}
          height={100}
          alt="YDA Logo"
          className="object-contain h-full w-auto"
          priority
        />
      </div>
    </Link>
  );
};

export default Logo;
