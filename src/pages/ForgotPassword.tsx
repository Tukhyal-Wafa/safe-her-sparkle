import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import AuthShell from "@/components/AuthShell";
import AuthField from "@/components/AuthField";
import { requestPasswordReset } from "@/lib/auth";
import { toast } from "sonner";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await requestPasswordReset(email);
      setLoading(false);
      
      if (!res.ok) {
        setError(res.error ?? "Failed to generate reset link");
        return;
      }

      if (res.token) {
        setResetToken(res.token);
        setSuccess(true);
        
        // Still log to console for debugging
        const resetLink = `${window.location.origin}/reset-password?token=${res.token}`;
        console.log("🔑 Password Reset Link:", resetLink);
      } else {
        // No token means user doesn't exist (security)
        setSuccess(true);
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
        title="Password Reset Link"
        subtitle="Use the link below to reset your password"
        footer={<Link to="/login" className="text-[oklch(0.45_0.15_150)] font-semibold hover:underline">Back to sign in</Link>}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-[oklch(0.45_0.15_150)]/10 flex items-center justify-center"
          >
            <CheckCircle className="w-10 h-10 text-[oklch(0.45_0.15_150)]" />
          </motion.div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Account found for <strong>{email}</strong>
          </p>

          <div className="glass rounded-2xl p-4 mb-4 text-left">
            <p className="text-xs text-muted-foreground mb-2">Click the button below to reset your password:</p>
            <Link
              to={`/reset-password?token=${resetToken}`}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-white"
              style={{ background: "linear-gradient(135deg, oklch(0.45 0.15 150), oklch(0.55 0.18 155))" }}
            >
              <Lock className="w-4 h-4" />
              Reset My Password
            </Link>
          </div>

          <div className="glass rounded-xl p-3 mb-4">
            <p className="text-xs text-muted-foreground mb-2">Or copy this link:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/reset-password?token=${resetToken}`}
                className="flex-1 text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/reset-password?token=${resetToken}`);
                  toast.success("Link copied to clipboard!");
                }}
                className="px-3 py-2 rounded-lg glass-strong text-xs font-semibold hover:bg-white/10"
              >
                Copy
              </button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            This link expires in 1 hour. Need a new link?{" "}
            <button
              onClick={() => {
                setSuccess(false);
                setResetToken("");
              }}
              className="text-[oklch(0.45_0.15_150)] font-semibold hover:underline"
            >
              Generate new link
            </button>
          </p>

          <div className="mt-4 p-3 bg-[oklch(0.98_0.02_140)] rounded-xl border border-[oklch(0.45_0.15_150)]/20">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> In a production app with email service, this link would be sent to your email. 
              For now, use the link above or check the browser console.
            </p>
          </div>
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
