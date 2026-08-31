import { StorePageShell } from "../../components/store/StorePageShell";

interface InfoPageProps {
  title: string;
  eyebrow: string;
  text: string;
}

const sections = [
  "Built for clarity",
  "Customer-first experience",
  "Ready for a real backend",
];

export function InfoPage({
  title,
  eyebrow,
  text,
}: InfoPageProps) {
  return (
    <StorePageShell
      eyebrow={eyebrow}
      title={title}
    >
      <div className="max-w-4xl">
        <p className="text-base leading-8 text-gray-600 sm:text-lg">
          {text}
        </p>

        <div className="mt-8 space-y-4">
          {sections.map(
            (section, index) => (
              <div
                key={section}
                className="rounded-2xl border border-[#E5E5E2] p-5 sm:p-6"
              >
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                    {index + 1}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">
                      {section}
                    </h2>

                    <p className="mt-2 text-sm leading-7 text-gray-600">
                      This page is frontend-only
                      for now. Live content,
                      policies and account data
                      can be supplied by the
                      backend later.
                    </p>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </StorePageShell>
  );
}