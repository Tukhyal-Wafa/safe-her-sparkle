import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldCheck, Footprints, Eye, Hand, MapPin, Users } from "lucide-react";

export const Route = createFileRoute("/guide")({
  head: () => ({ meta: [{ title: "Self Defense Guide — SafeHer" }, { name: "description", content: "Quick self defense tips and escape techniques for everyday safety." }] }),
  component: Guide,
});

const tips = [
  { icon: Eye, title: "Stay Aware", body: "Keep one earbud out in public. Scan exits in any new room." },
  { icon: Footprints, title: "Walk With Purpose", body: "Confident gait, head up. Predators target the distracted." },
  { icon: Hand, title: "Soft Targets", body: "Eyes, throat, knees, groin. Strike, scream, run — in that order." },
  { icon: MapPin, title: "Share the Route", body: "Send your live location before stepping into a cab or new street." },
  { icon: Users, title: "Buddy System", body: "Pre-arrange a 'check-in by X o'clock' rule with a friend." },
  { icon: ShieldCheck, title: "Trust Instinct", body: "If it feels wrong, leave. You owe no one an explanation." },
];

function Guide() {
  return (
    <div className="app-shell px-5 pt-8">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Empowerment</p>
        <h1 className="text-3xl font-display font-bold gradient-text">Self Defense Guide</h1>
      </header>
      <div className="grid grid-cols-2 gap-3">
        {tips.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: "radial-gradient(circle at 30% 30%, oklch(0.78 0.13 350), oklch(0.35 0.18 295))", boxShadow: "0 0 18px oklch(0.78 0.13 350 / 0.4)" }}>
              <t.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-display font-semibold text-sm">{t.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
