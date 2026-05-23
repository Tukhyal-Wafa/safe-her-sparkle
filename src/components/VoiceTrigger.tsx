import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Settings } from "lucide-react";
import { toast } from "sonner";
import { getVoiceSettings, saveVoiceSettings, type VoiceSettings } from "@/lib/safeher";
import { motion, AnimatePresence } from "framer-motion";

export default function VoiceTrigger({ onTrigger }: { onTrigger: () => void }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<VoiceSettings>(getVoiceSettings());
  const recRef = useRef<any>(null);
  const countsRef = useRef<{ word: string; t: number }[]>([]);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
    
    // Load settings
    setSettings(getVoiceSettings());
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
        const transcript = e.results[i][0].transcript.toLowerCase();
        const keyword = settings.keyword.toLowerCase();
        
        if (transcript.includes(keyword)) {
          const now = Date.now();
          countsRef.current = [...countsRef.current.filter((x) => now - x.t < 5000), { word: keyword, t: now }];
          
          const matchCount = countsRef.current.filter((x) => x.word === keyword).length;
          
          if (matchCount >= settings.repeatCount) {
            countsRef.current = [];
            toast.success(`Detected "${keyword}" ${settings.repeatCount} times - Activating SOS!`);
            onTrigger();
            stop(); // Stop listening after trigger
          } else {
            toast(`Detected "${keyword}" (${matchCount}/${settings.repeatCount})`, { duration: 1000 });
          }
        }
      }
    };
    
    rec.onerror = () => setListening(false);
    rec.onend = () => { if (listening) try { rec.start(); } catch {} };
    
    try { 
      rec.start(); 
      recRef.current = rec; 
      setListening(true); 
      toast.success(`Voice guard active - Say "${settings.keyword}" ${settings.repeatCount} times`);
    } catch { 
      toast.error("Microphone permission denied"); 
    }
  }

  function stop() { 
    recRef.current?.stop(); 
    setListening(false); 
    toast("Voice guard off"); 
  }

  function saveSettings() {
    if (!settings.keyword.trim()) {
      toast.error("Keyword cannot be empty");
      return;
    }
    if (settings.repeatCount < 1 || settings.repeatCount > 10) {
      toast.error("Repeat count must be between 1 and 10");
      return;
    }
    saveVoiceSettings(settings);
    setShowSettings(false);
    toast.success("Voice settings saved");
    if (listening) {
      stop();
      setTimeout(start, 500);
    }
  }

  if (!supported) return null;

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={listening ? stop : start}
          className="glass rounded-full px-4 py-2 flex items-center gap-2 text-xs font-medium"
        >
          {listening ? <Mic className="w-4 h-4 text-[oklch(0.45_0.15_150)] animate-pulse" /> : <MicOff className="w-4 h-4 text-muted-foreground" />}
          <span>{listening ? `Listening: "${settings.keyword}" x${settings.repeatCount}` : "Voice Guard"}</span>
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="w-9 h-9 rounded-full glass flex items-center justify-center"
          aria-label="Voice settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-3xl p-6 w-full max-w-sm space-y-4"
            >
              <h3 className="font-display text-xl font-bold">Voice Guard Settings</h3>
              
              <div>
                <label className="text-sm font-medium block mb-2">Trigger Keyword</label>
                <input
                  type="text"
                  value={settings.keyword}
                  onChange={(e) => setSettings({ ...settings, keyword: e.target.value })}
                  placeholder="e.g., help, danger, emergency"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.15_150)]"
                />
                <p className="text-xs text-muted-foreground mt-1">The word you'll say to trigger SOS</p>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Repeat Count</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.repeatCount}
                  onChange={(e) => setSettings({ ...settings, repeatCount: parseInt(e.target.value) || 3 })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.15_150)]"
                />
                <p className="text-xs text-muted-foreground mt-1">How many times to repeat (1-10)</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 py-3 rounded-xl font-semibold border border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSettings}
                  className="flex-1 py-3 rounded-xl font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, oklch(0.45 0.15 150), oklch(0.55 0.18 155))" }}
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
