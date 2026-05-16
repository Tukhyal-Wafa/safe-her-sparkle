import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";

export default function VoiceTrigger({ onTrigger }: { onTrigger: () => void }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef<any>(null);
  const countsRef = useRef<{ word: string; t: number }[]>([]);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
  }, []);

  function start() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e: any) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript.toLowerCase();
        ["help", "danger", "bachao"].forEach((w) => {
          if (t.includes(w)) {
            const now = Date.now();
            countsRef.current = [...countsRef.current.filter((x) => now - x.t < 4000), { word: w, t: now }];
            const same = countsRef.current.filter((x) => x.word === w);
            if (same.length >= 3) {
              countsRef.current = [];
              onTrigger();
            }
          }
        });
      }
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => { if (listening) try { rec.start(); } catch {} };
    try { rec.start(); recRef.current = rec; setListening(true); toast.success("Voice guard active"); }
    catch { toast.error("Mic permission denied"); }
  }
  function stop() { recRef.current?.stop(); setListening(false); toast("Voice guard off"); }

  if (!supported) return null;
  return (
    <button
      onClick={listening ? stop : start}
      className="glass rounded-full px-4 py-2 flex items-center gap-2 text-xs font-medium"
    >
      {listening ? <Mic className="w-4 h-4 text-[oklch(0.7_0.2_145)]" /> : <MicOff className="w-4 h-4 text-muted-foreground" />}
      <span>{listening ? "Listening: say 'help' x3" : "Voice Guard"}</span>
    </button>
  );
}
