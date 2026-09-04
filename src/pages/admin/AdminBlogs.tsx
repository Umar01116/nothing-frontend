import React, { useEffect, useState, useRef } from "react";
import { AdminLayout } from "./AdminLayout";
import { adminApi } from "../../api/admin";
import { Blog } from "../../api/blogs";
import { DataTable, Column } from "../../components/admin/common/DataTable";
import { StatusBadge } from "../../components/admin/common/StatusBadge";
import { Pagination } from "../../components/admin/common/Pagination";
import { ImageUpload } from "../../components/admin/common/ImageUpload";
import { RichTextRenderer } from "../../components/common/RichTextRenderer";
import { RichTextEditor } from "../../components/editor/RichTextEditor";

export const AdminBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  // Pagination & Filter
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Editor Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Buying Guide");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [featuredImageAlt, setFeaturedImageAlt] = useState("");
  const [readTime, setReadTime] = useState("5 min read");
  const [isPublished, setIsPublished] = useState(true);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");

  const fetchBlogs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminApi.getBlogs({
        page,
        search: search || undefined,
        category: selectedCategory || undefined,
      });
      setBlogs(res.data || []);
      if (res.meta || res.current_page) {
        setCurrentPage(res.meta?.current_page || res.current_page || 1);
        setLastPage(res.meta?.last_page || res.last_page || 1);
        setTotal(res.meta?.total || res.total || 0);
      }
    } catch (err) {
      console.error("Failed to load blogs:", err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1);
  }, [selectedCategory]);

  const openCreateModal = (b?: Blog) => {
    if (b) {
      setEditingBlog(b);
      setTitle(b.title);
      setSlug(b.slug);
      setCategory(b.category);
      setSummary(b.summary || "");
      setContent(b.content);
      setFeaturedImage(b.featured_image || "");
      setFeaturedImageAlt(b.featured_image_alt || "");
      setReadTime(b.read_time || "5 min read");
      setIsPublished(b.is_published);
      setSeoTitle(b.seo_title || "");
      setSeoDescription(b.seo_description || "");
    } else {
      setEditingBlog(null);
      setTitle("");
      setSlug("");
      setCategory("Buying Guide");
      setSummary("");
      setContent("");
      setFeaturedImage("");
      setFeaturedImageAlt("");
      setReadTime("5 min read");
      setIsPublished(true);
      setSeoTitle("");
      setSeoDescription("");
    }
    setEditorTab("write");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        category,
        summary,
        content,
        featured_image: featuredImage || null,
        featured_image_alt: featuredImageAlt || null,
        read_time: readTime,
        is_published: isPublished,
        seo_title: seoTitle || title,
        seo_description: seoDescription || summary,
      };

      if (editingBlog) {
        await adminApi.updateBlog(editingBlog.id, payload);
      } else {
        await adminApi.createBlog(payload);
      }

      setModalOpen(false);
      await fetchBlogs(currentPage);
      alert("Blog article saved successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to save blog post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await adminApi.deleteBlog(id);
      await fetchBlogs(currentPage);
    } catch (err: any) {
      alert(err.message || "Failed to delete article");
    }
  };

  const handleTogglePublish = async (id: number) => {
    try {
      await adminApi.togglePublishBlog(id);
      await fetchBlogs(currentPage);
    } catch (err: any) {
      alert(err.message || "Failed to toggle publish state");
    }
  };

  const columns: Column<Blog>[] = [
    {
      header: "Article",
      accessor: (b) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-16 flex-shrink-0 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center">
            {b.featured_image ? (
              <img src={b.featured_image} alt={b.featured_image_alt || b.title} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-neutral-400">📝</span>
            )}
          </div>
          <div>
            <div className="font-semibold text-neutral-900 line-clamp-1 max-w-sm">{b.title}</div>
            <div className="text-xs text-neutral-500 font-mono">/{b.slug}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: (b) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-800">
          {b.category}
        </span>
      ),
    },
    {
      header: "Read Time",
      accessor: (b) => <span className="text-xs text-neutral-600">{b.read_time || "5 min read"}</span>,
    },
    {
      header: "Views",
      accessor: (b) => <span className="font-semibold text-xs text-neutral-800">{b.view_count.toLocaleString()}</span>,
    },
    {
      header: "Status",
      accessor: (b) => (
        <button
          onClick={() => handleTogglePublish(b.id)}
          className="cursor-pointer transition hover:opacity-80"
          title="Click to toggle publish status"
        >
          <StatusBadge status={b.is_published ? "active" : "inactive"} />
        </button>
      ),
    },
    {
      header: "Published",
      accessor: (b) => (
        <span className="text-xs text-neutral-500">
          {b.published_at ? new Date(b.published_at).toLocaleDateString() : "Draft"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (b) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openCreateModal(b)}
            className="px-2.5 py-1 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(b.id)}
            className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Blog & Articles Management</h1>
            <p className="text-sm text-neutral-500 mt-1">
              Create and manage editorial guides, reviews, and SEO articles
            </p>
          </div>
          <button
            onClick={() => openCreateModal()}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition flex items-center gap-2 self-start shadow-sm"
          >
            <span>+</span> Write New Article
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-neutral-200">
          <input
            type="text"
            placeholder="Search articles by title, keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchBlogs(1)}
            className="flex-1 min-w-[200px] px-3 py-1.5 border rounded-lg text-xs"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 border rounded-lg text-xs bg-white"
          >
            <option value="">All Categories</option>
            <option value="Buying Guide">Buying Guide</option>
            <option value="Review">Review</option>
            <option value="Tips & Tricks">Tips & Tricks</option>
            <option value="News & Updates">News & Updates</option>
            <option value="Tutorial">Tutorial</option>
          </select>
          <button
            onClick={() => fetchBlogs(1)}
            className="px-4 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-lg"
          >
            Search
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
          <DataTable columns={columns} data={blogs} loading={loading} />
          {lastPage > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={lastPage}
              onPageChange={(page) => fetchBlogs(page)}
              totalItems={total}
            />
          )}
        </div>

        {/* Editor Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b px-6 py-4 bg-neutral-50/70">
                <div>
                  <h3 className="font-bold text-lg text-neutral-900">
                    {editingBlog ? "Edit Article" : "Write New Article"}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Rich content editor with SEO optimization and media uploads
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-neutral-400 hover:text-neutral-700 text-2xl leading-none"
                >
                  &times;
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Basic Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Article Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Best Accessories for Nothing Phone 2 in 2026"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-sm font-semibold focus:ring-1 focus:ring-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-sm bg-white outline-none"
                    >
                      <option value="Buying Guide">Buying Guide</option>
                      <option value="Review">Review</option>
                      <option value="Tips & Tricks">Tips & Tricks</option>
                      <option value="News & Updates">News & Updates</option>
                      <option value="Tutorial">Tutorial</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">URL Slug</label>
                    <input
                      type="text"
                      placeholder="auto-generated-from-title"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-xs font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Estimated Read Time</label>
                    <input
                      type="text"
                      placeholder="5 min read"
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-xs outline-none"
                    />
                  </div>
                </div>

                {/* Featured Image Upload from PC */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <ImageUpload
                    label="Featured Article Image (Upload from PC)"
                    value={featuredImage}
                    onChange={setFeaturedImage}
                    folder="blogs"
                  />
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Featured Image Alt Text (SEO)
                    </label>
                    <input
                      type="text"
                      placeholder="Describe the image for search engines"
                      value={featuredImageAlt}
                      onChange={(e) => setFeaturedImageAlt(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-xs outline-none"
                    />
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Helps Google index article photos and improves accessibility.
                    </p>
                  </div>
                </div>

                {/* Excerpt / Summary */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Short Excerpt / Summary</label>
                  <textarea
                    rows={2}
                    placeholder="A brief summary shown on article cards and search results..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs outline-none"
                  />
                </div>

                {/* ══════════════════════════════════════
                    RICH CONTENT / MARKDOWN EDITOR
                ══════════════════════════════════════ */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-neutral-900">Article Content *</label>
                    <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setEditorTab("write")}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                          editorTab === "write" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500"
                        }`}
                      >
                        Editor
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorTab("preview")}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                          editorTab === "preview" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500"
                        }`}
                      >
                        Live Preview
                      </button>
                    </div>
                  </div>

                  {editorTab === "write" ? (
                    <RichTextEditor
                      content={content}
                      onChange={setContent}
                      placeholder="Write your article with rich formatting, headings, tables, images, and embedded videos..."
                      folder="blogs"
                      minHeight="420px"
                    />
                  ) : (
                    <div className="border border-neutral-200 rounded-2xl p-6 bg-neutral-50 min-h-[300px] text-sm leading-relaxed overflow-y-auto max-h-[500px]">
                      {content ? (
                        <RichTextRenderer content={content} className="max-w-none" />
                      ) : (
                        <p className="text-neutral-400 italic">No content written yet.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* SEO Meta Box */}
                <div className="border rounded-2xl p-4 bg-neutral-50 space-y-3">
                  <h4 className="font-bold text-xs text-neutral-900 uppercase tracking-wider">
                    🔍 SEO & Social Meta Configuration
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-neutral-700">SEO Meta Title</label>
                      <input
                        type="text"
                        placeholder="Google Search title..."
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        className="w-full px-3 py-1.5 border rounded-lg text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-neutral-700">
                        SEO Meta Description
                      </label>
                      <input
                        type="text"
                        placeholder="Google Search meta description snippet..."
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        className="w-full px-3 py-1.5 border rounded-lg text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Publish Switch */}
                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-neutral-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="h-4 w-4 rounded text-red-600 focus:ring-red-500"
                    />
                    Publish Live on Website
                  </label>
                </div>

                {/* Submit Controls */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 border rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition disabled:opacity-50 shadow-sm"
                  >
                    {saving ? "Saving Article..." : "Save Article"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBlogs;
