export type User = { name: string; email: string };
const K_USER = "safeher:user";
const K_USERS = "safeher:users";

type Stored = User & { password: string };

const isClient = () => typeof window !== "undefined";

export function currentUser(): User | null {
  if (!isClient()) return null;
  try { return JSON.parse(localStorage.getItem(K_USER) || "null"); } catch { return null; }
}

function allUsers(): Stored[] {
  if (!isClient()) return [];
  try { return JSON.parse(localStorage.getItem(K_USERS) || "[]"); } catch { return []; }
}

export function register(name: string, email: string, password: string): { ok: boolean; error?: string } {
  if (!isClient()) return { ok: false, error: "Unavailable" };
  const users = allUsers();
  const e = email.trim().toLowerCase();
  if (users.some((u) => u.email === e)) return { ok: false, error: "Email already registered" };
  users.push({ name: name.trim(), email: e, password });
  localStorage.setItem(K_USERS, JSON.stringify(users));
  localStorage.setItem(K_USER, JSON.stringify({ name: name.trim(), email: e }));
  return { ok: true };
}

export function login(email: string, password: string): { ok: boolean; error?: string } {
  if (!isClient()) return { ok: false, error: "Unavailable" };
  const e = email.trim().toLowerCase();
  const u = allUsers().find((x) => x.email === e && x.password === password);
  if (!u) return { ok: false, error: "Invalid email or password" };
  localStorage.setItem(K_USER, JSON.stringify({ name: u.name, email: u.email }));
  return { ok: true };
}

export function logout() {
  if (!isClient()) return;
  localStorage.removeItem(K_USER);
}