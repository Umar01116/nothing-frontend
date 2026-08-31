import { useEffect, useState } from "react";
import { blogsApi, Blog } from "../../api/blogs";
import { StorePageShell } from "../../components/store/StorePageShell";
import { navigateTo } from "../../utils/store";
import { RichTextRenderer } from "../../components/common/RichTextRenderer";

export function BlogDetailPage({ slug }: { slug: string }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    blogsApi
      .getBlogBySlug(slug)
      .then((res) => {
        setBlog(res.data);
        setRelated(res.related || []);
      })
      .catch((err) => {
        console.error("Failed to load article:", err);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <StorePageShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-red-600" />
        </div>
      </StorePageShell>
    );
  }

  if (!blog) {
    return (
      <StorePageShell>
        <div className="max-w-xl mx-auto rounded-3xl border border-neutral-200 bg-neutral-50 p-12 text-center my-12">
          <div className="text-3xl mb-3">📰</div>
          <h2 className="text-2xl font-bold text-neutral-900">Article Not Found</h2>
          <p className="text-sm text-neutral-500 mt-2">
            The article you are looking for might have been moved or unpublished.
          </p>
          <button
            onClick={() => navigateTo("/blog")}
            className="mt-6 px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl"
          >
            ← Back to Blog
          </button>
        </div>
      </StorePageShell>
    );
  }

  return (
    <StorePageShell>
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-xs text-neutral-500">
        <button onClick={() => navigateTo("/")} className="hover:text-neutral-900">
          Home
        </button>
        <span>/</span>
        <button onClick={() => navigateTo("/blog")} className="hover:text-neutral-900">
          Blog
        </button>
        <span>/</span>
        <span className="text-neutral-900 font-medium truncate max-w-md">{blog.title}</span>
      </div>

      {/* Article Header */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider rounded-full">
            {blog.category}
          </span>
          <span className="text-xs text-neutral-400">•</span>
          <span className="text-xs text-neutral-500 font-medium">{blog.read_time || "5 min read"}</span>
          <span className="text-xs text-neutral-400">•</span>
          <span className="text-xs text-neutral-500">
            {blog.published_at ? new Date(blog.published_at).toLocaleDateString() : "Editorial"}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
          {blog.title}
        </h1>

        {blog.summary && (
          <p className="text-base sm:text-lg text-neutral-600 mt-4 leading-relaxed font-serif">
            {blog.summary}
          </p>
        )}
      </div>

      {/* Featured Banner */}
      {blog.featured_image && (
        <div className="max-w-5xl mx-auto mb-12 rounded-3xl overflow-hidden shadow-lg border border-neutral-200 h-[380px] sm:h-[480px]">
          <img
            src={blog.featured_image}
            alt={blog.featured_image_alt || blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-3xl mx-auto">
        <div className="prose prose-neutral max-w-none text-neutral-800 text-base leading-relaxed space-y-6 font-sans">
          <RichTextRenderer content={blog.content} />
        </div>

        {/* Share and Tags Footer */}
        <div className="mt-14 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-700">Category:</span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-neutral-100 rounded-lg text-neutral-800">
              {blog.category}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500">{blog.view_count} views</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Article link copied to clipboard!");
              }}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition"
            >
              Share Article 🔗
            </button>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <div className="max-w-5xl mx-auto mt-20 pt-14 border-t border-neutral-200">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">More Insights</p>
              <h3 className="text-2xl font-bold text-neutral-900 mt-1">Related Articles</h3>
            </div>
            <button
              onClick={() => navigateTo("/blog")}
              className="text-xs font-bold text-neutral-900 hover:text-red-600 underline"
            >
              View all articles →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigateTo(`/blog/${rel.slug}`)}
                className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-md transition cursor-pointer"
              >
                <div className="h-40 bg-neutral-100 overflow-hidden">
                  {rel.featured_image ? (
                    <img
                      src={rel.featured_image}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">📝</div>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold uppercase text-red-600 tracking-wider">
                    {rel.category}
                  </span>
                  <h4 className="font-bold text-sm text-neutral-900 mt-1 line-clamp-2 group-hover:text-red-600 transition">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-2">{rel.read_time || "5 min read"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </StorePageShell>
  );
}

export default BlogDetailPage;
