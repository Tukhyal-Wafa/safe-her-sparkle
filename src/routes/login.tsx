import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import AuthShell from "@/components/AuthShell";
import AuthField from "@/components/AuthField";
import { login } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — SafeGuard" },
      { name: "description", content: "Sign in to your SafeGuard account to access SOS, trusted contacts, and safety tools." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const res = await login(email, password);
      if (!res.ok) { 
        setError(res.error ?? "Login failed"); 
        setLoading(false);
        return; 
      }
      toast.success("Welcome back to SafeGuard");
      navigate({ to: "/" });
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue protecting yourself."
      footer={<>New here? <Link to="/register" className="text-[oklch(0.45_0.15_150)] font-semibold hover:underline">Create an account</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthField
          label="Email"
          type="email"
          required
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
          delay={0.25}
        />
        <AuthField
          label="Password"
          type="password"
          required
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          delay={0.32}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.36 }}
          className="flex justify-end"
        >
          <Link
            to="/forgot-password"
            className="text-xs text-[oklch(0.45_0.15_150)] font-semibold hover:underline"
          >
            Forgot password?
          </Link>
        </motion.div>

        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            className="text-xs text-[oklch(0.55_0.25_18)] bg-[oklch(0.95_0.06_18)] rounded-xl px-3 py-2">
            {error}
          </motion.p>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative w-full rounded-2xl py-3.5 text-sm font-semibold text-primary-foreground overflow-hidden disabled:opacity-70"
          style={{ background: "linear-gradient(120deg, oklch(0.45 0.15 150), oklch(0.55 0.18 155), oklch(0.50 0.16 152))", backgroundSize: "200% 200%" }}
        >
          <motion.span
            aria-hidden
            className="absolute inset-0"
            style={{ background: "linear-gradient(120deg, oklch(0.45 0.15 150), oklch(0.55 0.18 155), oklch(0.50 0.16 152))", backgroundSize: "200% 200%" }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <span className="relative flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign in <ArrowRight className="w-4 h-4" /></>}
          </span>
        </motion.button>
      </form>
    </AuthShell>
  );
}