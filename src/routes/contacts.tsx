import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Phone } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { addContact, getContacts, removeContact, whatsappLink, buildSOSMessage, getLocation, type Contact } from "@/lib/safeher";
import { toast } from "sonner";

export const Route = createFileRoute("/contacts")({
  head: () => ({ meta: [{ title: "Trusted Contacts — SafeGuard" }, { name: "description", content: "Save trusted emergency contacts for instant SOS alerts." }] }),
  component: ContactsPage,
});

function ContactsPage() {
  const [list, setList] = useState<Contact[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", relation: "" });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setList(getContacts());
  }, []);

  function add() {
    if (!form.name || !form.phone) { toast.error("Name and phone are required"); return; }
    setList(addContact(form));
    setForm({ name: "", phone: "", relation: "" });
    setOpen(false);
    toast.success("Contact added");
  }
  
  async function alertOne(c: Contact) {
    const loc = await getLocation();
    window.open(whatsappLink(c.phone, buildSOSMessage(loc)), "_blank");
  }

  return (
    <div className="app-shell px-5 pt-8">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Network</p>
          <h1 className="text-3xl font-display font-bold gradient-text">Trusted Contacts</h1>
        </div>
        <button onClick={() => setOpen(true)} className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
          style={{ background: "linear-gradient(135deg, oklch(0.45 0.15 150), oklch(0.55 0.18 155))", boxShadow: "0 0 24px oklch(0.45 0.15 150 / 0.4)" }}>
          <Plus className="w-5 h-5" />
        </button>
      </header>

      {list.length === 0 ? (
        <div className="glass rounded-3xl p-8 text-center">
          <p className="text-muted-foreground">No contacts yet. Add people you trust to receive instant SOS alerts.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((c, i) => (
            <motion.li key={c.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-display font-bold text-white"
                style={{ background: "linear-gradient(135deg, oklch(0.45 0.15 150), oklch(0.55 0.18 155))" }}>
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground truncate">{c.phone} {c.relation && `· ${c.relation}`}</p>
              </div>
              <a href={`tel:${c.phone}`} className="w-9 h-9 rounded-xl glass-strong flex items-center justify-center"><Phone className="w-4 h-4" /></a>
              <button onClick={() => alertOne(c)} className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: "oklch(0.5 0.15 150)" }} aria-label="Send WhatsApp alert">
                <MessageCircle className="w-4 h-4" />
              </button>
              <button onClick={() => setList(removeContact(c.id))} className="w-9 h-9 rounded-xl glass-strong flex items-center justify-center text-muted-foreground">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.li>
          ))}
        </ul>
      )}

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setOpen(false)}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-3xl p-6 w-full max-w-sm space-y-3">
              <h3 className="font-display text-xl font-bold">New Contact</h3>
              {(["name", "phone", "relation"] as const).map((f) => (
                <input key={f}
                  value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  placeholder={f === "phone" ? "+92 300 1234567" : f === "relation" ? "Relation (optional)" : "Full name"}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.15_150)]" />
              ))}
              <button onClick={add} className="w-full py-3 rounded-xl font-semibold text-white"
                style={{ background: "linear-gradient(135deg, oklch(0.45 0.15 150), oklch(0.55 0.18 155))" }}>
                Save Contact
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
