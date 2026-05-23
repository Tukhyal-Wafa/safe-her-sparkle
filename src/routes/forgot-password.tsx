import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import AuthShell from "@/components/AuthShell";
import AuthField from "@/components/AuthField";
import { requestPasswordReset } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — SafeGuard" },
      { name: "description", content: "Reset your SafeGuard account password." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await requestPasswordReset(email);
      setLoading(false);
      
      if (!res.ok) {
        setError(res.error ?? "Failed to send reset email");
        return;
      }

      setSuccess(true);
      toast.success("Password reset instructions sent to your email");
      
      // For development: show the reset link in console
      if (res.token) {
        const resetLink = `${window.location.origin}/reset-password?token=${res.token}`;
        console.log("🔑 Password Reset Link:", resetLink);
        toast.info("Check console for reset link (development mode)", { duration: 10000 });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthShell
        title="Check your email"
        subtitle="We've sent password reset instructions to your email address."
        footer={<Link to="/login" className="text-[oklch(0.45_0.15_150)] font-semibold hover:underline">Back to sign in</Link>}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-[oklch(0.45_0.15_150)]/10 flex items-center justify-center"
          >
            <CheckCircle className="w-10 h-10 text-[oklch(0.45_0.15_150)]" />
          </motion.div>
          <p className="text-muted-foreground mb-6">
            If an account exists with <strong>{email}</strong>, you will receive password reset instructions shortly.
          </p>
          <p className="text-sm text-muted-foreground">
            Didn't receive the email? Check your spam folder or{" "}
            <button
              onClick={() => setSuccess(false)}
              className="text-[oklch(0.45_0.15_150)] font-semibold hover:underline"
            >
              try again
            </button>
          </p>
        </motion.div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot password?"
      subtitle="Enter your email address and we'll send you instructions to reset your password."
      footer={
        <>
          Remember your password?{" "}
          <Link to="/login" className="text-[oklch(0.45_0.15_150)] font-semibold hover:underline">
            Sign in
          </Link>
        </>
      }
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

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-[oklch(0.55_0.25_18)] bg-[oklch(0.95_0.06_18)] rounded-xl px-3 py-2"
          >
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
          transition={{ delay: 0.35 }}
          className="relative w-full rounded-2xl py-3.5 text-sm font-semibold text-primary-foreground overflow-hidden disabled:opacity-70"
          style={{
            background: "linear-gradient(120deg, oklch(0.45 0.15 150), oklch(0.55 0.18 155), oklch(0.50 0.16 152))",
            backgroundSize: "200% 200%",
          }}
        >
          <motion.span
            aria-hidden
            className="absolute inset-0"
            style={{
              background: "linear-gradient(120deg, oklch(0.45 0.15 150), oklch(0.55 0.18 155), oklch(0.50 0.16 152))",
              backgroundSize: "200% 200%",
            }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <span className="relative flex items-center justify-center gap-2">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Send reset instructions <ArrowRight className="w-4 h-4" />
              </>
            )}
          </span>
        </motion.button>
      </form>
    </AuthShell>
  );
}
