import { FormEvent, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { navigateTo } from "../../utils/store";

export function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      navigateTo("/account");
    } catch (err: any) {
      setError(err.message || "Failed to register account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1400px] overflow-hidden rounded-2xl bg-white shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
        {/* Register Form */}
        <div className="flex w-full items-center justify-center px-6 py-12 sm:px-10 lg:w-[52%] lg:px-16 xl:px-24">
          <div className="w-full max-w-[440px]">
            {/* Mobile Logo */}
            <div className="mb-12 lg:hidden">
              <div className="text-lg font-bold tracking-[0.3em] text-black">
                NOTHING
              </div>
            </div>

            <div className="mb-9">
              <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                New account
              </span>

              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-black sm:text-5xl">
                Create account.
              </h1>

              <p className="mt-4 text-sm leading-6 text-gray-500">
                Create your Nothing Pakistan account in a few simple steps.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="register-name"
                  className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-700"
                >
                  Full name
                </label>

                <input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 w-full rounded-lg border border-gray-200 bg-[#fafafa] px-4 text-sm text-black outline-none transition-all placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                />
              </div>

              <div>
                <label
                  htmlFor="register-email"
                  className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-700"
                >
                  Email
                </label>

                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 w-full rounded-lg border border-gray-200 bg-[#fafafa] px-4 text-sm text-black outline-none transition-all placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                />
              </div>

              <div>
                <label
                  htmlFor="register-password"
                  className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 w-full rounded-lg border border-gray-200 bg-[#fafafa] px-4 pr-16 text-sm text-black outline-none transition-all placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 transition hover:text-black"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="register-confirm-password"
                  className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-700"
                >
                  Confirm password
                </label>

                <input
                  id="register-confirm-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  required
                  minLength={6}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="h-14 w-full rounded-lg border border-gray-200 bg-[#fafafa] px-4 text-sm text-black outline-none transition-all placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group mt-2 flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-black text-sm font-semibold text-white transition-all hover:bg-[#222] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}

                {!loading && (
                  <span className="text-lg transition-transform group-hover:translate-x-1">
                    →
                  </span>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-black underline decoration-gray-300 underline-offset-4 transition hover:decoration-black"
              >
                Sign in
              </a>
            </p>

            <p className="mt-8 text-center text-[10px] leading-5 tracking-wide text-gray-400">
              By creating an account, you agree to our terms and privacy
              policy.
            </p>
          </div>
        </div>

        {/* Right Brand Panel */}
        <div className="relative hidden w-[48%] overflow-hidden bg-[#0a0a0a] lg:flex">
          <div className="absolute inset-0">
            <div className="absolute right-[15%] top-[15%] h-52 w-52 rounded-full border border-white/10" />
            <div className="absolute right-[20%] top-[20%] h-36 w-36 rounded-full border border-white/10" />
            <div className="absolute bottom-[12%] left-[10%] h-72 w-72 rounded-full border border-white/5" />
          </div>

          <div className="relative flex h-full w-full flex-col justify-between p-12 xl:p-16">
            <div className="text-sm font-semibold tracking-[0.35em] text-white">
              NOTHING
            </div>

            <div>
              <p className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-white/40">
                Start something different
              </p>

              <h2 className="max-w-lg text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white xl:text-6xl">
                Your
                <br />
                Nothing
                <br />
                journey.
              </h2>

              <p className="mt-8 max-w-md text-sm leading-6 text-white/50">
                One account for your orders, products, wishlist and everything
                you need from Nothing Pakistan.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-white/30">
              <span className="h-px w-8 bg-white/20" />
              NOTHING PAKISTAN
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}