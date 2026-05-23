import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Video, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function FakeCall({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [duration, setDuration] = useState(0);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (!open) { setAnswered(false); setDuration(0); return; }
    if (!answered) return;
    const t = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(t);
  }, [open, answered]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between py-16 text-white"
          style={{ background: "linear-gradient(180deg, oklch(0.18 0.06 290), oklch(0.08 0.02 290))" }}
        >
          <div className="flex flex-col items-center gap-4 text-center px-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              {answered ? "Ongoing call" : "Incoming call"}
            </p>
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-display font-bold"
              style={{ background: "linear-gradient(135deg, oklch(0.45 0.15 150), oklch(0.55 0.18 155))", boxShadow: "0 0 60px oklch(0.45 0.15 150 / 0.5)" }}
            >
              M
            </motion.div>
            <h2 className="text-3xl font-display font-bold">Mom</h2>
            <p className="text-white/60">+92 300 1234567</p>
            {answered && <p className="text-white/80 font-mono mt-2">{fmt(duration)}</p>}
          </div>

          {answered ? (
            <div className="w-full max-w-xs flex justify-around items-center">
              <button className="w-14 h-14 rounded-full glass flex items-center justify-center"><Volume2 className="w-6 h-6" /></button>
              <button onClick={onClose} className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "oklch(0.6 0.26 25)", boxShadow: "0 0 40px oklch(0.6 0.26 25 / 0.6)" }}>
                <PhoneOff className="w-8 h-8" />
              </button>
              <button className="w-14 h-14 rounded-full glass flex items-center justify-center"><Video className="w-6 h-6" /></button>
            </div>
          ) : (
            <div className="w-full max-w-xs flex justify-between items-center">
              <button onClick={onClose} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "oklch(0.6 0.26 25)" }}>
                  <PhoneOff className="w-7 h-7" />
                </div>
                <span className="text-xs text-white/70">Decline</span>
              </button>
              <button onClick={() => setAnswered(true)} className="flex flex-col items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.5 0.15 150)", boxShadow: "0 0 36px oklch(0.5 0.15 150 / 0.5)" }}
                >
                  <Phone className="w-7 h-7" />
                </motion.div>
                <span className="text-xs text-white/70">Accept</span>
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
