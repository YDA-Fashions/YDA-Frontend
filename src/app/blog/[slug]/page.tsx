import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogArticleContent from "@/components/blog/BlogArticleContent";
import { blogService, BlogPost, normalizeSlug } from "@/services/blogService";
import { BLOG_PLACEHOLDER_POSTS, getPlaceholderBySlug } from "@/data/blogPlaceholders";
import { displayTitle, readingTime } from "@/lib/blogContent";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import "../article.css";

export const revalidate = 60;
export const dynamicParams = true;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const posts = await blogService.getPosts();
    const slugs = posts.map((post) => ({ slug: post.slug }));
    if (slugs.length > 0) return slugs;
  } catch {
    /* fall through */
  }
  return BLOG_PLACEHOLDER_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post =
      (await blogService.getPostBySlug(slug)) ?? getPlaceholderBySlug(slug);
    if (!post) {
      return { title: "Post Not Found | YDA Fashions" };
    }
    const title = displayTitle(post);
    return {
      title: post.meta_title || `${title} | Journal | YDA Fashions`,
      description: post.meta_description || post.excerpt,
      keywords: post.tags
        ? post.tags.split(",").map((t) => t.trim())
        : ["YDA Fashions", "Heritage", "Style"],
      openGraph: {
        title: post.meta_title || title,
        description: post.meta_description || post.excerpt,
        images: post.cover_image
          ? [{ url: post.cover_image, alt: post.cover_image_alt || title }]
          : [],
        type: "article",
        publishedTime: post.created_at,
        authors: [post.author],
      },
    };
  } catch {
    return {};
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  Heritage: "bg-amber-50 text-amber-800 border-amber-100",
  "Style Tips": "bg-stone-50 text-stone-800 border-stone-200",
  "Behind the Craft": "bg-emerald-50 text-emerald-800 border-emerald-100",
  News: "bg-blue-50 text-blue-800 border-blue-100",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let post: BlogPost | null = null;
  let morePosts: BlogPost[] = [];

  try {
    post = await blogService.getPostBySlug(slug);
    const all = await blogService.getPosts();
    if (all.length > 0) {
      morePosts = all
        .filter((p) => normalizeSlug(p.slug) !== normalizeSlug(slug))
        .slice(0, 3);
    } else {
      morePosts = BLOG_PLACEHOLDER_POSTS.filter(
        (p) => normalizeSlug(p.slug) !== normalizeSlug(slug)
      ).slice(0, 3);
    }
  } catch {
    /* graceful fallback */
  }

  if (!post) {
    post = getPlaceholderBySlug(slug);
  }

  if (!post) notFound();

  const title = displayTitle(post);
  const readMins = readingTime(post.content || post.excerpt || "");

  return (
    <div className="min-h-screen bg-[#FCFBFA]">
      <Header />

      <main className="pt-28 pb-24">
        {/* ── Article header (reading column) ── */}
        <div className="mx-auto w-full max-w-[720px] px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-black/45 hover:text-black transition-colors mb-10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Journal
          </Link>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8">
            <span
              className={`text-[10px] uppercase tracking-widest font-black px-2.5 py-1 border rounded-full ${
                CATEGORY_COLORS[post.category] ||
                "bg-stone-50 text-stone-700 border-stone-200"
              }`}
            >
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-black/50">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.created_at)}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-black/50">
              <Clock className="w-3.5 h-3.5" />
              {readMins} min read
            </span>
            <span className="text-xs text-black/50">By {post.author}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-serif leading-[1.15] tracking-tight text-black mb-6">
            {title}
          </h1>

          {post.excerpt && (
            <p className="text-lg md:text-xl font-serif italic text-black/55 leading-relaxed border-l-2 border-black/15 pl-5 mb-10">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* ── Cover image ── */}
        {post.cover_image && (
          <div className="mx-auto w-full max-w-4xl px-6 mb-14">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/5">
              <Image
                src={post.cover_image}
                alt={post.cover_image_alt || title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          </div>
        )}

        {/* ── Article body ── */}
        <div className="mx-auto w-full max-w-[720px] px-6">
          <article className="mb-14">
            <BlogArticleContent content={post.content || ""} />
          </article>

          {post.tags && (
            <div className="mb-12 pt-8 border-t border-black/10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-black/45 mr-2">
                  Tags
                </span>
                {post.tags.split(",").map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-black/5 text-[10px] uppercase tracking-widest text-black/65"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author */}
          <div className="p-6 md:p-8 bg-[#F9F9F7] border border-black/10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {post.author_image ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
                <Image
                  src={post.author_image}
                  alt={post.author}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                <span className="font-serif text-2xl text-black/40">
                  {post.author.charAt(0)}
                </span>
              </div>
            )}

            <div className="text-center sm:text-left">
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-black/45 mb-1.5">
                Written by
              </p>
              <h2 className="text-xl font-serif mb-2">{post.author}</h2>
              <p className="text-sm leading-relaxed text-black/65">
                {post.author_bio ||
                  "Contributor to the YDA Fashions Journal. Exploring heritage, style, and craftsmanship."}
              </p>
            </div>
          </div>
        </div>

        {/* ── More articles (full width) ── */}
        {morePosts.length > 0 && (
          <section className="container mx-auto px-6 max-w-7xl mt-24 pt-16 border-t border-[#EBE3D5]">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xs uppercase tracking-widest font-black text-black/50">
                More from the Journal
              </h2>
              <Link
                href="/blog"
                className="flex items-center gap-2 text-xs uppercase tracking-widest font-black text-black/50 hover:text-black transition-colors"
              >
                All Articles <ArrowRight size={11} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {morePosts.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group bg-white border border-[#EBE3D5] overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#F5F1E8]">
                    <Image
                      src={
                        p.cover_image ||
                        "/images/home-page-image/small-tote.jpg"
                      }
                      alt={displayTitle(p)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <span
                      className={`inline-block text-[10px] uppercase tracking-widest font-black px-2.5 py-1 border rounded-full mb-3 ${
                        CATEGORY_COLORS[p.category] ||
                        "bg-stone-50 text-stone-700 border-stone-200"
                      }`}
                    >
                      {p.category}
                    </span>
                    <h3 className="text-base font-serif italic leading-snug group-hover:text-black/70 transition-colors">
                      {displayTitle(p)}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
