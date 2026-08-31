import { useState } from "react";
import { LottieAnimation } from "../components/common/LottieAnimation";
import heroAnimation from "../assets/animations/nothing_accessories_hero.json";
import { NothingPixelMark } from "../components/common/ProductVisuals";
import { navigateTo } from "../utils/store";

export function Hero() {
  const [activeModel, setActiveModel] = useState(0);
  const models = ["Phone (2)", "Phone (2a)", "CMF Phone 1", "Phone (3a)"];

  return (
    <section
      className="relative min-h-[calc(100vh-72px)] flex items-center overflow-hidden"
      style={{ background: "#FFFFFF", marginTop: "72px" }}
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 dot-grid pointer-events-none"
        style={{ opacity: 0.35 }}
      />

      {/* Red ambient gradient orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-10%",
          right: "5%",
          width: "550px",
          height: "550px",
          background: "radial-gradient(circle, rgba(229,53,40,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 w-full flex items-center">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Content (Cols 1-7) - Instantly visible */}
          <div className="lg:col-span-7 flex flex-col justify-center opacity-100 z-10">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-3">
              <NothingPixelMark size={14} color="#E53528" />
              <span
                className="text-[11px] font-bold tracking-[0.2em] uppercase"
                style={{ color: "#E53528", fontFamily: "Instrument Sans, sans-serif" }}
              >
                Pakistan&apos;s Premium Nothing Store
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-bold leading-[1.0] mb-3.5 tracking-tight"
              style={{
                fontFamily: "Instrument Sans, sans-serif",
                fontSize: "clamp(38px, 5.2vw, 68px)",
                color: "#0A0A0A",
                letterSpacing: "-0.03em",
              }}
            >
              Gear Up{" "}
              <span style={{ color: "#E53528" }}>Nothing</span>{" "}
              Beats.
            </h1>

            {/* Subtitle */}
            <p
              className="text-xs sm:text-sm leading-relaxed mb-5 max-w-lg text-neutral-600"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Premium cases, ultra-fast GaN chargers, Hi-Res audio, and cables crafted
              specifically for Nothing & CMF devices in Pakistan.
            </p>

            {/* Model Selector Pills */}
            <div className="flex flex-wrap items-center gap-1.5 mb-5">
              <span className="text-[11px] font-bold text-neutral-400 mr-1 uppercase tracking-wider">Device:</span>
              {models.map((m, i) => (
                <button
                  key={m}
                  onClick={() => {
                    setActiveModel(i);
                    navigateTo(`/shop?category=${encodeURIComponent(m)}`);
                  }}
                  className="px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 cursor-pointer"
                  style={{
                    fontFamily: "Instrument Sans, sans-serif",
                    background: activeModel === i ? "#0A0A0A" : "#F4F4F2",
                    color: activeModel === i ? "#FFFFFF" : "#444444",
                    border: `1px solid ${activeModel === i ? "#0A0A0A" : "transparent"}`,
                  }}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigateTo("/shop")}
                className="group flex items-center gap-2 px-6 py-3 text-white font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300 hover:gap-3 cursor-pointer shadow-md hover:bg-neutral-900"
                style={{
                  background: "#E53528",
                  borderRadius: "12px",
                  fontFamily: "Instrument Sans, sans-serif",
                }}
              >
                Shop Collection
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => navigateTo("/buying-guide")}
                className="flex items-center gap-2 px-6 py-3 font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300 cursor-pointer border border-neutral-300 hover:border-black rounded-xl bg-white text-neutral-900"
                style={{
                  fontFamily: "Instrument Sans, sans-serif",
                }}
              >
                Accessory Finder
              </button>
            </div>

            {/* Key Trust Stats */}
            <div className="flex items-center gap-6 sm:gap-10 mt-6 pt-5 border-t border-neutral-200">
              {[
                { num: "500+", label: "Original Items" },
                { num: "15K+", label: "Happy Buyers" },
                { num: "4.9★", label: "Customer Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="text-lg sm:text-xl font-bold leading-tight"
                    style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
                  >
                    {stat.num}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-medium mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Centered Lottie Hero Animation (Cols 8-12) */}
          <div className="lg:col-span-5 relative flex items-center justify-center h-full min-h-[320px] lg:min-h-[460px]">
            {/* Background Decorative Rings */}
            <div
              className="absolute inset-0 m-auto rounded-full pointer-events-none"
              style={{
                width: "360px",
                height: "360px",
                border: "1px dashed #E2E2E0",
                borderRadius: "50%",
              }}
            />
            <div
              className="absolute inset-0 m-auto rounded-full pointer-events-none"
              style={{
                width: "440px",
                height: "440px",
                border: "1px solid rgba(229,53,40,0.06)",
                borderRadius: "50%",
              }}
            />

            {/* Perfectly Sized & Centered Animation */}
            <div className="relative z-10 w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[480px] flex items-center justify-center">
              <LottieAnimation
                animationData={heroAnimation}
                loop={true}
                autoplay={true}
                className="w-full h-auto max-h-[420px] object-contain"
                style={{
                  filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.06))",
                }}
              />
            </div>

            {/* Floating Info Badge 1 */}
            <div
              className="absolute -top-2 left-2 sm:-left-2 z-20 hidden sm:flex items-center gap-2 px-3.5 py-2 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-neutral-100 float"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <p className="text-[11px] font-bold text-neutral-900 leading-tight">100% Genuine</p>
                <p className="text-[9px] text-neutral-500 leading-tight">Official Warranty</p>
              </div>
            </div>

            {/* Floating Info Badge 2 */}
            <div
              className="absolute bottom-2 right-2 sm:-right-2 z-20 hidden sm:flex items-center gap-2 px-3.5 py-2 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-neutral-100 float-delay-2"
            >
              <span className="text-xs">⚡</span>
              <div>
                <p className="text-[11px] font-bold text-neutral-900 leading-tight">Fast Dispatch</p>
                <p className="text-[9px] text-neutral-500 leading-tight">Across Pakistan</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
