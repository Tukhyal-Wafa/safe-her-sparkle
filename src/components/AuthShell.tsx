import { motion } from "framer-motion";
import { Shield, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="app-shell px-5 pt-10 pb-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center glass-strong">
            <Shield className="w-5 h-5 text-[oklch(0.55_0.22_320)]" />
          </div>
          <span className="font-display font-bold text-lg gradient-text">SafeHer</span>
        </Link>
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Secure
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-3xl p-6 relative overflow-hidden"
      >
        <motion.div
          aria-hidden
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-50"
          style={{ background: "radial-gradient(circle, oklch(0.78 0.15 320 / 0.6), transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], rotate: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, oklch(0.82 0.12 355 / 0.6), transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-2xl font-display font-bold text-foreground"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="text-sm text-muted-foreground mt-1"
          >
            {subtitle}
          </motion.p>

          <div className="mt-6">{children}</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-muted-foreground mt-6"
      >
        {footer}
      </motion.div>
    </div>
  );
}