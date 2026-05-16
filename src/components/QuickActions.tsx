import { Phone, MapPin, Flashlight, Siren, PhoneIncoming, HeartPulse } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { getLocation, buildSOSMessage } from "@/lib/safeher";
import FakeCall from "./FakeCall";

const actions = [
  { id: "police", label: "Police", icon: Phone, color: "oklch(0.65 0.27 18)", href: "tel:15" },
  { id: "helpline", label: "Women Helpline", icon: HeartPulse, color: "oklch(0.78 0.13 350)", href: "tel:1099" },
];

export default function QuickActions() {
  const [fake, setFake] = useState(false);
  const [torch, setTorch] = useState(false);
  const [alarm, setAlarm] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);

  async function shareLocation() {
    toast.loading("Getting location…", { id: "loc" });
    const loc = await getLocation();
    if (!loc) { toast.error("Location unavailable", { id: "loc" }); return; }
    const msg = buildSOSMessage(loc);
    toast.success("Ready to share", { id: "loc" });
    if (navigator.share) navigator.share({ text: msg }).catch(() => {});
    else navigator.clipboard?.writeText(msg).then(() => toast("Copied to clipboard"));
  }

  async function toggleTorch() {
    try {
      if (torch && trackRef.current) {
        trackRef.current.stop();
        trackRef.current = null;
        setTorch(false);
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      const track = stream.getVideoTracks()[0];
      // @ts-expect-error torch is non-standard
      await track.applyConstraints({ advanced: [{ torch: true }] });
      trackRef.current = track;
      setTorch(true);
    } catch {
      toast.error("Flashlight not supported on this device");
    }
  }

  function toggleAlarm() {
    if (alarm) {
      audioRef.current?.pause();
      setAlarm(false);
      return;
    }
    // Generate loud siren via WebAudio
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1400, ctx.currentTime + 0.5);
    osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 1);
    gain.gain.value = 0.4;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    setAlarm(true);
    audioRef.current = { pause: () => { osc.stop(); ctx.close(); setAlarm(false); } } as any;
  }

  const items = [
    ...actions.map((a) => ({ ...a, onClick: () => (window.location.href = a.href) })),
    { id: "loc", label: "Share Location", icon: MapPin, color: "oklch(0.7 0.22 305)", onClick: shareLocation },
    { id: "torch", label: torch ? "Light On" : "Flashlight", icon: Flashlight, color: "oklch(0.85 0.18 90)", onClick: toggleTorch },
    { id: "alarm", label: alarm ? "Stop Alarm" : "Loud Alarm", icon: Siren, color: "oklch(0.6 0.26 25)", onClick: toggleAlarm },
    { id: "fake", label: "Fake Call", icon: PhoneIncoming, color: "oklch(0.7 0.18 160)", onClick: () => setFake(true) },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {items.map((a, i) => (
          <motion.button
            key={a.id}
            onClick={a.onClick}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileTap={{ scale: 0.94 }}
            className="glass rounded-2xl p-3 flex flex-col items-center gap-2 aspect-square justify-center"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: `radial-gradient(circle at 30% 30%, ${a.color}, oklch(0.2 0.05 290))`, boxShadow: `0 0 18px ${a.color}55` }}
            >
              <a.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-[11px] text-center text-foreground/90 leading-tight">{a.label}</span>
          </motion.button>
        ))}
      </div>
      <FakeCall open={fake} onClose={() => setFake(false)} />
    </>
  );
}
