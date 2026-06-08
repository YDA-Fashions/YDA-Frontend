import { BlogPost, normalizeSlug } from "@/services/blogService";

/** Shown on /blog only when Supabase has no published posts yet */
export const BLOG_PLACEHOLDER_POSTS: BlogPost[] = [
  {
    id: "placeholder-1",
    title: "The Ancient Art of Sanganeri Block Printing",
    slug: "sanganeri-block-printing",
    excerpt:
      "For centuries, the artisans of Sanganer, Rajasthan have pressed teak-wood blocks into fabric to tell stories. We trace the legacy of this dying art form.",
    content:
      "For centuries, the artisans of Sanganer, Rajasthan have pressed teak-wood blocks into fabric to tell stories.\n\nEach motif carries generations of skill — from carving the teak block to aligning every repeat by hand. At YDA, we honour this rhythm in every piece we create.",
    cover_image: "/images/home-page-image/sanganeri-print-1.jpg.png",
    author: "Manoj Tailor",
    category: "Heritage",
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "placeholder-2",
    title: "How to Style a Tote: 5 Looks for Every Occasion",
    slug: "how-to-style-a-tote",
    excerpt:
      "From a casual brunch to a formal evening, your YDA tote can do it all. Our style guide walks you through five distinct looks with one iconic bag.",
    content:
      "Your YDA tote is more versatile than you think.\n\nPair it with linen for brunch, structured separates for work, or an evening drape for dinner — the heritage print becomes the statement in every look.",
    cover_image: "/images/home-page-image/big-tote.jpg",
    author: "Manoj Tailor",
    category: "Style Tips",
    published: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "placeholder-3",
    title: "The Gujarati Print: A Story Woven in Colour",
    slug: "gujarati-print-story",
    excerpt:
      "Vibrant, joyful, and deeply symbolic—Gujarati prints are more than patterns. They are visual poetry passed down through generations of master craftspeople.",
    content:
      "Gujarati prints celebrate colour with intention — every hue chosen to evoke joy, festivity, and heritage.\n\nIn our studio, these patterns are adapted for modern living while preserving the soul of the craft.",
    cover_image: "/images/home-page-image/gujarati-print-1.jpg",
    author: "Manoj Tailor",
    category: "Heritage",
    published: true,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

export function getPlaceholderBySlug(slug: string): BlogPost | null {
  const normalized = normalizeSlug(slug);
  return (
    BLOG_PLACEHOLDER_POSTS.find((p) => normalizeSlug(p.slug) === normalized) ??
    null
  );
}
