import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Users, Newspaper, Scale, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/contacts", icon: Users, label: "Contacts" },
  { to: "/news", icon: Newspaper, label: "News" },
  { to: "/laws", icon: Scale, label: "Laws" },
  { to: "/guide", icon: ShieldCheck, label: "Guide" },
] as const;

export default function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path === "/login" || path === "/register") return null;
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 px-4 pb-4 pt-2 pointer-events-none">
      <div className="glass-strong rounded-3xl px-3 py-2 flex justify-between items-center pointer-events-auto shadow-2xl">
        {items.map(({ to, icon: Icon, label }) => {
          const active = path === to;
          return (
            <Link
              key={to}
              to={to}
              className="relative flex-1 flex flex-col items-center gap-0.5 py-2 rounded-2xl"
            >
              {active && (
                <motion.span
                  layoutId="navactive"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: "linear-gradient(135deg, oklch(0.55 0.25 305 / 0.45), oklch(0.65 0.27 18 / 0.35))" }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                />
              )}
              <Icon className={`relative w-5 h-5 ${active ? "text-white" : "text-muted-foreground"}`} />
              <span className={`relative text-[10px] font-medium ${active ? "text-white" : "text-muted-foreground"}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
