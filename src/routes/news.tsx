import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Newspaper, TrendingUp, Megaphone } from "lucide-react";

export const Route = createFileRoute("/news")({
  head: () => ({ meta: [{ title: "Safety News — SafeHer" }, { name: "description", content: "Latest women safety news, awareness campaigns, and self defense tips." }] }),
  component: News,
});

const articles = [
  { tag: "Campaign", icon: Megaphone, title: "Nationwide #SafeStreets initiative reaches 50 cities", excerpt: "Government partners with NGOs to install panic posts at major transit hubs.", time: "2h" },
  { tag: "Awareness", icon: TrendingUp, title: "Self-defense workshops see record sign-ups this month", excerpt: "Free Saturday sessions across community centers — booking opens online.", time: "5h" },
  { tag: "Law", icon: Newspaper, title: "New anti-harassment workplace policy takes effect", excerpt: "Employers required to publish reporting channels by Q3.", time: "1d" },
  { tag: "Tip", icon: TrendingUp, title: "5 tech habits that improve nightly commute safety", excerpt: "From live location pinging to fake-call apps — what really works.", time: "2d" },
  { tag: "Story", icon: Megaphone, title: "How one neighborhood watch cut incidents by 60%", excerpt: "A data-led approach combining street lighting and a shared alert app.", time: "3d" },
];

function News() {
  return (
    <div className="app-shell px-5 pt-8">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Stay Aware</p>
        <h1 className="text-3xl font-display font-bold gradient-text">Safety News</h1>
      </header>
      <div className="space-y-3">
        {articles.map((a, i) => (
          <motion.article key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full"
                style={{ background: "oklch(0.55 0.25 305 / 0.25)", color: "oklch(0.85 0.12 350)" }}>
                {a.tag}
              </span>
              <span className="text-[10px] text-muted-foreground">{a.time} ago</span>
            </div>
            <h3 className="font-display font-semibold leading-snug">{a.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{a.excerpt}</p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
