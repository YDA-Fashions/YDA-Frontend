import React from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/utils/cn";

interface ResponsiveImageProps extends Omit<ImageProps, "src"> {
  src: string;
  mobileSrc?: string;
  containerClassName?: string;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  mobileSrc,
  alt,
  className,
  containerClassName,
  priority = false,
  quality = 80,
  fill = true,
  ...props
}) => {
  return (
    <div className={cn("relative w-full h-full", containerClassName)}>
      {mobileSrc ? (
        <>
          <Image
            src={mobileSrc}
            alt={alt}
            fill={fill}
            priority={priority}
            fetchPriority={priority ? "high" : "auto"}
            quality={quality}
            sizes="100vw"
            className={cn("object-cover md:hidden", className)}
            {...props}
          />
          <Image
            src={src}
            alt={alt}
            fill={fill}
            priority={priority}
            fetchPriority={priority ? "high" : "auto"}
            quality={quality}
            sizes="(max-width: 768px) 0vw, 100vw"
            className={cn("hidden object-cover md:block", className)}
            {...props}
          />
        </>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          priority={priority}
          fetchPriority={priority ? "high" : "auto"}
          quality={quality}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn("object-cover", className)}
          {...props}
        />
      )}
    </div>
  );
};
