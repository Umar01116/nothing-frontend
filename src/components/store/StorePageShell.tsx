import type { ReactNode } from "react";

interface StorePageShellProps {
  eyebrow?: string;
  title?: string;
  children: ReactNode;
}

export function StorePageShell({
  eyebrow,
  title,
  children,
}: StorePageShellProps) {
  return (
    <main className="w-full bg-white pb-16 pt-24 sm:pb-20 sm:pt-28">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {(eyebrow || title) && (
          <header className="mb-8">
            {eyebrow && (
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-red-600 sm:text-xs">
                {eyebrow}
              </p>
            )}

            {title && (
              <h1
                className="text-3xl font-bold tracking-[-0.04em] text-black sm:text-4xl lg:text-5xl"
                style={{
                  fontFamily:
                    "Instrument Sans, sans-serif",
                }}
              >
                {title}
              </h1>
            )}
          </header>
        )}

        {children}
      </div>
    </main>
  );
}