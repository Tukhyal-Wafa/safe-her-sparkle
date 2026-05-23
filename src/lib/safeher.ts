// SafeGuard app helpers - localStorage version
import { currentUser } from "./auth";

export type Contact = { id: string; name: string; phone: string; relation?: string | null };
export type SOSEvent = { id: string; ts: number; lat?: number; lng?: number; address?: string };
export type LocationData = { lat: number; lng: number; accuracy?: number; timestamp: number };
export type VoiceSettings = { keyword: string; repeatCount: number; enabled: boolean };
export type VideoRecording = { id: string; blob: Blob; timestamp: number };

const K_CONTACTS = "safeguard:contacts";
const K_HISTORY = "safeguard:history";
const K_LAST_LOCATION = "safeguard:lastLocation";
const K_VOICE_SETTINGS = "safeguard:voiceSettings";

const safeWindow = () => typeof window !== "undefined";

// UUID generator with fallback
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Contact operations with localStorage
export function getContacts(): Contact[] {
  if (!safeWindow()) return [];
  try { return JSON.parse(localStorage.getItem(K_CONTACTS) || "[]"); } catch { return []; }
}

export function saveContacts(c: Contact[]) {
  if (!safeWindow()) return;
  localStorage.setItem(K_CONTACTS, JSON.stringify(c));
}

export function addContact(c: Omit<Contact, "id">): Contact[] {
  const list = getContacts();
  list.push({ ...c, id: generateUUID() });
  saveContacts(list);
  return list;
}

export function removeContact(id: string): Contact[] {
  const list = getContacts().filter((x) => x.id !== id);
  saveContacts(list);
  return list;
}

// History/Incident operations with localStorage
export function getHistory(): SOSEvent[] {
  if (!safeWindow()) return [];
  try { return JSON.parse(localStorage.getItem(K_HISTORY) || "[]"); } catch { return []; }
}

export function pushHistory(e: Omit<SOSEvent, "id">): SOSEvent[] {
  const list = getHistory();
  const newEvent = { ...e, id: generateUUID() };
  list.unshift(newEvent);
  if (!safeWindow()) return list;
  localStorage.setItem(K_HISTORY, JSON.stringify(list.slice(0, 50)));
  return list;
}

export function clearHistory(): void {
  if (!safeWindow()) return;
  localStorage.removeItem(K_HISTORY);
}

export function saveLastLocation(loc: LocationData) {
  if (!safeWindow()) return;
  localStorage.setItem(K_LAST_LOCATION, JSON.stringify(loc));
}

export function getLastLocation(): LocationData | null {
  if (!safeWindow()) return null;
  try { return JSON.parse(localStorage.getItem(K_LAST_LOCATION) || "null"); } catch { return null; }
}

export async function getLocation(): Promise<{ lat: number; lng: number; accuracy?: number } | null> {
  if (!safeWindow() || !navigator.geolocation) return null;
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const loc = { 
          lat: p.coords.latitude, 
          lng: p.coords.longitude,
          accuracy: p.coords.accuracy 
        };
        saveLastLocation({ ...loc, timestamp: Date.now() });
        resolve(loc);
      },
      () => {
        // If current location fails, try to return last known location
        const lastLoc = getLastLocation();
        if (lastLoc) {
          resolve({ lat: lastLoc.lat, lng: lastLoc.lng, accuracy: lastLoc.accuracy });
        } else {
          resolve(null);
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  });
}

export function buildSOSMessage(loc: { lat: number; lng: number; accuracy?: number } | null) {
  if (!loc) {
    return "🚨 EMERGENCY ALERT 🚨\n\nI am in danger and need immediate help!\n\nLocation: Unable to determine current location\n\nPlease contact me immediately or call emergency services.";
  }
  
  const link = `https://www.google.com/maps?q=${loc.lat},${loc.lng}`;
  const accuracy = loc.accuracy ? `\nAccuracy: ±${Math.round(loc.accuracy)}m` : "";
  
  return `🚨 EMERGENCY ALERT 🚨\n\nI am in danger and need immediate help!\n\nMy current location:\n${link}${accuracy}\n\nPlease contact me immediately or call emergency services.`;
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

// Watch location continuously (for future real-time tracking feature)
export function watchLocation(callback: (loc: { lat: number; lng: number; accuracy?: number }) => void): number | null {
  if (!safeWindow() || !navigator.geolocation) return null;
  
  return navigator.geolocation.watchPosition(
    (p) => {
      const loc = {
        lat: p.coords.latitude,
        lng: p.coords.longitude,
        accuracy: p.coords.accuracy
      };
      saveLastLocation({ ...loc, timestamp: Date.now() });
      callback(loc);
    },
    (error) => console.error("Location watch error:", error),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
  );
}

export function clearLocationWatch(watchId: number) {
  if (safeWindow() && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
}

// Voice settings management with localStorage
export function getVoiceSettings(): VoiceSettings {
  if (!safeWindow()) return { keyword: "help", repeatCount: 3, enabled: false };
  try {
    const stored = localStorage.getItem(K_VOICE_SETTINGS);
    return stored ? JSON.parse(stored) : { keyword: "help", repeatCount: 3, enabled: false };
  } catch {
    return { keyword: "help", repeatCount: 3, enabled: false };
  }
}

export function saveVoiceSettings(settings: VoiceSettings): void {
  if (!safeWindow()) return;
  localStorage.setItem(K_VOICE_SETTINGS, JSON.stringify(settings));
}

// Send SMS to contacts
export async function sendSOSToContacts(message: string, location?: { lat: number; lng: number; accuracy?: number }): Promise<{ success: boolean; sent: number }> {
  const contacts = getContacts();
  if (contacts.length === 0) {
    return { success: false, sent: 0 };
  }

  let sent = 0;
  const contactIds: string[] = [];
  
  for (const contact of contacts) {
    try {
      // Open WhatsApp for each contact
      const url = whatsappLink(contact.phone, message);
      window.open(url, "_blank");
      sent++;
      contactIds.push(contact.id);
      // Small delay between opens
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to send to ${contact.name}:`, error);
    }
  }

  // Save incident to history
  if (sent > 0 && location) {
    pushHistory({
      ts: Date.now(),
      lat: location.lat,
      lng: location.lng
    });
  }

  return { success: sent > 0, sent };
}
