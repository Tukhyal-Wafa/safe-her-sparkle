import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Shield, Sparkles, Clock, LogOut } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import SOSButton from "@/components/SOSButton";
import QuickActions from "@/components/QuickActions";
import VoiceTrigger from "@/components/VoiceTrigger";
import { getContacts, getHistory } from "@/lib/safeher";
import { currentUser, logout } from "@/lib/auth";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SafeHer — Futuristic Women Safety App" },
      { name: "description", content: "SafeHer: SOS, voice trigger, live location sharing, and emergency tools designed for women's safety." },
      { property: "og:title", content: "SafeHer — Futuristic Women Safety App" },
      { property: "og:description", content: "Premium PWA with SOS, voice activation, fake call, and emergency contacts." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ contacts: 0, events: 0 });
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  useEffect(() => {
    const u = currentUser();
    if (!u) { navigate({ to: "/login" }); return; }
    setUser(u);
    setStats({ contacts: getContacts().length, events: getHistory().length });
  }, [navigate]);
  const score = Math.min(100, 40 + stats.contacts * 15);

  const onLogout = () => { logout(); navigate({ to: "/login" }); };

  return (
    <div className="app-shell px-5 pt-8">
      <header className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {user ? `Hi, ${user.name.split(" ")[0]}` : "Welcome"}
          </p>
          <h1 className="text-3xl font-display font-bold gradient-text">SafeHer</h1>
        </div>
        <div className="flex items-center gap-2">
          <VoiceTrigger onTrigger={() => document.querySelector<HTMLButtonElement>("[aria-label^='Activate SOS']")?.click()} />
          <button onClick={onLogout} aria-label="Sign out"
            className="w-10 h-10 rounded-2xl glass-strong flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-5 mb-6 relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-40" style={{ background: "radial-gradient(circle, oklch(0.7 0.22 305), transparent 70%)" }} />
        <div className="flex items-start justify-between relative">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Safety Score</p>
            <p className="text-4xl font-display font-bold mt-1">{score}<span className="text-base text-muted-foreground">/100</span></p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.contacts === 0 ? "Add contacts to boost score" : `${stats.contacts} trusted contact${stats.contacts > 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center glass-strong">
            <Shield className="w-7 h-7 text-[oklch(0.78_0.13_350)]" />
          </div>
        </div>
        <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full rounded-full" style={{ background: "linear-gradient(90deg, oklch(0.65 0.27 18), oklch(0.78 0.13 350), oklch(0.7 0.22 305))" }} />
        </div>
      </motion.section>

      <SOSButton />

      <div className="flex items-center gap-2 mt-2 mb-4 text-xs text-muted-foreground justify-center">
        <Sparkles className="w-3.5 h-3.5" /> Double-tap SOS or say "help" three times
      </div>

      <h2 className="text-lg font-display font-semibold mb-3 mt-4">Quick Actions</h2>
      <QuickActions />

      <Link to="/history" className="glass rounded-2xl p-4 flex items-center justify-between mt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glass-strong flex items-center justify-center">
            <Clock className="w-5 h-5 text-[oklch(0.78_0.13_350)]" />
          </div>
          <div>
            <p className="font-semibold">Emergency History</p>
            <p className="text-xs text-muted-foreground">{stats.events} past event{stats.events !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">View →</span>
      </Link>
    </div>
  );
}
