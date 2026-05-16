// Local storage helpers for SafeHer app
export type Contact = { id: string; name: string; phone: string; relation?: string };
export type SOSEvent = { id: string; ts: number; lat?: number; lng?: number; address?: string };

const K_CONTACTS = "safeher:contacts";
const K_HISTORY = "safeher:history";

const safeWindow = () => typeof window !== "undefined";

export function getContacts(): Contact[] {
  if (!safeWindow()) return [];
  try { return JSON.parse(localStorage.getItem(K_CONTACTS) || "[]"); } catch { return []; }
}
export function saveContacts(c: Contact[]) {
  if (!safeWindow()) return;
  localStorage.setItem(K_CONTACTS, JSON.stringify(c));
}
export function addContact(c: Omit<Contact, "id">) {
  const list = getContacts();
  list.push({ ...c, id: crypto.randomUUID() });
  saveContacts(list);
  return list;
}
export function removeContact(id: string) {
  const list = getContacts().filter((x) => x.id !== id);
  saveContacts(list);
  return list;
}

export function getHistory(): SOSEvent[] {
  if (!safeWindow()) return [];
  try { return JSON.parse(localStorage.getItem(K_HISTORY) || "[]"); } catch { return []; }
}
export function pushHistory(e: SOSEvent) {
  const list = getHistory();
  list.unshift(e);
  if (!safeWindow()) return list;
  localStorage.setItem(K_HISTORY, JSON.stringify(list.slice(0, 50)));
  return list;
}
export function clearHistory() {
  if (!safeWindow()) return;
  localStorage.removeItem(K_HISTORY);
}

export async function getLocation(): Promise<{ lat: number; lng: number } | null> {
  if (!safeWindow() || !navigator.geolocation) return null;
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
}

export function buildSOSMessage(loc: { lat: number; lng: number } | null) {
  const link = loc ? `https://www.google.com/maps?q=${loc.lat},${loc.lng}` : "(location unavailable)";
  return `I am in danger. Please help me. My current location: ${link}`;
}

export function smsLink(phone: string, body: string) {
  return `sms:${phone}?body=${encodeURIComponent(body)}`;
}

/** Normalize a phone number to international format for wa.me (digits only, no +). */
export function normalizePhone(phone: string, defaultCountry = "92") {
  let p = phone.replace(/[^\d+]/g, "");
  if (p.startsWith("+")) return p.slice(1);
  if (p.startsWith("00")) return p.slice(2);
  if (p.startsWith("0")) return defaultCountry + p.slice(1);
  return p;
}

export function whatsappLink(phone: string, body: string) {
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(body)}`;
}

export function vibrate(pattern: number | number[]) {
  if (safeWindow() && "vibrate" in navigator) navigator.vibrate(pattern);
}
