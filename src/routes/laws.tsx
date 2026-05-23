import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone } from "lucide-react";

export const Route = createFileRoute("/laws")({
  head: () => ({ meta: [{ title: "Women Rights & Laws — SafeGuard" }, { name: "description", content: "Quick reference for women protection laws, helplines, and emergency numbers." }] }),
  component: Laws,
});

const laws = [
  { title: "Workplace Harassment", body: "Employers must provide a safe environment. Report incidents to the internal inquiry committee within 30 days; ombudsperson appeals are available regionally." },
  { title: "Domestic Violence", body: "Protected by domestic violence acts. Victims can seek protection orders, residence orders, and monetary relief through local magistrates." },
  { title: "Cybercrime Complaints", body: "Online harassment, blackmail, and impersonation are punishable. Report at the national cybercrime portal or nearest cybercrime wing." },
  { title: "Inheritance Rights", body: "Women are entitled to inherit property under personal and statutory laws. Consult a family lawyer to file a claim if denied." },
  { title: "Anti-Stalking Laws", body: "Repeated unwanted contact — physical or digital — is criminal. File an FIR; courts can issue restraining orders." },
];

const numbers = [
  { label: "Police", num: "15" },
  { label: "Women Helpline", num: "1099" },
  { label: "Ambulance", num: "1122" },
  { label: "Child Helpline", num: "1121" },
];

function Laws() {
  return (
    <div className="app-shell px-5 pt-8">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Know Your Rights</p>
        <h1 className="text-3xl font-display font-bold gradient-text">Laws & Helplines</h1>
      </header>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {numbers.map((n) => (
          <a key={n.num} href={`tel:${n.num}`} className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg, oklch(0.45 0.15 150), oklch(0.55 0.18 155))" }}>
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{n.label}</p>
              <p className="font-display font-bold text-lg">{n.num}</p>
            </div>
          </a>
        ))}
      </div>

      <Accordion type="single" collapsible className="space-y-2">
        {laws.map((l, i) => (
          <AccordionItem key={i} value={`l${i}`} className="glass rounded-2xl border-0 px-4">
            <AccordionTrigger className="font-display font-semibold hover:no-underline">{l.title}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{l.body}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
