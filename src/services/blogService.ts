import { supabase } from "@/lib/supabase";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  cover_image_alt?: string;
  author: string;
  author_bio?: string;
  author_image?: string;
  category: string;
  tags?: string;
  meta_title?: string;
  meta_description?: string;
  published: boolean;
  created_at: string;
}

/** Strip slashes/spaces so slugs work in /blog/[slug] URLs */
export function normalizeSlug(slug: string): string {
  return decodeURIComponent(slug)
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

function isValidPost(row: unknown): row is BlogPost {
  return (
    typeof row === "object" &&
    row !== null &&
    !Array.isArray(row) &&
    typeof (row as BlogPost).title === "string" &&
    (row as BlogPost).title.length > 0
  );
}

function mapPost(row: BlogPost): BlogPost {
  return {
    ...row,
    slug: normalizeSlug(row.slug || ""),
    author: row.author || "YDA Studio",
    category: row.category || "News",
    excerpt: row.excerpt || "",
    content: row.content || "",
  };
}

/**
 * Blog Service
 *
 * Handles all CRUD operations for blog posts via Supabase.
 */
export const blogService = {
  /**
   * Fetch all published posts, newest first.
   */
  async getPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapPost);
  },

  /**
   * Fetch ALL posts including drafts (for admin use).
   */
  async getAllPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapPost);
  },

  /**
   * Fetch a single published post by its slug.
   */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const normalized = normalizeSlug(slug);
    if (!normalized) return null;

    // DB may store slug with or without a leading slash (legacy rows)
    const variants = [
      normalized,
      `/${normalized}`,
      decodeURIComponent(slug).trim(),
    ];

    for (const candidate of [...new Set(variants)]) {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", candidate)
        .eq("published", true)
        .maybeSingle();

      if (!error && isValidPost(data)) return mapPost(data);
    }

    // Last resort: match from all published posts
    const { data: all } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true);

    const rows = Array.isArray(all) ? all : [];
    const match = rows.find(
      (p) => isValidPost(p) && normalizeSlug(p.slug || "") === normalized
    );
    return match ? mapPost(match) : null;
  },

  /**
   * Create a new blog post.
   */
  async createPost(post: Omit<BlogPost, "id" | "created_at">): Promise<BlogPost> {
    const payload = { ...post, slug: normalizeSlug(post.slug) };
    const { data, error } = await supabase
      .from("posts")
      .insert([payload])
      .select();

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Post could not be created. Check your Supabase RLS policy — make sure your email is allowed to insert posts.");
    return data[0];
  },

  /**
   * Update an existing blog post by ID.
   */
  async updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    const payload = {
      ...updates,
      ...(updates.slug !== undefined ? { slug: normalizeSlug(updates.slug) } : {}),
    };
    const { data, error } = await supabase
      .from("posts")
      .update(payload)
      .eq("id", id)
      .select();

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Post could not be updated. Check your Supabase RLS policy — make sure your email is allowed to update posts.");
    return data[0];
  },

  /**
   * Delete a blog post by ID.
   */
  async deletePost(id: string): Promise<void> {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  /**
   * Generate a URL-safe slug from a title string.
   */
  generateSlug(title: string): string {
    return normalizeSlug(
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s-/]/g, "")
        .trim()
        .replace(/\s+/g, "-")
    );
  },
};
