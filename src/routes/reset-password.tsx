import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Lock, ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import AuthShell from "@/components/AuthShell";
import AuthField from "@/components/AuthField";
import { resetPassword, verifyResetToken } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — SafeGuard" },
      { name: "description", content: "Create a new password for your SafeGuard account." },
    ],
  }),
  component: ResetPasswordPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || "",
    };
  },
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = Route.useSearch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }

    // Verify token
    const verification = verifyResetToken(token);
    setTokenValid(verification.valid);
    if (verification.email) {
      setEmail(verification.email);
    }
  }, [token]);

  const strength = Math.min(4, Math.floor(password.length / 3));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword(token, password);
      setLoading(false);

      if (!res.ok) {
        setError(res.error ?? "Failed to reset password");
        return;
      }

      setSuccess(true);
      toast.success("Password reset successfully!");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate({ to: "/login" });
      }, 2000);
    } catch (error) {
      console.error("Password reset error:", error);
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  if (tokenValid === false) {
    return (
      <AuthShell
        title="Invalid reset link"
        subtitle="This password reset link is invalid or has expired."
        footer={
          <Link to="/forgot-password" className="text-[oklch(0.45_0.15_150)] font-semibold hover:underline">
            Request a new reset link
          </Link>
        }
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
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-[oklch(0.55_0.25_18)]/10 flex items-center justify-center"
          >
            <AlertCircle className="w-10 h-10 text-[oklch(0.55_0.25_18)]" />
          </motion.div>
          <p className="text-muted-foreground mb-6">
            The password reset link you used is either invalid or has expired. Reset links are valid for 1 hour.
          </p>
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 text-[oklch(0.45_0.15_150)] font-semibold hover:underline"
          >
            Request a new reset link <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </AuthShell>
    );
  }

  if (tokenValid === null) {
    return (
      <AuthShell title="Verifying..." subtitle="Please wait while we verify your reset link.">
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[oklch(0.45_0.15_150)]" />
        </div>
      </AuthShell>
    );
  }

  if (success) {
    return (
      <AuthShell
        title="Password reset!"
        subtitle="Your password has been successfully reset."
        footer={
          <Link to="/login" className="text-[oklch(0.45_0.15_150)] font-semibold hover:underline">
            Continue to sign in
          </Link>
        }
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
            You can now sign in with your new password.
          </p>
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </motion.div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create new password"
      subtitle={email ? `Reset password for ${email}` : "Enter your new password below."}
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
          label="New Password"
          type="password"
          required
          placeholder="At least 6 characters"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          delay={0.25}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-1.5"
        >
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full bg-[oklch(0.92_0.02_320)] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: i < strength ? "100%" : "0%" }}
                transition={{ duration: 0.4 }}
                className="h-full rounded-full"
                style={{
                  background:
                    strength <= 1
                      ? "oklch(0.7 0.2 30)"
                      : strength <= 2
                      ? "oklch(0.75 0.18 70)"
                      : strength <= 3
                      ? "oklch(0.55 0.18 150)"
                      : "oklch(0.45 0.15 150)",
                }}
              />
            </div>
          ))}
        </motion.div>

        <AuthField
          label="Confirm Password"
          type="password"
          required
          placeholder="Re-enter your password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          delay={0.35}
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
          transition={{ delay: 0.45 }}
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
                Reset password <ArrowRight className="w-4 h-4" />
              </>
            )}
          </span>
        </motion.button>
      </form>
    </AuthShell>
  );
}
