import { FormEvent, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { navigateTo } from "../../utils/store";

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      // If user is admin, go to admin dashboard, else account
      navigateTo("/account");
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f2f2f2] p-3 sm:p-5 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1500px] overflow-hidden bg-white sm:min-h-[calc(100vh-2.5rem)] lg:grid-cols-2 lg:min-h-[calc(100vh-4rem)]">

        {/* FORM */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-[440px]">

            <div className="mb-14">
              <a
                href="/"
                className="inline-flex items-center gap-3 text-[13px] font-semibold tracking-[0.3em] text-black"
              >
                <span className="flex h-7 w-7 items-center justify-center border border-black text-[10px] tracking-normal">
                  N
                </span>
                NOTHING
              </a>
            </div>

            <div className="mb-9">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#999]">
                Nothing Pakistan
              </p>

              <h1 className="text-[42px] font-medium leading-none tracking-[-0.045em] text-[#111] sm:text-[48px]">
                Welcome back.
              </h1>

              <p className="mt-5 max-w-[360px] text-[14px] leading-6 text-[#777]">
                Sign in to access your orders, wishlist and Nothing Pakistan
                account.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-[12px] font-medium text-[#333]"
                >
                  Email address
                </label>

                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-[54px] w-full border border-[#d8d8d8] bg-white px-4 text-[14px] text-black outline-none transition placeholder:text-[#aaa] hover:border-[#aaa] focus:border-black"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="text-[12px] font-medium text-[#333]"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-[11px] text-[#888] hover:text-black"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-[54px] w-full border border-[#d8d8d8] bg-white px-4 pr-16 text-[14px] text-black outline-none transition placeholder:text-[#aaa] hover:border-[#aaa] focus:border-black"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] uppercase tracking-wide text-[#888] hover:text-black"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-black"
                />

                <span className="text-[12px] text-[#777]">
                  Keep me signed in
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="group flex h-[54px] w-full items-center justify-between bg-black px-5 text-[13px] font-medium text-white transition hover:bg-[#222] disabled:opacity-60"
              >
                <span>
                  {loading ? "Signing in..." : "Sign in"}
                </span>

                {!loading && (
                  <span className="text-lg transition-transform group-hover:translate-x-1">
                    →
                  </span>
                )}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#e5e5e5]" />
              <span className="text-[10px] text-[#aaa]">OR</span>
              <div className="h-px flex-1 bg-[#e5e5e5]" />
            </div>

            <button
              type="button"
              className="flex h-[54px] w-full items-center justify-center gap-3 border border-[#d8d8d8] bg-white text-[13px] font-medium text-black transition hover:border-black"
            >
              <span className="font-semibold">G</span>
              Continue with Google
            </button>

            <div className="mt-8 text-center">
              <span className="text-[12px] text-[#888]">
                New to Nothing Pakistan?
              </span>

              <a
                href="/register"
                className="ml-2 text-[12px] font-medium text-black underline underline-offset-4"
              >
                Create account
              </a>
            </div>
          </div>
        </section>

        {/* NOTHING ENGINEERING PANEL */}
        <section className="relative hidden overflow-hidden bg-[#111] lg:block">

          {/* Circular engineering grid */}
          <div className="absolute inset-0 opacity-30">
            <div
              className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20"
            />

            <div
              className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15"
            />

            <div
              className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
            />

            <div className="absolute left-1/2 top-0 h-full w-px bg-white/10" />
            <div className="absolute left-0 top-1/2 h-px w-full bg-white/10" />
          </div>

          {/* Technical lines */}
          <div className="absolute left-[12%] top-[18%] h-px w-[28%] bg-white/20" />
          <div className="absolute right-[12%] top-[68%] h-px w-[25%] bg-white/20" />

          <div className="absolute left-[12%] top-[18%] h-2 w-2 rounded-full bg-white" />
          <div className="absolute right-[12%] top-[68%] h-2 w-2 rounded-full bg-white" />

          {/* Product-like central object */}
          <div className="absolute left-1/2 top-1/2 h-[390px] w-[210px] -translate-x-1/2 -translate-y-1/2 rotate-[8deg] border border-white/25 bg-[#171717] shadow-[0_0_100px_rgba(255,255,255,0.05)]">

            <div className="absolute inset-[14px] border border-white/10" />

            {/* Camera circles */}
            <div className="absolute left-10 top-12 flex h-[88px] w-[88px] items-center justify-center rounded-full border border-white/20">
              <div className="h-[54px] w-[54px] rounded-full border border-white/30">
                <div className="ml-[15px] mt-[15px] h-5 w-5 rounded-full border border-white/40" />
              </div>
            </div>

            <div className="absolute right-7 top-14 h-3 w-3 rounded-full bg-white/60" />

            {/* Glyph-style lines */}
            <div className="absolute bottom-24 left-10 right-10 space-y-3">
              <div className="h-[2px] w-full bg-white/20" />
              <div className="h-[2px] w-[72%] bg-white/30" />
              <div className="h-[2px] w-[48%] bg-white/20" />
            </div>

            <div className="absolute bottom-10 left-10 text-[9px] tracking-[0.3em] text-white/30">
              ENGINEERED
            </div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-10 xl:p-14">

            <div className="flex items-start justify-between">
              <span className="text-[11px] font-medium tracking-[0.3em] text-white">
                NOTHING
              </span>

              <span className="text-[9px] tracking-[0.2em] text-white/30">
                PK / 01
              </span>
            </div>

            <div className="relative z-10">
              <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-white/40">
                Different by design
              </p>

              <h2 className="max-w-[500px] text-[52px] font-medium leading-[0.95] tracking-[-0.045em] text-white xl:text-[64px]">
                Technology
                <br />
                without
                <br />
                the noise.
              </h2>

              <p className="mt-7 max-w-[390px] text-[13px] leading-6 text-white/45">
                Nothing creates bold technology through transparent design,
                thoughtful engineering and a different way of looking at
                everyday products.
              </p>
            </div>

            <div className="flex items-end justify-between">
              <span className="text-[9px] tracking-[0.2em] text-white/30">
                NOTHING PAKISTAN
              </span>

              <span className="text-[9px] tracking-[0.2em] text-white/30">
                2026
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}