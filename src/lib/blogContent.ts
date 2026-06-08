/** Prepare Quill HTML and titles for the public article page */

export function readingTime(content: string): number {
  const plain = stripHtml(content || "");
  const words = plain.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Fix slug-like titles saved by mistake in admin */
export function displayTitle(post: { title: string; content?: string | null }): string {
  const title = post.title?.trim() || "";
  const looksLikeSlug =
    title.startsWith("/") ||
    (/^[a-z0-9][a-z0-9-]*$/.test(title) && title.includes("-"));

  if (looksLikeSlug && post.content) {
    const h1Match = post.content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1Match?.[1]) {
      const fromH1 = stripHtml(h1Match[1]);
      if (fromH1.length > 0) return fromH1;
    }
    return title
      .replace(/^\//, "")
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  return title || "Untitled";
}

/**
 * Clean Quill output for reading: remove duplicate title, constrain images,
 * normalize spacing so prose styles apply predictably.
 */
export function prepareBlogHtml(
  content: string,
  options: { stripLeadingH1?: boolean } = {}
): string {
  if (!content?.includes("<")) return content;

  let html = content;

  // Page header already shows the title — drop duplicate h1s from Quill body
  if (options.stripLeadingH1) {
    html = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, "");
  }

  // Prevent huge base64 / inline images from breaking the layout
  html = html.replace(/<img\b([^>]*)>/gi, (_match, attrs: string) => {
    let next = attrs;
    if (!/\bclass\s*=/i.test(next)) {
      next += ' class="blog-content-img"';
    } else {
      next = next.replace(
        /class\s*=\s*["']([^"']*)["']/i,
        'class="$1 blog-content-img"'
      );
    }
    if (!/\bloading\s*=/i.test(next)) {
      next += ' loading="lazy"';
    }
    return `<img${next}>`;
  });

  // Empty Quill paragraphs
  html = html.replace(/<p><br\s*\/?><\/p>/gi, "");

  return html.trim();
}
