import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2, CheckCircle, Lock } from "lucide-react";
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
      // First, generate the reset token locally
      const res = await requestPasswordReset(email);
      
      if (!res.ok) {
        setError(res.error ?? "Failed to process reset request");
        setLoading(false);
        return;
      }

      if (res.token) {
        // Send email via API
        const resetLink = `${window.location.origin}/reset-password?token=${res.token}`;
        
        try {
          const emailResponse = await fetch('/api/send-reset-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              token: res.token,
              resetLink: resetLink
            })
          });

          const emailData = await emailResponse.json();

          if (!emailResponse.ok) {
            console.error('Email sending failed:', emailData);
            // Still show success for security (don't reveal if email exists)
            // But also provide the link as fallback
            setResetToken(res.token);
            setSuccess(true);
            setLoading(false);
            toast.warning("Email service unavailable. Use the reset link below.", { duration: 8000 });
            return;
          }

          // Email sent successfully
          console.log('✅ Password reset email sent to:', email);
          setSuccess(true);
          setResetToken(res.token); // Still provide fallback link
          setLoading(false);
          toast.success("Password reset email sent! Check your inbox.");
          
        } catch (emailError) {
          console.error('Email API error:', emailError);
          // Fallback: show reset link in UI
          setResetToken(res.token);
          setSuccess(true);
          setLoading(false);
          toast.warning("Email service unavailable. Use the reset link below.", { duration: 8000 });
        }
      } else {
        // User doesn't exist (security - don't reveal)
        setSuccess(true);
        setLoading(false);
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
        title={resetToken ? "Check Your Email" : "Request Sent"}
        subtitle={resetToken ? "We've sent a password reset link to your email" : "If the account exists, you'll receive an email"}
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
            Password reset email sent to <strong>{email}</strong>
          </p>

          <div className="glass rounded-2xl p-4 mb-4 text-left">
            <p className="text-xs font-semibold mb-2">📧 Check your email inbox</p>
            <ul className="text-xs text-muted-foreground space-y-1 ml-4">
              <li>• Look for an email from SafeGuard</li>
              <li>• Click the "Reset My Password" button</li>
              <li>• Link expires in 1 hour</li>
              <li>• Check spam folder if not found</li>
            </ul>
          </div>

          {resetToken && (
            <div className="glass rounded-xl p-3 mb-4">
              <p className="text-xs text-muted-foreground mb-2">
                <strong>Backup:</strong> If email doesn't arrive, use this link:
              </p>
              <Link
                to={`/reset-password?token=${resetToken}`}
                className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold text-xs text-white"
                style={{ background: "linear-gradient(135deg, oklch(0.45 0.15 150), oklch(0.55 0.18 155))" }}
              >
                <Lock className="w-3 h-3" />
                Use Backup Link
              </Link>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Didn't receive the email?{" "}
            <button
              onClick={() => {
                setSuccess(false);
                setResetToken("");
              }}
              className="text-[oklch(0.45_0.15_150)] font-semibold hover:underline"
            >
              Try again
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
