import { useState } from "react";
import { NothingPixelMark } from "../components/common/ProductVisuals";

export function BuyingGuide() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<number, string>>({});

  const steps = [
    {
      q: "Which device do you own?",
      options: ["Nothing Phone (1)", "Nothing Phone (2)", "Nothing Phone (2a)", "Nothing Phone (3a)", "CMF Phone 1", "CMF Phone 2"],
    },
    {
      q: "What type of accessory are you looking for?",
      options: ["Case / Cover", "Charger", "Cable", "Earbuds", "Power Bank", "Screen Protector"],
    },
    {
      q: "What is your budget?",
      options: ["Under ₨1,500", "₨1,500 – ₨3,000", "₨3,000 – ₨7,000", "₨7,000+"],
    },
  ];

  const handleSelect = (option: string) => {
    setSelections({ ...selections, [step]: option });
    if (step < steps.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    }
  };

  const reset = () => { setStep(0); setSelections({}); };
  const isDone = step === steps.length - 1 && selections[step];

  return (
    <section id="buying-guide" className="py-24" style={{ background: "#F7F7F5" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 reveal">
          <div className="flex items-center justify-center gap-2 mb-3">
            <NothingPixelMark size={14} color="#E53528" />
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: "#E53528", fontFamily: "Instrument Sans, sans-serif" }}
            >
              Expert Guidance
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
          >
            Accessory Finder
          </h2>
          <p className="mt-3 text-base" style={{ color: "#6B6B6B" }}>
            Answer 3 quick questions and we&apos;ll show you the perfect accessories.
          </p>
        </div>

        <div
          className="reveal p-8 rounded-2xl"
          style={{ background: "white", border: "1px solid #E2E2E0" }}
        >
          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {steps.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-1 rounded-full transition-all duration-500"
                style={{
                  background: i <= step ? "#E53528" : "#E2E2E0",
                }}
              />
            ))}
          </div>

          {!isDone ? (
            <>
              <h3
                className="text-xl font-bold mb-6"
                style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
              >
                Step {step + 1} of {steps.length}: {steps[step].q}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {steps[step].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    className="py-3 px-4 text-sm font-medium rounded-xl text-left transition-all duration-300 hover:border-red-300"
                    style={{
                      border: `1px solid ${selections[step] === opt ? "#E53528" : "#E2E2E0"}`,
                      background: selections[step] === opt ? "#FFF0EE" : "#F7F7F5",
                      color: "#0A0A0A",
                      fontFamily: "Instrument Sans, sans-serif",
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#FFF0EE" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E53528" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
              >
                Perfect Matches Found!
              </h3>
              <p className="text-sm mb-6" style={{ color: "#6B6B6B" }}>
                Based on your selections, we found the ideal accessories for you.
              </p>
              <div className="flex gap-3 justify-center">
                <a
                  href="/shop"
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({}, "", "/shop");
                    window.dispatchEvent(new PopStateEvent("popstate"));
                  }}
                  className="px-6 py-3 text-white font-semibold text-sm cursor-pointer"
                  style={{ background: "#E53528", borderRadius: "8px", fontFamily: "Instrument Sans, sans-serif" }}
                >
                  View Recommendations
                </a>
                <button
                  onClick={reset}
                  className="px-6 py-3 text-sm font-semibold"
                  style={{ border: "1px solid #E2E2E0", borderRadius: "8px", fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
                >
                  Start Over
                </button>
              </div>
            </div>
          )}

          {/* Summary */}
          {Object.keys(selections).length > 0 && !isDone && (
            <div className="mt-6 pt-6 flex flex-wrap gap-2" style={{ borderTop: "1px solid #F0F0EE" }}>
              {Object.entries(selections).map(([idx, val]) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{ background: "#FFF0EE", color: "#E53528", fontFamily: "Instrument Sans, sans-serif" }}
                >
                  {val}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

