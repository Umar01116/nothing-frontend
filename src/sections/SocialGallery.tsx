import { NothingPixelMark } from "../components/common/ProductVisuals";

export function SocialGallery() {
  const photos = [
    { id: "1564466962449-4f3d1e3c4f3d", w: 400, h: 400, label: "Phone (2) Case" },
    { id: "1581591524425-af5b7ad1b3d2", w: 400, h: 400, label: "CMF Audio" },
    { id: "1512054502232-10a0a035d672", w: 400, h: 600, label: "Accessories" },
    { id: "1526170375885-4d8ecf77b99f", w: 400, h: 400, label: "Charger" },
    { id: "1574944985070-8f3ebacd135f", w: 400, h: 400, label: "Flat Lay" },
    { id: "1491553895911-0055eca6402d", w: 400, h: 600, label: "Power" },
  ];

  return (
    <section className="py-24" style={{ background: "#FFFFFF" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 reveal">
          <div className="flex items-center justify-center gap-2 mb-3">
            <NothingPixelMark size={14} color="#E53528" />
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: "#E53528", fontFamily: "Instrument Sans, sans-serif" }}
            >
              @nothingaccessoriess.pk
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
          >
            Community Showcase
          </h2>
        </div>

        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {photos.map((photo, i) => (
            <div
              key={i}
              className="reveal group relative overflow-hidden rounded-2xl break-inside-avoid cursor-pointer"
              style={{ background: "#F0F0EE" }}
            >
              <img
                src={`https://images.unsplash.com/photo-${photo.id}?w=${photo.w}&h=${photo.h}&fit=crop&auto=format`}
                alt={photo.label}
                loading="lazy"
                decoding="async"
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ display: "block" }}
              />
              <div
                className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }}
              >
                <span className="text-white text-sm font-semibold" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
                  {photo.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://instagram.com/nothing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 hover:opacity-80 cursor-pointer"
            style={{ border: "1px solid #0A0A0A", borderRadius: "8px", fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
          >
            Follow on Instagram
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

