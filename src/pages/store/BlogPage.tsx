import { useEffect, useState } from "react";
import { blogsApi, Blog } from "../../api/blogs";
import { StorePageShell } from "../../components/store/StorePageShell";
import { navigateTo } from "../../utils/store";

export function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogsApi
      .getCategories()
      .then((cats) => setCategories(cats || []))
      .catch((err) => console.error("Categories error:", err));
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res: any = await blogsApi.getBlogs({
        category: selectedCategory || undefined,
        search: search || undefined,
      });
      setBlogs(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Blogs fetch error:", err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory]);

  return (
    <StorePageShell eyebrow="Editorial & Insights" title="Guides, Reviews & Nothing Insights">
      {/* Category Pills & Search */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition ${
              selectedCategory === ""
                ? "bg-neutral-900 text-white"
                : "bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400"
            }`}
          >
            All Articles
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition ${
                selectedCategory === cat
                  ? "bg-neutral-900 text-white"
                  : "bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search guides..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchArticles()}
            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-xs bg-white focus:outline-none focus:border-neutral-900"
          />
        </div>
      </div>

      {/* Blog Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-red-600" />
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((b) => (
            <article
              key={b.id}
              onClick={() => navigateTo(`/blog/${b.slug}`)}
              className="group flex flex-col bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              {/* Image Banner */}
              <div className="relative h-52 bg-neutral-100 overflow-hidden">
                {b.featured_image ? (
                  <img
                    src={b.featured_image}
                    alt={b.featured_image_alt || b.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-3xl">
                    📝
                  </div>
                )}
                <span className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur text-[11px] font-bold uppercase tracking-wider rounded-full shadow-xs text-neutral-900">
                  {b.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
                  <span>{b.read_time || "5 min read"}</span>
                  <span>•</span>
                  <span>{b.published_at ? new Date(b.published_at).toLocaleDateString() : "Recent"}</span>
                </div>

                <h3 className="font-bold text-lg text-neutral-900 leading-snug mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                  {b.title}
                </h3>

                <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed mb-6 flex-1">
                  {b.summary || b.content.substring(0, 140)}...
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <span className="text-xs font-bold text-red-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read Article <span>→</span>
                  </span>
                  <span className="text-[11px] text-neutral-400">{b.view_count} views</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-neutral-200 py-20 text-center bg-neutral-50 max-w-xl mx-auto">
          <h2 className="text-xl font-bold text-neutral-900">No articles found</h2>
          <p className="mt-2 text-sm text-neutral-500">Try searching for other keywords or select another category.</p>
        </div>
      )}
    </StorePageShell>
  );
}

export default BlogPage;
