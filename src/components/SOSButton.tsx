import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { getContacts, getLocation, buildSOSMessage, sendSOSToContacts, vibrate, pushHistory } from "@/lib/safeher";

export default function SOSButton({ onActivate }: { onActivate?: () => void }) {
  const [active, setActive] = useState(false);
  const lastTap = useRef(0);

  async function trigger() {
    setActive(true);
    vibrate([200, 100, 200, 100, 400]);
    onActivate?.();
    
    const contacts = getContacts();
    if (contacts.length === 0) {
      toast.error("Add trusted contacts first to send SOS alerts", { id: "sos", duration: 4000 });
      setActive(false);
      return;
    }

    toast.loading("Getting your location...", { id: "sos" });
    
    const loc = await getLocation();
    const message = buildSOSMessage(loc);
    
    // Log to history
    pushHistory({ ts: Date.now(), lat: loc?.lat, lng: loc?.lng });

    toast.loading(`Sending SOS to ${contacts.length} contact${contacts.length > 1 ? "s" : ""}...`, { id: "sos" });
    
    // Send to all contacts automatically
    const result = await sendSOSToContacts(message, loc || undefined);
    
    if (result.success) {
      toast.success(`SOS sent to ${result.sent} contact${result.sent > 1 ? "s" : ""}! WhatsApp opened.`, { 
        id: "sos", 
        duration: 5000 
      });
    } else {
      toast.error("Failed to send SOS. Please try again.", { id: "sos" });
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
      toast("Tap again quickly to activate SOS", { duration: 800 });
    }
  }

  return (
    <div className="relative flex items-center justify-center py-8">
      <motion.div
        className="absolute w-72 h-72 rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.22 25 / 0.5), transparent 70%)" }}
        animate={{ scale: active ? [1, 1.5, 1] : [1, 1.15, 1], opacity: active ? [0.5, 0.2, 0.5] : [0.3, 0.4, 0.3] }}
        transition={{ duration: active ? 0.8 : 3, repeat: Infinity }}
      />
      <motion.button
        onClick={handleTap}
        whileTap={{ scale: 0.92 }}
        animate={active ? { scale: [1, 1.08, 1] } : {}}
        transition={active ? { duration: 0.5, repeat: Infinity } : {}}
        className="relative w-48 h-48 rounded-full flex flex-col items-center justify-center text-white font-display font-bold animate-pulse-ring animate-glow"
        style={{ background: "var(--gradient-sos)", boxShadow: "0 0 80px oklch(0.55 0.22 25 / 0.5)" }}
        aria-label="Activate SOS — double tap"
      >
        <ShieldAlert className="w-14 h-14 mb-1" strokeWidth={2.2} />
        <span className="text-3xl tracking-widest">SOS</span>
        <span className="text-[10px] opacity-80 mt-1">DOUBLE TAP</span>
      </motion.button>
    </div>
  );
}
