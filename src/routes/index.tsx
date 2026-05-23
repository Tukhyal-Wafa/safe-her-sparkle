import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Shield, Sparkles, Clock, LogOut, MapPin, Navigation } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import SOSButton from "@/components/SOSButton";
import QuickActions from "@/components/QuickActions";
import VoiceTrigger from "@/components/VoiceTrigger";
import { getContacts, getHistory, getLocation } from "@/lib/safeher";
import { currentUser, logout } from "@/lib/auth";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SafeGuard — Professional Women Safety Platform" },
      { name: "description", content: "SafeGuard: Advanced SOS system, real-time location tracking, voice activation, and comprehensive emergency tools for women's safety." },
      { property: "og:title", content: "SafeGuard — Professional Women Safety Platform" },
      { property: "og:description", content: "Enterprise-grade PWA with SOS, live location tracking, voice activation, and emergency response system." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ contacts: 0, events: 0 });
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const u = currentUser();
    if (!u) { navigate({ to: "/login" }); return; }
    setUser(u);
    setStats({ contacts: getContacts().length, events: getHistory().length });
    
    // Get current location
    getLocation().then((loc) => {
      if (loc) {
        setLocation(loc);
        setLocationStatus("success");
      } else {
        setLocationStatus("error");
      }
    });
  }, [navigate]);

  const score = Math.min(100, 40 + stats.contacts * 15);

  const onLogout = () => { logout(); navigate({ to: "/login" }); };

  return (
    <div className="app-shell px-5 pt-8 page-transition">
      <header className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-1">
            {user ? `Hi, ${user.name.split(" ")[0]} 👋` : "Welcome"}
          </p>
          <h1 className="text-4xl font-display font-bold text-gradient">SafeGuard</h1>
          <p className="text-sm text-muted-foreground mt-1">Your personal safety companion</p>
        </div>
        <div className="flex items-center gap-3">
          <VoiceTrigger onTrigger={() => document.querySelector<HTMLButtonElement>("[aria-label^='Activate SOS']")?.click()} />
          <button onClick={onLogout} aria-label="Sign out"
            className="w-11 h-11 rounded-xl glass-strong flex items-center justify-center text-muted-foreground hover:text-foreground transition-all card-hover">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Location Status Card */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass-enhanced rounded-2xl p-5 mb-4 relative overflow-hidden card-hover"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10" 
          style={{ background: "radial-gradient(circle, oklch(0.45 0.15 150), transparent 70%)" }} />
        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center glass-strong">
              {locationStatus === "loading" ? (
                <Navigation className="w-7 h-7 text-[oklch(0.45_0.15_150)] animate-pulse" />
              ) : locationStatus === "success" ? (
                <MapPin className="w-7 h-7 text-[oklch(0.45_0.15_150)]" />
              ) : (
                <MapPin className="w-7 h-7 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold">Location Status</p>
                {locationStatus === "success" && <span className="status-badge"><span className="pulse-dot"></span>Active</span>}
              </div>
              <p className="text-xs text-muted-foreground">
                {locationStatus === "loading" ? "Acquiring location..." : 
                 locationStatus === "success" ? `${location?.lat.toFixed(4)}, ${location?.lng.toFixed(4)}` : 
                 "Location unavailable"}
              </p>
            </div>
          </div>
          {location && (
            <a 
              href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
              target="_blank"
              rel="noreferrer"
              className="button-primary text-xs px-4 py-2"
            >
              View Map →
            </a>
          )}
        </div>
      </motion.section>

      {/* Safety Score Card */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-enhanced rounded-2xl p-6 mb-6 relative overflow-hidden floating-card"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10" 
          style={{ background: "radial-gradient(circle, oklch(0.45 0.15 150), transparent 70%)" }} />
        <div className="flex items-start justify-between relative">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Safety Score</p>
            <div className="flex items-baseline gap-2 mb-2">
              <p className="text-5xl font-display font-bold text-gradient">
                {score}
              </p>
              <span className="text-lg text-muted-foreground">/100</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.contacts === 0 ? "Add contacts to boost your score" : `${stats.contacts} trusted contact${stats.contacts > 1 ? "s" : ""} added`}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center glass-strong shimmer">
            <Shield className="w-8 h-8 text-[oklch(0.45_0.15_150)]" />
          </div>
        </div>
        <div className="mt-5 h-3 rounded-full bg-muted overflow-hidden">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${score}%` }} 
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-[oklch(0.45_0.15_150)] to-[oklch(0.55_0.18_155)]" 
          />
        </div>
      </motion.section>

      <SOSButton />

      <div className="flex items-center gap-2 mt-2 mb-4 text-xs text-muted-foreground justify-center">
        <Sparkles className="w-3.5 h-3.5" /> Double-tap SOS or use Voice Guard (customizable keyword)
      </div>

      <h2 className="text-lg font-display font-semibold mb-3 mt-4">Quick Actions</h2>
      <QuickActions />

      <Link to="/history" className="glass-enhanced rounded-2xl p-5 flex items-center justify-between mt-6 card-hover glow-effect">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl glass-strong flex items-center justify-center">
            <Clock className="w-6 h-6 text-[oklch(0.45_0.15_150)]" />
          </div>
          <div>
            <p className="font-semibold text-base">Emergency History</p>
            <p className="text-sm text-muted-foreground">{stats.events} past event{stats.events !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <span className="text-sm text-[oklch(0.45_0.15_150)] font-medium">View →</span>
      </Link>
    </div>
  );
}
