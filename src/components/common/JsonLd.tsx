import React from "react";

interface JsonLdProps {
  data: any;
}

/**
 * JsonLd Component
 * 
 * Injects JSON-LD structured data into the page head.
 * This helps search engines understand the content (e.g., Products, Organization).
 */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
