import { Bot, CheckCircle2, LoaderCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../auth/AuthContext.jsx";
import { Button, Card, Input, useToast } from "../components/ui/index.js";

const benefits = [
  {
    icon: Bot,
    title: "AI-powered prospecting",
    description: "Discover and qualify leads automatically.",
  },
  {
    icon: CheckCircle2,
    title: "Complete lead tracking",
    description: "Keep every conversation and status organized.",
  },
  {
    icon: ShieldCheck,
    title: "Secure workspaces",
    description: "Organization data stays isolated and protected.",
  },
];

function getAuthErrorMessage(error) {
  const message = error?.message ?? "";

  if (/invalid login credentials/i.test(message)) {
    return "The email or password you entered is incorrect.";
  }

  if (/email not confirmed/i.test(message)) {
    return "Please confirm your email before signing in.";
  }

  if (/user already registered/i.test(message)) {
    return "An account already exists for this email.";
  }

  return message || "Authentication failed. Please try again.";
}

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState("signIn");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignUp = mode === "signUp";

  function changeMode(nextMode) {
    setMode(nextMode);
    setPassword("");
    setErrorMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const data = await signUp({
          email,
          password,
          fullName,
        });

        if (!data.session) {
          showToast({
            title: "Check your inbox",
            description: `We sent a confirmation link to ${email.trim()}.`,
            variant: "success",
            duration: 7000,
          });

          setMode("signIn");
          setPassword("");
          return;
        }

        showToast({
          title: "Account created",
          description: "Welcome to Digitora LeadAI.",
          variant: "success",
        });

        return;
      }

      await signIn({
        email,
        password,
      });

      showToast({
        title: "Welcome back",
        description: "You are now signed in.",
        variant: "success",
      });
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 lg:grid lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 p-12 text-white lg:flex lg:flex-col">
        <div className="absolute -left-24 top-32 size-72 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="absolute -right-24 bottom-16 size-80 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-brand-600 text-lg font-bold shadow-lg shadow-brand-950/40">
            D
          </div>

          <div>
            <p className="font-semibold">Digitora LeadAI</p>
            <p className="text-xs text-slate-400">Digitora Solutions</p>
          </div>
        </div>

        <div className="relative my-auto max-w-xl py-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-400/10 px-3 py-1.5 text-sm text-brand-200">
            <Sparkles className="size-4" aria-hidden="true" />
            AI-powered lead automation
          </div>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Turn new prospects into organized opportunities.
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">
            Find leads, start conversations, and follow every opportunity from one secure workspace.
          </p>

          <div className="mt-10 space-y-5">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div key={benefit.title} className="flex gap-4">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10">
                    <Icon className="size-5 text-brand-300" aria-hidden="true" />
                  </div>

                  <div>
                    <p className="font-medium">{benefit.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="relative text-sm text-slate-500">
          Built for focused, responsible lead generation.
        </p>
      </section>

      <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="grid size-10 place-items-center rounded-xl bg-brand-600 font-bold text-white">
              D
            </div>

            <div>
              <p className="font-semibold text-ink">Digitora LeadAI</p>
              <p className="text-xs text-muted">Digitora Solutions</p>
            </div>
          </div>

          <Card className="p-6 sm:p-8">
            <header>
              <h2 className="text-2xl font-semibold tracking-tight text-ink">
                {isSignUp ? "Create your account" : "Welcome back"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted">
                {isSignUp
                  ? "Set up your account to start building your lead pipeline."
                  : "Sign in to continue to your lead automation workspace."}
              </p>
            </header>

            <div className="mt-6 flex rounded-xl bg-slate-100 p-1" aria-label="Authentication mode">
              <button
                type="button"
                aria-pressed={!isSignUp}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  !isSignUp ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
                }`}
                onClick={() => changeMode("signIn")}
              >
                Sign in
              </button>

              <button
                type="button"
                aria-pressed={isSignUp}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isSignUp ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
                }`}
                onClick={() => changeMode("signUp")}
              >
                Create account
              </button>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              {isSignUp ? (
                <Input
                  label="Full name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  minLength={2}
                  maxLength={120}
                  required
                  disabled={isSubmitting}
                  onChange={(event) => setFullName(event.target.value)}
                />
              ) : null}

              <Input
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                required
                disabled={isSubmitting}
                onChange={(event) => setEmail(event.target.value)}
              />

              <Input
                label="Password"
                name="password"
                type="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                hint={isSignUp ? "Use at least 8 characters." : undefined}
                value={password}
                minLength={8}
                required
                disabled={isSubmitting}
                onChange={(event) => setPassword(event.target.value)}
              />

              {errorMessage ? (
                <div
                  role="alert"
                  className="rounded-xl border border-danger/20 bg-red-50 px-4 py-3 text-sm text-danger"
                >
                  {errorMessage}
                </div>
              ) : null}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                    Please wait
                  </>
                ) : isSignUp ? (
                  "Create account"
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Card>

          <p className="mt-6 text-center text-xs leading-5 text-muted">
            By continuing, you agree to use lead outreach responsibly and follow applicable privacy
            and messaging rules.
          </p>
        </div>
      </main>
    </div>
  );
}
