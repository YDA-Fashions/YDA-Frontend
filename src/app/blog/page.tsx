import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { blogService, type BlogPost } from "@/services/blogService";
import { BLOG_PLACEHOLDER_POSTS } from "@/data/blogPlaceholders";
import { displayTitle } from "@/lib/blogContent";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";

export const revalidate = 3600; // ISR: Revalidate every hour

export const metadata: Metadata = {
  title: "Journal | YDA Fashions — Stories of Craft & Heritage",
  description:
    "Explore stories, style guides, and artisan insights from the YDA studio. Discover the heritage behind every handcrafted creation.",
  openGraph: {
    title: "Journal | YDA Fashions",
    description: "Stories of craft, culture, and the artisans behind every print.",
    images: ["/images/home-page-image/small-tote.jpg"],
  },
};

// Estimated reading time in minutes
function readingTime(content: string): number {
  const words = content?.trim().split(/\s+/).length || 0;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  Heritage: "bg-amber-50 text-amber-800 border-amber-100",
  "Style Tips": "bg-stone-50 text-stone-800 border-stone-200",
  "Behind the Craft": "bg-emerald-50 text-emerald-800 border-emerald-100",
  News: "bg-blue-50 text-blue-800 border-blue-100",
};

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  try {
    posts = await blogService.getPosts();
  } catch {
    // Supabase table may not exist yet — show placeholders
    posts = [];
  }

  const displayPosts = posts.length > 0 ? posts : BLOG_PLACEHOLDER_POSTS;
  const [featured, ...rest] = displayPosts;

  return (
    <div className="min-h-screen bg-[#FCFBFA]">
      <Header />

      <main className="pt-32 pb-24">
        {/* ── Page Header ── */}
        <section className="container mx-auto px-6 max-w-7xl mb-20 text-center">
          <p className="text-xs uppercase tracking-widest font-black text-black/50 mb-4">
            YDA Journal
          </p>
          <h1 className="text-5xl md:text-8xl font-serif italic tracking-tighter leading-[1.05] mb-6">
            Stories of Craft <br className="hidden md:block" />& Heritage
          </h1>
          <p className="text-base text-black/60 font-sans max-w-xl mx-auto leading-relaxed">
            Dive into the world of handblock printing, artisan culture, and slow
            fashion from the YDA studio in Jaipur.
          </p>
          <div className="mt-8 w-20 h-px bg-black/10 mx-auto" />
        </section>

        <div className="container mx-auto px-6 max-w-7xl">
          {/* ── Featured Post (Hero Card) ── */}
          {featured && (
            <Link href={`/blog/${featured.slug}`} className="group block mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white border border-[#EBE3D5] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500">
                {/* Image */}
                <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[480px] overflow-hidden bg-[#F5F1E8]">
                  <Image
                    src={featured.cover_image || "/images/home-page-image/sanganeri-print-1.jpg.png"}
                    alt={displayTitle(featured)}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                {/* Content */}
                <div className="flex flex-col justify-center p-10 md:p-16 bg-white">
                  <div className="flex items-center gap-3 mb-6">
                    <span
                      className={`text-[11px] uppercase tracking-widest font-black px-3 py-1 border rounded-full ${
                        CATEGORY_COLORS[featured.category] ||
                        "bg-stone-50 text-stone-700 border-stone-200"
                      }`}
                    >
                      {featured.category}
                    </span>
                    <span className="text-[11px] uppercase tracking-widest font-black text-black/40">
                      Featured
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif italic leading-tight mb-5">
                    {displayTitle(featured)}
                  </h2>
                  <p className="text-sm text-black/60 font-sans leading-relaxed mb-8 line-clamp-3">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-black/50 font-sans">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {formatDate(featured.created_at)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {readingTime(featured.content)} min read
                      </span>
                    </div>
                    <span className="flex items-center gap-2 text-xs uppercase tracking-widest font-black text-black group-hover:gap-4 transition-all">
                      Read <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* ── Remaining Posts Grid ── */}
          {rest.length > 0 && (
            <>
              <div className="flex items-center gap-4 mb-10">
                <BookOpen size={14} className="text-black/40" />
                <h2 className="text-xs uppercase tracking-widest font-black text-black/50">
                  More Articles
                </h2>
                <div className="flex-1 h-px bg-black/8" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-white border border-[#EBE3D5] overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    {/* Card Image */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-[#F5F1E8]">
                      <Image
                        src={
                          post.cover_image ||
                          "/images/home-page-image/small-tote.jpg"
                        }
                        alt={displayTitle(post)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    {/* Card Content */}
                    <div className="flex flex-col flex-grow p-6">
                      <span
                        className={`self-start text-[10px] uppercase tracking-widest font-black px-2.5 py-1 border rounded-full mb-4 ${
                          CATEGORY_COLORS[post.category] ||
                          "bg-stone-50 text-stone-700 border-stone-200"
                        }`}
                      >
                        {post.category}
                      </span>
                      <h3 className="text-xl font-serif italic leading-snug mb-3 group-hover:text-black/70 transition-colors">
                        {displayTitle(post)}
                      </h3>
                      <p className="text-sm text-black/55 font-sans leading-relaxed line-clamp-2 flex-grow mb-6">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between border-t border-[#EBE3D5] pt-4">
                        <div className="flex items-center gap-3 text-xs text-black/40 font-sans">
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {formatDate(post.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {readingTime(post.content)} min
                          </span>
                        </div>
                        <ArrowRight
                          size={14}
                          className="text-black/30 group-hover:text-black group-hover:translate-x-1 transition-all"
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Empty state if no posts at all */}
          {displayPosts.length === 0 && (
            <div className="text-center py-32">
              <BookOpen size={40} className="mx-auto text-black/20 mb-6" strokeWidth={1} />
              <h2 className="text-2xl font-serif italic text-black/50 mb-3">
                The Journal is Coming Soon
              </h2>
              <p className="text-sm text-black/40 font-sans">
                Check back soon for stories from the YDA studio.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
