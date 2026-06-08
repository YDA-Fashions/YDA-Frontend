"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { blogService, BlogPost } from "@/services/blogService";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  X,
  Save,
  Loader2,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  ShieldOff,
  Image as ImageIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
import "./editor.css";
import "react-quill-new/dist/quill.snow.css";
import { Maximize2, Minimize2 } from "lucide-react";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    const Quill = RQ.Quill;
    const Font = Quill.import("formats/font") as any;
    Font.whitelist = [
      false, // default (sans-serif)
      "serif",
      "monospace",
      "prata",
      "playfair",
      "cormorant",
      "lora",
      "merriweather",
      "dm-serif",
      "libre-baskerville",
      "crimson-pro",
      "outfit",
      "raleway",
    ];
    Quill.register(Font, true);
    return RQ;
  },
  { ssr: false }
);

const ADMIN_EMAILS = [
  "support@ydafashions.com",
  "admin@ydafashions.com",
  "ydafashions@gmail.com",
  "harshitnaiwal@zohomail.in",
  "naiwalharshit@gmail.com",
];

const CATEGORIES = ["Style Tips", "Heritage", "Behind the Craft", "News"];

const EMPTY_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  cover_image_alt: "",
  author: "YDA Studio",
  author_bio: "",
  author_image: "",
  category: "Style Tips",
  tags: "",
  meta_title: "",
  meta_description: "",
  published: false,
};

