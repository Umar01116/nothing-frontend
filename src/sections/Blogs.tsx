import { useEffect, useState } from "react";
import { blogsApi, Blog } from "../api/blogs";
import { NothingPixelMark } from "../components/common/ProductVisuals";
import { navigateTo } from "../utils/store";

export function Blogs() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogsApi
      .getBlogs({ per_page: 3 })
      .then((res: any) => {
        setPosts(res.data?.data || res.data || []);
      })
      .catch((err) => console.error("Homepage blogs error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="py-24" style={{ background: "#F7F7F5" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14">
          <div className="reveal">
            <div className="flex items-center gap-2 mb-3">
              <NothingPixelMark size={14} color="#E53528" />
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: "#E53528", fontFamily: "Instrument Sans, sans-serif" }}
              >
                Editorial
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight"
              style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
            >
              Blog & Guides
            </h2>
          </div>
          <button
            onClick={() => navigateTo("/blog")}
            className="mt-4 sm:mt-0 text-sm font-semibold underline-hover reveal cursor-pointer"
            style={{ color: "#0A0A0A", fontFamily: "Instrument Sans, sans-serif" }}
          >
            All Articles →
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-red-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigateTo(`/blog/${post.slug}`)}
                className="reveal group overflow-hidden rounded-2xl transition-all duration-400 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                style={{ background: "white" }}
              >
                <div className="overflow-hidden" style={{ height: "220px", background: "#F0F0EE" }}>
                  {post.featured_image ? (
                    <img
                      src={post.featured_image}
                      alt={post.featured_image_alt || post.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">📝</div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background: "#FFF0EE", color: "#E53528", fontFamily: "Instrument Sans, sans-serif" }}
                    >
                      {post.category}
                    </span>
                    <span className="text-xs" style={{ color: "#AEAEAE" }}>
                      {post.read_time || "5 min read"}
                    </span>
                  </div>
                  <h3
                    className="font-bold text-base leading-snug mb-2 line-clamp-2"
                    style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: "#6B6B6B" }}>
                    {post.summary || post.content.substring(0, 120)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "#AEAEAE" }}>
                      {post.published_at ? new Date(post.published_at).toLocaleDateString() : "Recent"}
                    </span>
                    <span
                      className="text-xs font-semibold flex items-center gap-1 transition-gap duration-300 group-hover:gap-2"
                      style={{ color: "#E53528", fontFamily: "Instrument Sans, sans-serif" }}
                    >
                      Read
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
