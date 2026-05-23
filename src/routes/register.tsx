import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import AuthShell from "@/components/AuthShell";
import AuthField from "@/components/AuthField";
import { register } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — SafeGuard" },
      { name: "description", content: "Create your SafeGuard account in seconds and unlock SOS, voice trigger, and emergency tools." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = Math.min(4, Math.floor(password.length / 3));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    
    try {
      const res = await register(name, email, password);
      if (!res.ok) { 
        setError(res.error ?? "Registration failed"); 
        setLoading(false);
        return; 
      }
      toast.success("Welcome to SafeGuard");
      navigate({ to: "/" });
    } catch (error) {
      console.error("Registration error:", error);
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join SafeGuard and stay protected, anywhere."
      footer={<>Already have an account? <Link to="/login" className="text-[oklch(0.45_0.15_150)] font-semibold hover:underline">Sign in</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthField label="Full name" type="text" required placeholder="Jane Doe" autoComplete="name"
          value={name} onChange={(e) => setName(e.target.value)} icon={<User className="w-4 h-4" />} delay={0.22} />
        <AuthField label="Email" type="email" required placeholder="you@example.com" autoComplete="email"
          value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="w-4 h-4" />} delay={0.28} />
        <AuthField label="Password" type="password" required placeholder="At least 6 characters" autoComplete="new-password"
          value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock className="w-4 h-4" />} delay={0.34} />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full bg-[oklch(0.92_0.02_320)] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: i < strength ? "100%" : "0%" }}
                transition={{ duration: 0.4 }}
                className="h-full rounded-full"
                style={{
                  background: strength <= 1 ? "oklch(0.7 0.2 30)"
                    : strength <= 2 ? "oklch(0.75 0.18 70)"
                    : strength <= 3 ? "oklch(0.55 0.18 150)"
                    : "oklch(0.45 0.15 150)",
                }}
              />
            </div>
          ))}
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
          transition={{ delay: 0.46 }}
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create account <ArrowRight className="w-4 h-4" /></>}
          </span>
        </motion.button>

        <p className="text-[11px] text-muted-foreground text-center pt-1">
          By continuing you agree to SafeGuard's terms and privacy policy.
        </p>
      </form>
    </AuthShell>
  );
}