export default function AdminBlogPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuthStore();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isAdmin = useMemo(() => {
    if (!user) return false;
    const email = user.email?.toLowerCase() || "";
    return (
      ADMIN_EMAILS.includes(email) ||
      email.endsWith("@ydafashions.com") ||
      user.app_metadata?.role === "admin" ||
      user.user_metadata?.role === "admin"
    );
  }, [user]);

  // ── Auth Guard ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login?redirect=/admin/blog");
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    if (!isAuthLoading && user && !isAdmin) {
      router.push("/admin");
    }
  }, [user, isAuthLoading, isAdmin, router]);

  // ── Load Posts ─────────────────────────────────────────────────────────
  const loadPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const data = await blogService.getAllPosts();
      setPosts(data);
    } catch (err: any) {
      showToast(err.message || "Failed to load posts", "error");
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) loadPosts();
  }, [user, isAdmin]);

  // ── Toast Helper ───────────────────────────────────────────────────────
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Form Handlers ──────────────────────────────────────────────────────
  const openNewForm = () => {
    setEditingPost(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (post: BlogPost) => {
    setEditingPost(post);
    setForm({
      title: post.title || "",
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      cover_image: post.cover_image || "",
      cover_image_alt: post.cover_image_alt || "",
      author: post.author || "YDA Studio",
      author_bio: post.author_bio || "",
      author_image: post.author_image || "",
      category: post.category || "Style Tips",
      tags: post.tags || "",
      meta_title: post.meta_title || "",
      meta_description: post.meta_description || "",
      published: post.published || false,
    });
    setShowForm(true);
  };

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: editingPost ? prev.slug : blogService.generateSlug(title),
    }));
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      showToast("Title and Slug are required", "error");
      return;
    }
    setIsSaving(true);
    try {
      if (editingPost) {
        await blogService.updatePost(editingPost.id, form);
        showToast("Post updated successfully!");
      } else {
        await blogService.createPost(form as any);
        showToast("Post published successfully!");
      }
      setShowForm(false);
      await loadPosts();
    } catch (err: any) {
      showToast(err.message || "Failed to save post", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this post? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await blogService.deletePost(id);
      showToast("Post deleted");
      await loadPosts();
    } catch (err: any) {
      showToast(err.message || "Failed to delete post", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      await blogService.updatePost(post.id, { published: !post.published });
      showToast(post.published ? "Post unpublished" : "Post published!");
      await loadPosts();
    } catch (err: any) {
      showToast(err.message || "Failed to update post", "error");
    }
  };

  // ── Loading / Auth ─────────────────────────────────────────────────────
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#FCFBFA] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-black/30" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#FCFBFA]">
      <Header />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[500] flex items-center gap-3 px-5 py-3.5 shadow-xl border text-sm font-sans font-semibold rounded-sm ${
            toast.type === "success"
              ? "bg-white border-emerald-200 text-emerald-800"
              : "bg-white border-red-200 text-red-700"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={16} className="text-emerald-600" />
          ) : (
            <X size={16} className="text-red-500" />
          )}
          {toast.msg}
        </div>
      )}

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* ── Page Header ── */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-widest font-black text-black/40 mb-2">
                Admin Panel
              </p>
              <h1 className="text-4xl font-serif italic">Journal Manager</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/blog"
                target="_blank"
                className="flex items-center gap-2 text-xs uppercase tracking-widest font-black text-black/50 hover:text-black transition-colors border border-black/10 px-4 py-2.5"
              >
                <ExternalLink size={12} />
                View Journal
              </Link>
              <button
                onClick={openNewForm}
                className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs uppercase tracking-widest font-black hover:bg-black/80 transition-colors"
              >
                <Plus size={14} />
                New Post
              </button>
            </div>
          </div>

          {/* ── Post Table ── */}
          <div className="bg-white border border-[#EBE3D5] overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#EBE3D5] bg-[#FAF9F7]">
              <span className="col-span-5 text-xs uppercase tracking-widest font-black text-black/40">Title</span>
              <span className="col-span-2 text-xs uppercase tracking-widest font-black text-black/40">Category</span>
              <span className="col-span-2 text-xs uppercase tracking-widest font-black text-black/40">Status</span>
              <span className="col-span-3 text-xs uppercase tracking-widest font-black text-black/40 text-right">Actions</span>
            </div>

            {isLoadingPosts ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-black/30" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen size={32} className="mx-auto text-black/20 mb-4" strokeWidth={1} />
                <p className="text-sm text-black/40 font-sans">No posts yet — create your first one!</p>
              </div>
            ) : (
              <div className="divide-y divide-[#F0EBE3]">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#FDFCFB] transition-colors"
                  >
                    {/* Title */}
                    <div className="col-span-5">
                      <p className="text-sm font-serif italic text-black leading-snug line-clamp-1">
                        {post.title}
                      </p>
                      <p className="text-xs text-black/40 font-sans mt-0.5">/blog/{post.slug}</p>
                    </div>
                    {/* Category */}
                    <div className="col-span-2">
                      <span className="text-xs font-black text-black/60 uppercase tracking-wider">
                        {post.category}
                      </span>
                    </div>
                    {/* Status */}
                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          post.published
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-stone-100 text-stone-500 border border-stone-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${post.published ? "bg-emerald-500" : "bg-stone-400"}`} />
                        {post.published ? "Live" : "Draft"}
                      </span>
                    </div>
                    {/* Actions */}
                    <div className="col-span-3 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleTogglePublish(post)}
                        title={post.published ? "Unpublish" : "Publish"}
                        className="p-2 text-black/40 hover:text-black border border-black/10 hover:border-black/30 transition-colors"
                      >
                        {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => openEditForm(post)}
                        className="p-2 text-black/40 hover:text-black border border-black/10 hover:border-black/30 transition-colors"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
                        className="p-2 text-black/40 hover:text-red-600 border border-black/10 hover:border-red-200 transition-colors disabled:opacity-40"
                      >
                        {deletingId === post.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Write / Edit Post Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />
          {/* Drawer */}
          <div className="relative ml-auto w-full max-w-4xl bg-white h-full overflow-y-auto flex flex-col shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#EBE3D5] sticky top-0 bg-white z-10">
              <div>
                <p className="text-xs uppercase tracking-widest font-black text-black/40">
                  {editingPost ? "Edit Post" : "New Post"}
                </p>
                <h2 className="text-xl font-serif italic mt-0.5">
                  {editingPost ? editingPost.title : "Create Article"}
                </h2>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-black/40 hover:text-black border border-black/10 hover:border-black/30 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Body - Changed to 2 columns for better layout */}
            <div className="flex-1 px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* --- LEFT COLUMN: Core Content --- */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-serif italic border-b border-black/10 pb-2 mb-4">Core Information</h3>
                  <label className="block text-xs uppercase tracking-widest font-black text-black/50 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="The Art of Sanganeri Block Printing"
                    className="w-full bg-[#F9F9F7] border border-black/10 p-4 text-base font-serif italic outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-black text-black/50 mb-2">
                    Slug (URL) *
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      slug: blogService.generateSlug(e.target.value || ""),
                    }))
                  }
                    placeholder="the-art-of-block-printing"
                    className="w-full bg-[#F9F9F7] border border-black/10 p-4 text-sm font-sans outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-black text-black/50 mb-2">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full bg-[#F9F9F7] border border-black/10 p-4 text-sm font-sans outline-none focus:border-black transition-colors"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-black text-black/50 mb-2">
                    Excerpt (Short Preview)
                  </label>
                  <textarea
                    value={form.excerpt}
                    onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                    rows={3}
                    placeholder="A brief summary shown on the blog listing page..."
                    className="w-full bg-[#F9F9F7] border border-black/10 p-4 text-sm font-sans outline-none focus:border-black transition-colors resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-4 border-t border-black/10">
                  <h3 className="text-lg font-serif italic pb-2 mb-4">Media</h3>
                  <label className="block text-xs uppercase tracking-widest font-black text-black/50 mb-2">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    value={form.cover_image}
                    onChange={(e) => setForm((p) => ({ ...p, cover_image: e.target.value }))}
                    placeholder="https://... or /images/your-image.jpg"
                    className="w-full bg-[#F9F9F7] border border-black/10 p-4 text-sm font-sans outline-none focus:border-black transition-colors mb-4"
                  />
                  <label className="block text-xs uppercase tracking-widest font-black text-black/50 mb-2">
                    Cover Image Alt Text (SEO)
                  </label>
                  <input
                    type="text"
                    value={form.cover_image_alt}
                    onChange={(e) => setForm((p) => ({ ...p, cover_image_alt: e.target.value }))}
                    placeholder="Describe the image for screen readers and SEO"
                    className="w-full bg-[#F9F9F7] border border-black/10 p-4 text-sm font-sans outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              {/* --- RIGHT COLUMN: Advanced & SEO --- */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-serif italic border-b border-black/10 pb-2 mb-4">Author Profile</h3>
                  <label className="block text-xs uppercase tracking-widest font-black text-black/50 mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
                    className="w-full bg-[#F9F9F7] border border-black/10 p-4 text-sm font-sans outline-none focus:border-black transition-colors mb-4"
                  />
                  <label className="block text-xs uppercase tracking-widest font-black text-black/50 mb-2">
                    Author Photo URL
                  </label>
                  <input
                    type="text"
                    value={form.author_image}
                    onChange={(e) => setForm((p) => ({ ...p, author_image: e.target.value }))}
                    placeholder="https://... (Author's headshot)"
                    className="w-full bg-[#F9F9F7] border border-black/10 p-4 text-sm font-sans outline-none focus:border-black transition-colors mb-4"
                  />
                  <label className="block text-xs uppercase tracking-widest font-black text-black/50 mb-2">
                    Author Bio
                  </label>
                  <textarea
                    value={form.author_bio}
                    onChange={(e) => setForm((p) => ({ ...p, author_bio: e.target.value }))}
                    rows={2}
                    placeholder="Short description about the author..."
                    className="w-full bg-[#F9F9F7] border border-black/10 p-4 text-sm font-sans outline-none focus:border-black transition-colors resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-4 border-t border-black/10">
                  <h3 className="text-lg font-serif italic pb-2 mb-4">SEO & Metadata</h3>
                  <label className="block text-xs uppercase tracking-widest font-black text-black/50 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={form.meta_title}
                    onChange={(e) => setForm((p) => ({ ...p, meta_title: e.target.value }))}
                    placeholder="SEO Title (Overrides main title for Google)"
                    className="w-full bg-[#F9F9F7] border border-black/10 p-4 text-sm font-sans outline-none focus:border-black transition-colors mb-4"
                  />
                  <label className="block text-xs uppercase tracking-widest font-black text-black/50 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={form.meta_description}
                    onChange={(e) => setForm((p) => ({ ...p, meta_description: e.target.value }))}
                    rows={2}
                    placeholder="SEO description (Overrides excerpt for Google)"
                    className="w-full bg-[#F9F9F7] border border-black/10 p-4 text-sm font-sans outline-none focus:border-black transition-colors resize-none leading-relaxed mb-4"
                  />
                  <label className="block text-xs uppercase tracking-widest font-black text-black/50 mb-2">
                    Tags / Keywords (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                    placeholder="sanganeri, handcrafted, style"
                    className="w-full bg-[#F9F9F7] border border-black/10 p-4 text-sm font-sans outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              {/* --- FULL WIDTH: Rich Text Content & Publish --- */}
              <div className="md:col-span-2 space-y-6 pt-4 border-t border-black/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-serif italic pb-2">Full Article Content</h3>
                </div>
                <div className={isFullscreen ? "fixed inset-0 z-[300] bg-white flex flex-col" : "bg-white relative"}>
                  {/* Fullscreen Header */}
                  {isFullscreen && (
                    <div className="flex items-center justify-between px-6 py-3 border-b border-black/10 bg-[#FAF9F7] shrink-0">
                      <h3 className="text-sm font-serif italic">Editing: {form.title || "Untitled"}</h3>
                      <button
                        onClick={() => setIsFullscreen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest font-black bg-black text-white hover:bg-black/80 transition-colors"
                      >
                        <Minimize2 size={14} />
                        Exit Fullscreen
                      </button>
                    </div>
                  )}
                  <ReactQuill 
                    theme="snow" 
                    value={form.content} 
                    onChange={(val) => setForm((p) => ({ ...p, content: val }))} 
                    className={isFullscreen ? "flex-1 [&_.ql-container]:!text-base" : "h-96 mb-12"}
                    style={isFullscreen ? { display: "flex", flexDirection: "column" } : undefined}
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'font': [false, 'serif', 'monospace', 'prata', 'playfair', 'cormorant', 'lora', 'merriweather', 'dm-serif', 'libre-baskerville', 'crimson-pro', 'outfit', 'raleway'] }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'align': [] }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        ['link', 'image', 'video'],
                        ['clean']
                      ],
                    }}
                  />
                  {/* Fullscreen Toggle Button */}
                  {!isFullscreen && (
                    <button
                      onClick={() => setIsFullscreen(true)}
                      className="absolute bottom-14 right-3 flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest font-black bg-black/90 text-white hover:bg-black transition-colors z-10 shadow-lg"
                    >
                      <Maximize2 size={14} />
                      Fullscreen Editor
                    </button>
                  )}
                </div>

              {/* Published Toggle */}
              <div className="flex items-center gap-4 p-4 bg-[#F9F9F7] border border-black/10">
                <button
                  onClick={() => setForm((p) => ({ ...p, published: !p.published }))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    form.published ? "bg-black" : "bg-black/20"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                      form.published ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
                <div>
                  <p className="text-sm font-sans font-semibold text-black">
                    {form.published ? "Published — Visible on /blog" : "Draft — Hidden from readers"}
                  </p>
                  <p className="text-xs text-black/40 font-sans">
                    Toggle to make this post publicly visible.
                  </p>
                </div>
              </div>
            </div>
          </div>

            {/* Drawer Footer */}
            <div className="px-8 py-6 border-t border-[#EBE3D5] sticky bottom-0 bg-white flex items-center justify-end gap-4">
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-3 text-xs uppercase tracking-widest font-black text-black/50 border border-black/10 hover:border-black/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-8 py-3 bg-black text-white text-xs uppercase tracking-widest font-black hover:bg-black/80 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {editingPost ? "Save Changes" : "Publish Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
