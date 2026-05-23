import { Phone, MapPin, Flashlight, Siren, PhoneIncoming, HeartPulse, Video } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { getLocation, buildSOSMessage, sendSOSToContacts, getContacts } from "@/lib/safeher";
import FakeCall from "./FakeCall";

const actions = [
  { id: "police", label: "Police", icon: Phone, color: "oklch(0.55 0.22 25)", href: "tel:15" },
  { id: "helpline", label: "Women Helpline", icon: HeartPulse, color: "oklch(0.45 0.15 150)", href: "tel:1099" },
];

export default function QuickActions() {
  const [fake, setFake] = useState(false);
  const [torch, setTorch] = useState(false);
  const [alarm, setAlarm] = useState(false);
  const [recording, setRecording] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function shareLocation() {
    toast.loading("Getting location…", { id: "loc" });
    const loc = await getLocation();
    if (!loc) { toast.error("Location unavailable", { id: "loc" }); return; }
    const msg = buildSOSMessage(loc);
    toast.success("Ready to share", { id: "loc" });
    if (navigator.share) {
      try {
        await navigator.share({ text: msg });
      } catch (err) {
        // User cancelled or share failed
        navigator.clipboard?.writeText(msg).then(() => toast("Copied to clipboard"));
      }
    } else {
      navigator.clipboard?.writeText(msg).then(() => toast("Copied to clipboard"));
    }
  }

  async function toggleTorch() {
    try {
      if (torch && streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        setTorch(false);
        toast("Flashlight off");
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment",
          advanced: [{ torch: true } as any]
        } 
      });
      
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as any;
      
      if (capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: true } as any]
        });
        streamRef.current = stream;
        setTorch(true);
        toast.success("Flashlight on");
      } else {
        stream.getTracks().forEach(track => track.stop());
        toast.error("Flashlight not supported on this device");
      }
    } catch (error) {
      console.error("Flashlight error:", error);
      toast.error("Flashlight not available. Check camera permissions.");
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

  async function toggleVideoRecording() {
    if (recording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setRecording(false);
      return;
    }

    try {
      // Start recording
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }, 
        audio: true 
      });
      
      streamRef.current = stream;
      chunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const contacts = getContacts();
        
        if (contacts.length === 0) {
          toast.error("Add contacts first to send video");
          return;
        }
        
        // Get location
        const loc = await getLocation();
        const locationText = loc 
          ? `Location: https://www.google.com/maps?q=${loc.lat},${loc.lng}` 
          : "Location unavailable";
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `emergency-video-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        
        toast.success(`Video saved! Share it manually with your contacts.\n${locationText}`, { 
          duration: 8000 
        });
        
        // Note: Actual sending via WhatsApp requires user action due to browser limitations
        // We can only open WhatsApp with text, not attach files automatically
        const message = `🚨 EMERGENCY VIDEO RECORDED 🚨\n\nI recorded an emergency video. Please contact me immediately!\n\n${locationText}`;
        await sendSOSToContacts(message);
      };
      
      mediaRecorder.start();
      setRecording(true);
      toast.success("Recording started - Tap again to stop and send", { duration: 3000 });
      
    } catch (error) {
      console.error("Video recording error:", error);
      toast.error("Camera/microphone access denied or not available");
    }
  }

  const items = [
    ...actions.map((a) => ({ ...a, onClick: () => (window.location.href = a.href) })),
    { id: "loc", label: "Share Location", icon: MapPin, color: "oklch(0.45 0.15 150)", onClick: shareLocation },
    { id: "video", label: recording ? "Stop Recording" : "Record Video", icon: Video, color: "oklch(0.55 0.18 200)", onClick: toggleVideoRecording },
    { id: "torch", label: torch ? "Light Off" : "Flashlight", icon: Flashlight, color: "oklch(0.75 0.18 90)", onClick: toggleTorch },
    { id: "alarm", label: alarm ? "Stop Alarm" : "Loud Alarm", icon: Siren, color: "oklch(0.55 0.22 25)", onClick: toggleAlarm },
    { id: "fake", label: "Fake Call", icon: PhoneIncoming, color: "oklch(0.55 0.18 200)", onClick: () => setFake(true) },
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
            className={`glass rounded-2xl p-3 flex flex-col items-center gap-2 aspect-square justify-center ${
              (a.id === "torch" && torch) || (a.id === "alarm" && alarm) || (a.id === "video" && recording) ? "ring-2 ring-[oklch(0.45_0.15_150)]" : ""
            }`}
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
