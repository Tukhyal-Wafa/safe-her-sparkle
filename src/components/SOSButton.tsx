import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { getContacts, getLocation, buildSOSMessage, whatsappLink, vibrate, pushHistory } from "@/lib/safeher";

export default function SOSButton({ onActivate }: { onActivate?: () => void }) {
  const [active, setActive] = useState(false);
  const lastTap = useRef(0);

  async function trigger() {
    setActive(true);
    vibrate([200, 100, 200, 100, 400]);
    onActivate?.();
    toast.loading("Locating you…", { id: "sos" });
    const loc = await getLocation();
    const message = buildSOSMessage(loc);
    const contacts = getContacts();
    pushHistory({ id: crypto.randomUUID(), ts: Date.now(), lat: loc?.lat, lng: loc?.lng });

    if (contacts.length === 0) {
      toast.error("Add trusted contacts first", { id: "sos" });
    } else {
      toast.success(`Opening WhatsApp for ${contacts.length} contact${contacts.length > 1 ? "s" : ""}`, { id: "sos" });
      // Open WhatsApp tab for each contact (first uses location.href so mobile launches the app)
      contacts.forEach((c, idx) => {
        const url = whatsappLink(c.phone, message);
        if (idx === 0) window.open(url, "_blank");
        else setTimeout(() => window.open(url, "_blank"), 400 * idx);
      });
    }
    setTimeout(() => setActive(false), 4000);
  }

  function handleTap() {
    const now = Date.now();
    if (now - lastTap.current < 600) {
      lastTap.current = 0;
      trigger();
    } else {
      lastTap.current = now;
      toast("Tap again to activate SOS", { duration: 800 });
    }
  }

  return (
    <div className="relative flex items-center justify-center py-8">
      <motion.div
        className="absolute w-72 h-72 rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, oklch(0.65 0.27 18 / 0.6), transparent 70%)" }}
        animate={{ scale: active ? [1, 1.5, 1] : [1, 1.15, 1], opacity: active ? [0.6, 0.2, 0.6] : [0.35, 0.5, 0.35] }}
        transition={{ duration: active ? 0.8 : 3, repeat: Infinity }}
      />
      <motion.button
        onClick={handleTap}
        whileTap={{ scale: 0.92 }}
        animate={active ? { scale: [1, 1.08, 1] } : {}}
        transition={active ? { duration: 0.5, repeat: Infinity } : {}}
        className="relative w-48 h-48 rounded-full flex flex-col items-center justify-center text-white font-display font-bold animate-pulse-ring animate-glow"
        style={{ background: "var(--gradient-sos)", boxShadow: "0 0 80px oklch(0.65 0.27 18 / 0.6)" }}
        aria-label="Activate SOS — double tap"
      >
        <ShieldAlert className="w-14 h-14 mb-1" strokeWidth={2.2} />
        <span className="text-3xl tracking-widest">SOS</span>
        <span className="text-[10px] opacity-80 mt-1">DOUBLE TAP</span>
      </motion.button>
    </div>
  );
}
