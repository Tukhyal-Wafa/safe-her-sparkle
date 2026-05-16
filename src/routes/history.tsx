import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, MapPin } from "lucide-react";
import { clearHistory, getHistory, type SOSEvent } from "@/lib/safeher";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "Emergency History — SafeHer" }, { name: "description", content: "Past SOS activations with timestamps and locations." }] }),
  component: History,
});

function History() {
  const [list, setList] = useState<SOSEvent[]>([]);
  useEffect(() => setList(getHistory()), []);
  return (
    <div className="app-shell px-5 pt-8">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Log</p>
          <h1 className="text-3xl font-display font-bold gradient-text">Emergency History</h1>
        </div>
        {list.length > 0 && (
          <button onClick={() => { clearHistory(); setList([]); }} className="text-xs glass rounded-full px-3 py-2 flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </header>
      {list.length === 0 ? (
        <div className="glass rounded-3xl p-8 text-center text-muted-foreground">No SOS events yet. Stay safe.</div>
      ) : (
        <ul className="space-y-3">
          {list.map((e) => (
            <li key={e.id} className="glass rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: "oklch(0.65 0.27 18)" }}>
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{new Date(e.ts).toLocaleString()}</p>
                {e.lat && e.lng ? (
                  <a className="text-xs text-[oklch(0.78_0.13_350)] underline" target="_blank" rel="noreferrer"
                    href={`https://www.google.com/maps?q=${e.lat},${e.lng}`}>
                    {e.lat.toFixed(4)}, {e.lng.toFixed(4)}
                  </a>
                ) : <p className="text-xs text-muted-foreground">Location unavailable</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
