import { useState } from "react";
import { NothingPixelMark } from "../components/common/ProductVisuals";

export function Comparison() {
  const [selected, setSelected] = useState<string[]>(["Nothing Phone (2)", "Nothing Phone (2a)"]);

  const specs = [
    { feature: "Fast Charging", "Nothing Phone (2)": "45W", "Nothing Phone (2a)": "45W", "CMF Phone 1": "33W", "Nothing Phone (3a)": "65W" },
    { feature: "Case Compatibility", "Nothing Phone (2)": "✓ 120+ Cases", "Nothing Phone (2a)": "✓ 95+ Cases", "CMF Phone 1": "✓ 60+ Cases", "Nothing Phone (3a)": "✓ 80+ Cases" },
    { feature: "Wireless Charging", "Nothing Phone (2)": "15W", "Nothing Phone (2a)": "✗ N/A", "CMF Phone 1": "✗ N/A", "Nothing Phone (3a)": "✗ N/A" },
    { feature: "Cable Type", "Nothing Phone (2)": "USB-C", "Nothing Phone (2a)": "USB-C", "CMF Phone 1": "USB-C", "Nothing Phone (3a)": "USB-C" },
    { feature: "Earbuds Compat.", "Nothing Phone (2)": "Ear 1, 2, 2a", "Nothing Phone (2a)": "Ear 1, 2, 2a", "CMF Phone 1": "CMF Buds Pro", "Nothing Phone (3a)": "Ear 1, 2, 2a" },
    { feature: "Screen Protector", "Nothing Phone (2)": "6.7\" LTPO", "Nothing Phone (2a)": "6.7\" AMOLED", "CMF Phone 1": "6.67\" IPS", "Nothing Phone (3a)": "6.77\" AMOLED" },
  ];

  const allModels = ["Nothing Phone (2)", "Nothing Phone (2a)", "CMF Phone 1", "Nothing Phone (3a)"];

  return (
    <section id="compare" className="py-24" style={{ background: "#FFFFFF" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 reveal">
          <div className="flex items-center justify-center gap-2 mb-3">
            <NothingPixelMark size={14} color="#E53528" />
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: "#E53528", fontFamily: "Instrument Sans, sans-serif" }}
            >
              Side by Side
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
          >
            Compare Devices
          </h2>
          <p className="mt-3 text-base" style={{ color: "#6B6B6B" }}>
            Find the right accessories by comparing accessory compatibility across devices.
          </p>
        </div>

        {/* Model toggles */}
        <div className="flex flex-wrap gap-2 justify-center mb-8 reveal">
          {allModels.map((m) => (
            <button
              key={m}
              onClick={() => {
                setSelected((prev) =>
                  prev.includes(m)
                    ? prev.filter((x) => x !== m)
                    : prev.length < 3
                    ? [...prev, m]
                    : prev
                );
              }}
              className="px-4 py-2 text-sm font-medium transition-all duration-300"
              style={{
                borderRadius: "100px",
                fontFamily: "Instrument Sans, sans-serif",
                background: selected.includes(m) ? "#0A0A0A" : "transparent",
                color: selected.includes(m) ? "white" : "#0A0A0A",
                border: `1px solid ${selected.includes(m) ? "#0A0A0A" : "#E2E2E0"}`,
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Comparison table */}
        <div className="reveal overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: "0" }}>
            <thead>
              <tr>
                <th
                  className="text-left py-4 px-4 text-sm font-semibold"
                  style={{
                    fontFamily: "Instrument Sans, sans-serif",
                    color: "#6B6B6B",
                    background: "#F7F7F5",
                    borderRadius: "12px 0 0 0",
                    width: "180px",
                  }}
                >
                  Feature
                </th>
                {selected.map((m, i) => (
                  <th
                    key={m}
                    className="text-center py-4 px-4 text-sm font-bold"
                    style={{
                      fontFamily: "Instrument Sans, sans-serif",
                      color: "#0A0A0A",
                      background: i === 0 ? "#FFF0EE" : "#F7F7F5",
                      borderRadius: i === selected.length - 1 ? "0 12px 0 0" : "0",
                    }}
                  >
                    {m}
                    {i === 0 && (
                      <span
                        className="block text-xs font-normal mt-0.5"
                        style={{ color: "#E53528" }}
                      >
                        Primary
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map((row, rowIdx) => (
                <tr key={row.feature} style={{ borderTop: "1px solid #F0F0EE" }}>
                  <td
                    className="py-3.5 px-4 text-sm"
                    style={{
                      fontFamily: "Instrument Sans, sans-serif",
                      color: "#3A3A3A",
                      background: "#F7F7F5",
                    }}
                  >
                    {row.feature}
                  </td>
                  {selected.map((m, i) => (
                    <td
                      key={m}
                      className="py-3.5 px-4 text-sm text-center"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        color: (row as Record<string, string>)[m]?.includes("✗") ? "#AEAEAE" : "#0A0A0A",
                        background: i === 0 ? "#FFF8F7" : "white",
                      }}
                    >
                      {(row as Record<string, string>)[m] || "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ─── Brand Story ──────────────────────────────────────────────────────────────
